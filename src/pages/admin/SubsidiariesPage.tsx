import { useState } from 'react'
import {
  Stack,
  Title,
  Text,
  Paper,
  Group,
  Button,
  Table,
  Badge,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Select,
  Alert,
  Box,
  ThemeIcon,
  Center,
  Tooltip
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import {
  IconPlus,
  IconDotsVertical,
  IconEdit,
  IconPlayerPause,
  IconPlayerPlay,
  IconAlertCircle,
  IconSearch,
  IconBuilding
} from '@tabler/icons-react'
import { InfoTooltip } from '../../components/InfoTooltip'

interface Subsidiary {
  id: string
  name: string
  code: string
  country: string
  ciiuCode: string
  status: 'ACTIVE' | 'SUSPENDED'
  areasCount: number
  usersCount: number
}

const mockSubsidiaries: Subsidiary[] = [
  { id: '1', name: 'Sede Principal', code: 'MAIN', country: 'Chile', ciiuCode: '4520', status: 'ACTIVE', areasCount: 8, usersCount: 45 },
  { id: '2', name: 'Planta Norte', code: 'NORTE', country: 'Chile', ciiuCode: '4520', status: 'ACTIVE', areasCount: 5, usersCount: 32 },
  { id: '3', name: 'Sucursal Perú', code: 'PERU', country: 'Perú', ciiuCode: '4520', status: 'SUSPENDED', areasCount: 3, usersCount: 12 },
]

const countries = [
  { value: 'CL', label: 'Chile' },
  { value: 'PE', label: 'Perú' },
  { value: 'CO', label: 'Colombia' },
  { value: 'MX', label: 'México' },
  { value: 'AR', label: 'Argentina' },
]

export function SubsidiariesPage() {
  const [subsidiaries, setSubsidiaries] = useState(mockSubsidiaries)
  const [opened, { open, close }] = useDisclosure(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const form = useForm({
    initialValues: {
      name: '',
      code: '',
      country: '',
      ciiuCode: ''
    },
    validate: {
      name: (value) => (!value ? 'Nombre requerido' : null),
      code: (value) => (!value ? 'Código requerido' : null),
      country: (value) => (!value ? 'País requerido' : null)
    }
  })

  const handleOpenNew = () => {
    setEditingId(null)
    form.reset()
    open()
  }

  const handleOpenEdit = (subsidiary: Subsidiary) => {
    setEditingId(subsidiary.id)
    form.setValues({
      name: subsidiary.name,
      code: subsidiary.code,
      country: subsidiary.country,
      ciiuCode: subsidiary.ciiuCode
    })
    open()
  }

  const handleSubmit = form.onSubmit((values) => {
    if (editingId) {
      setSubsidiaries(subs => subs.map(s =>
        s.id === editingId ? { ...s, ...values } : s
      ))
    } else {
      setSubsidiaries(subs => [...subs, {
        id: String(Date.now()),
        ...values,
        status: 'ACTIVE',
        areasCount: 0,
        usersCount: 0
      }])
    }
    close()
    form.reset()
  })

  const toggleStatus = (id: string) => {
    setSubsidiaries(subs => subs.map(s =>
      s.id === id ? { ...s, status: s.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : s
    ))
  }

  const filteredSubsidiaries = subsidiaries.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <Box>
          <Group gap={4}>
            <Title order={2}>Filiales</Title>
            <InfoTooltip
              label="Las filiales representan las diferentes empresas, sedes o sucursales de tu organización. Cada filial puede tener sus propias áreas y usuarios."
              multiline
              maxWidth={280}
            />
          </Group>
          <Text c="dimmed">Gestiona las filiales y sub-empresas de tu organización</Text>
        </Box>
        <Button leftSection={<IconPlus size={16} />} onClick={handleOpenNew}>
          Nueva filial
        </Button>
      </Group>

      {/* Search */}
      <TextInput
        placeholder="Buscar por nombre o código..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        w={300}
      />

      {/* Table with Empty State */}
      <Paper withBorder>
        {filteredSubsidiaries.length > 0 ? (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nombre</Table.Th>
                <Table.Th>Código</Table.Th>
                <Table.Th>País</Table.Th>
                <Table.Th>CIIU</Table.Th>
                <Table.Th>Áreas</Table.Th>
                <Table.Th>Usuarios</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th w={100}>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredSubsidiaries.map((subsidiary) => (
                <Table.Tr key={subsidiary.id}>
                  <Table.Td>
                    <Group gap="xs">
                      <IconBuilding size={16} color="#737373" />
                      <Text fw={500}>{subsidiary.name}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="gray">{subsidiary.code}</Badge>
                  </Table.Td>
                  <Table.Td>{subsidiary.country}</Table.Td>
                  <Table.Td>{subsidiary.ciiuCode || '-'}</Table.Td>
                  <Table.Td>{subsidiary.areasCount}</Table.Td>
                  <Table.Td>{subsidiary.usersCount}</Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color={subsidiary.status === 'ACTIVE' ? 'green' : 'red'}
                    >
                      {subsidiary.status === 'ACTIVE' ? 'Activa' : 'Suspendida'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      {subsidiary.status === 'ACTIVE' && (
                        <Tooltip label="Suspender filial" withArrow position="left">
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            size="sm"
                            onClick={() => toggleStatus(subsidiary.id)}
                          >
                            <IconPlayerPause size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                      {subsidiary.status === 'SUSPENDED' && (
                        <Tooltip label="Reactivar filial" withArrow position="left">
                          <ActionIcon
                            variant="subtle"
                            color="green"
                            size="sm"
                            onClick={() => toggleStatus(subsidiary.id)}
                          >
                            <IconPlayerPlay size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                      <Menu shadow="md" width={180}>
                        <Menu.Target>
                          <Tooltip label="Más opciones" withArrow position="left">
                            <ActionIcon variant="subtle" color="gray">
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconEdit size={14} />}
                            onClick={() => handleOpenEdit(subsidiary)}
                          >
                            Editar
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          <Center p="xl" style={{ flexDirection: 'column', gap: 16 }}>
            <ThemeIcon size={64} radius="xl" color="gray" variant="light">
              <IconBuilding size={32} />
            </ThemeIcon>
            <Stack gap={4} align="center">
              <Text fw={500}>No se encontraron filiales</Text>
              <Text size="sm" c="dimmed">
                {search ? 'Prueba cambiando los filtros de búsqueda.' : 'Comienza registrando la sede principal de tu organización.'}
              </Text>
            </Stack>
            {!search && (
              <Button leftSection={<IconPlus size={16} />} onClick={handleOpenNew}>
                Nueva filial
              </Button>
            )}
          </Center>
        )}
      </Paper>

      {/* Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingId ? 'Editar filial' : 'Nueva filial'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Nombre"
              placeholder="Ej: Sede Principal"
              withAsterisk
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Código"
              placeholder="Ej: MAIN"
              description="Identificador único de la filial"
              withAsterisk
              {...form.getInputProps('code')}
            />
            <Select
              label="País"
              placeholder="Seleccionar país"
              data={countries}
              withAsterisk
              {...form.getInputProps('country')}
            />
            <Stack gap="xs">
              <Group gap="xs" align="flex-start">
                <TextInput
                  label="Código CIIU"
                  placeholder="Ej: 4520"
                  description="Clasificación Industrial Internacional Uniforme"
                  style={{ flex: 1 }}
                  {...form.getInputProps('ciiuCode')}
                />
                <Box mt={24}>
                  <InfoTooltip
                    label="El código CIIU identifica la actividad económica principal de la filial según normas internacionales. Útil para reportes legales y auditorías."
                    multiline
                    maxWidth={260}
                  />
                </Box>
              </Group>
            </Stack>
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close}>Cancelar</Button>
              <Button type="submit">{editingId ? 'Guardar' : 'Crear'}</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Wireframe annotation */}
      <Alert variant="light" color="yellow" title="AC: S1-03.0" icon={<IconAlertCircle size={16} />}>
        <Text size="xs">
          • Puedo crear una filial con name, code, country, ciiu_code<br />
          • Puedo editar datos de filial<br />
          • Puedo suspender filial (no borra data)<br />
          • No puedo eliminar filial si tiene áreas/usuarios asociados (solo suspender)<br />
          • Auditoría registra eventos de filial
        </Text>
      </Alert>
    </Stack>
  )
}
