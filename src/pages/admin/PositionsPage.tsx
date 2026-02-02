import { useState } from 'react'
import {
  Paper,
  Title,
  Text,
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  Modal,
  Table,
  Badge,
  ActionIcon,
  Menu,
  Tabs,
  Select,
  Alert,
  Card,
  SimpleGrid
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconDotsVertical,
  IconBriefcase,
  IconFolder,
  IconSearch,
  IconInfoCircle,
  IconUsers,
  IconPower,
  IconAlertTriangle
} from '@tabler/icons-react'

// Tipos
interface PositionFamily {
  id: string
  name: string
  description: string
  is_active: boolean
  positionsCount: number
  createdAt: string
}

interface Position {
  id: string
  family_id: string | null
  familyName: string | null
  name: string
  code: string
  description: string
  is_active: boolean
  usersCount: number
  createdAt: string
}

// Mock data - Familias de Cargos
const mockFamilies: PositionFamily[] = [
  {
    id: '1',
    name: 'Gerencia',
    description: 'Cargos de nivel gerencial y directivo',
    is_active: true,
    positionsCount: 5,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Supervisión',
    description: 'Cargos de supervisión y coordinación',
    is_active: true,
    positionsCount: 8,
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    name: 'Operativo',
    description: 'Cargos operativos y de ejecución',
    is_active: true,
    positionsCount: 15,
    createdAt: '2024-01-15'
  },
  {
    id: '4',
    name: 'Administrativo',
    description: 'Cargos administrativos y de soporte',
    is_active: false,
    positionsCount: 0,
    createdAt: '2024-01-20'
  }
]

// Mock data - Cargos
const mockPositions: Position[] = [
  {
    id: '1',
    family_id: '1',
    familyName: 'Gerencia',
    name: 'Gerente General',
    code: 'GG-001',
    description: 'Responsable de la dirección general de la empresa',
    is_active: true,
    usersCount: 1,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    family_id: '1',
    familyName: 'Gerencia',
    name: 'Gerente de Operaciones',
    code: 'GO-001',
    description: 'Responsable de las operaciones y producción',
    is_active: true,
    usersCount: 1,
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    family_id: '2',
    familyName: 'Supervisión',
    name: 'Supervisor de Planta',
    code: 'SP-001',
    description: 'Supervisa las actividades de la planta de producción',
    is_active: true,
    usersCount: 3,
    createdAt: '2024-01-16'
  },
  {
    id: '4',
    family_id: '2',
    familyName: 'Supervisión',
    name: 'Coordinador de Seguridad',
    code: 'CS-001',
    description: 'Coordina las actividades de seguridad y prevención',
    is_active: true,
    usersCount: 2,
    createdAt: '2024-01-16'
  },
  {
    id: '5',
    family_id: '3',
    familyName: 'Operativo',
    name: 'Operador de Maquinaria',
    code: 'OM-001',
    description: 'Opera maquinaria pesada en planta',
    is_active: true,
    usersCount: 12,
    createdAt: '2024-01-17'
  },
  {
    id: '6',
    family_id: '3',
    familyName: 'Operativo',
    name: 'Técnico de Mantenimiento',
    code: 'TM-001',
    description: 'Realiza mantenimiento preventivo y correctivo',
    is_active: true,
    usersCount: 5,
    createdAt: '2024-01-17'
  },
  {
    id: '7',
    family_id: null,
    familyName: null,
    name: 'Consultor Externo',
    code: 'CE-001',
    description: 'Consultor sin familia asignada',
    is_active: true,
    usersCount: 2,
    createdAt: '2024-01-20'
  }
]

export function PositionsPage() {
  const [activeTab, setActiveTab] = useState<string | null>('positions')
  const [searchPositions, setSearchPositions] = useState('')
  const [searchFamilies, setSearchFamilies] = useState('')
  const [filterFamily, setFilterFamily] = useState<string | null>(null)
  
  // Estados para modales
  const [positionModalOpened, { open: openPositionModal, close: closePositionModal }] = useDisclosure(false)
  const [familyModalOpened, { open: openFamilyModal, close: closeFamilyModal }] = useDisclosure(false)
  const [deactivateModalOpened, { open: openDeactivateModal, close: closeDeactivateModal }] = useDisclosure(false)
  
  const [editingPosition, setEditingPosition] = useState<Position | null>(null)
  const [editingFamily, setEditingFamily] = useState<PositionFamily | null>(null)
  const [itemToDeactivate, setItemToDeactivate] = useState<{ type: 'position' | 'family', item: Position | PositionFamily } | null>(null)
  
  // Form state para Position
  const [positionForm, setPositionForm] = useState({
    name: '',
    code: '',
    family_id: '',
    description: ''
  })
  
  // Form state para Family
  const [familyForm, setFamilyForm] = useState({
    name: '',
    description: ''
  })

  // Filtrar posiciones
  const filteredPositions = mockPositions.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchPositions.toLowerCase()) ||
                         p.code.toLowerCase().includes(searchPositions.toLowerCase())
    const matchesFamily = !filterFamily || p.family_id === filterFamily
    return matchesSearch && matchesFamily
  })

  // Filtrar familias
  const filteredFamilies = mockFamilies.filter(f => 
    f.name.toLowerCase().includes(searchFamilies.toLowerCase())
  )

  // Handlers
  const handleOpenPositionModal = (position?: Position) => {
    if (position) {
      setEditingPosition(position)
      setPositionForm({
        name: position.name,
        code: position.code,
        family_id: position.family_id || '',
        description: position.description
      })
    } else {
      setEditingPosition(null)
      setPositionForm({ name: '', code: '', family_id: '', description: '' })
    }
    openPositionModal()
  }

  const handleOpenFamilyModal = (family?: PositionFamily) => {
    if (family) {
      setEditingFamily(family)
      setFamilyForm({
        name: family.name,
        description: family.description
      })
    } else {
      setEditingFamily(null)
      setFamilyForm({ name: '', description: '' })
    }
    openFamilyModal()
  }

  const handleDeactivate = (type: 'position' | 'family', item: Position | PositionFamily) => {
    setItemToDeactivate({ type, item })
    openDeactivateModal()
  }

  const handleConfirmDeactivate = () => {
    // Aquí iría la lógica de desactivación
    console.log('Desactivando:', itemToDeactivate)
    closeDeactivateModal()
    setItemToDeactivate(null)
  }

  // Family options para select
  const familyOptions = mockFamilies
    .filter(f => f.is_active)
    .map(f => ({ value: f.id, label: f.name }))

  return (
    <Stack gap="lg">
      {/* Header */}
      <Paper shadow="xs" p="lg" radius="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Title order={2}>Cargos</Title>
            <Text c="dimmed" size="sm">
              Administra los cargos y familias de cargos de tu organización
            </Text>
          </Stack>
        </Group>
      </Paper>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
        <Card shadow="xs" padding="lg" radius="md">
          <Group justify="space-between">
            <Stack gap={0}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Total Cargos</Text>
              <Text size="xl" fw={700}>{mockPositions.length}</Text>
            </Stack>
            <IconBriefcase size={32} color="var(--mantine-color-blue-6)" />
          </Group>
        </Card>
        <Card shadow="xs" padding="lg" radius="md">
          <Group justify="space-between">
            <Stack gap={0}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Cargos Activos</Text>
              <Text size="xl" fw={700} c="green">{mockPositions.filter(p => p.is_active).length}</Text>
            </Stack>
            <IconBriefcase size={32} color="var(--mantine-color-green-6)" />
          </Group>
        </Card>
        <Card shadow="xs" padding="lg" radius="md">
          <Group justify="space-between">
            <Stack gap={0}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Familias</Text>
              <Text size="xl" fw={700}>{mockFamilies.length}</Text>
            </Stack>
            <IconFolder size={32} color="var(--mantine-color-violet-6)" />
          </Group>
        </Card>
        <Card shadow="xs" padding="lg" radius="md">
          <Group justify="space-between">
            <Stack gap={0}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Usuarios Asignados</Text>
              <Text size="xl" fw={700}>{mockPositions.reduce((sum, p) => sum + p.usersCount, 0)}</Text>
            </Stack>
            <IconUsers size={32} color="var(--mantine-color-orange-6)" />
          </Group>
        </Card>
      </SimpleGrid>

      {/* Tabs Content */}
      <Paper shadow="xs" p="lg" radius="md">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List mb="md">
            <Tabs.Tab value="positions" leftSection={<IconBriefcase size={16} />}>
              Cargos
            </Tabs.Tab>
            <Tabs.Tab value="families" leftSection={<IconFolder size={16} />}>
              Familias de Cargos
            </Tabs.Tab>
          </Tabs.List>

          {/* Positions Tab */}
          <Tabs.Panel value="positions">
            <Stack gap="md">
              <Group justify="space-between">
                <Group>
                  <TextInput
                    placeholder="Buscar cargo..."
                    leftSection={<IconSearch size={16} />}
                    value={searchPositions}
                    onChange={(e) => setSearchPositions(e.target.value)}
                    style={{ width: 300 }}
                  />
                  <Select
                    placeholder="Filtrar por familia"
                    clearable
                    data={familyOptions}
                    value={filterFamily}
                    onChange={setFilterFamily}
                    style={{ width: 200 }}
                  />
                </Group>
                <Button leftSection={<IconPlus size={16} />} onClick={() => handleOpenPositionModal()}>
                  Nuevo Cargo
                </Button>
              </Group>

              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Código</Table.Th>
                    <Table.Th>Nombre</Table.Th>
                    <Table.Th>Familia</Table.Th>
                    <Table.Th>Usuarios</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    <Table.Th style={{ width: 80 }}>Acciones</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredPositions.map((position) => (
                    <Table.Tr key={position.id}>
                      <Table.Td>
                        <Text size="sm" ff="monospace" c="dimmed">{position.code}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Stack gap={2}>
                          <Text size="sm" fw={500}>{position.name}</Text>
                          {position.description && (
                            <Text size="xs" c="dimmed" lineClamp={1}>{position.description}</Text>
                          )}
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        {position.familyName ? (
                          <Badge variant="light" color="violet">{position.familyName}</Badge>
                        ) : (
                          <Text size="sm" c="dimmed">Sin familia</Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <IconUsers size={14} color="gray" />
                          <Text size="sm">{position.usersCount}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={position.is_active ? 'green' : 'gray'}>
                          {position.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Menu shadow="md" width={180}>
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item 
                              leftSection={<IconPencil size={14} />}
                              onClick={() => handleOpenPositionModal(position)}
                            >
                              Editar
                            </Menu.Item>
                            {position.is_active ? (
                              <Menu.Item 
                                leftSection={<IconPower size={14} />}
                                color="orange"
                                onClick={() => handleDeactivate('position', position)}
                              >
                                Desactivar
                              </Menu.Item>
                            ) : (
                              <Menu.Item 
                                leftSection={<IconPower size={14} />}
                                color="green"
                              >
                                Activar
                              </Menu.Item>
                            )}
                            <Menu.Divider />
                            <Menu.Item 
                              leftSection={<IconTrash size={14} />}
                              color="red"
                              disabled={position.usersCount > 0}
                            >
                              Eliminar
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              {filteredPositions.length === 0 && (
                <Text ta="center" c="dimmed" py="xl">
                  No se encontraron cargos con los filtros aplicados
                </Text>
              )}
            </Stack>
          </Tabs.Panel>

          {/* Families Tab */}
          <Tabs.Panel value="families">
            <Stack gap="md">
              <Group justify="space-between">
                <TextInput
                  placeholder="Buscar familia..."
                  leftSection={<IconSearch size={16} />}
                  value={searchFamilies}
                  onChange={(e) => setSearchFamilies(e.target.value)}
                  style={{ width: 300 }}
                />
                <Button leftSection={<IconPlus size={16} />} onClick={() => handleOpenFamilyModal()}>
                  Nueva Familia
                </Button>
              </Group>

              <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
                Las familias de cargos permiten agrupar cargos similares para facilitar la gestión y el análisis de riesgos por categoría.
              </Alert>

              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Nombre</Table.Th>
                    <Table.Th>Descripción</Table.Th>
                    <Table.Th>Cargos</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    <Table.Th style={{ width: 80 }}>Acciones</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredFamilies.map((family) => (
                    <Table.Tr key={family.id}>
                      <Table.Td>
                        <Group gap="xs">
                          <IconFolder size={18} color="var(--mantine-color-violet-6)" />
                          <Text size="sm" fw={500}>{family.name}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed" lineClamp={1}>{family.description || '-'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="light">{family.positionsCount} cargos</Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={family.is_active ? 'green' : 'gray'}>
                          {family.is_active ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Menu shadow="md" width={180}>
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item 
                              leftSection={<IconPencil size={14} />}
                              onClick={() => handleOpenFamilyModal(family)}
                            >
                              Editar
                            </Menu.Item>
                            {family.is_active ? (
                              <Menu.Item 
                                leftSection={<IconPower size={14} />}
                                color="orange"
                                onClick={() => handleDeactivate('family', family)}
                              >
                                Desactivar
                              </Menu.Item>
                            ) : (
                              <Menu.Item 
                                leftSection={<IconPower size={14} />}
                                color="green"
                              >
                                Activar
                              </Menu.Item>
                            )}
                            <Menu.Divider />
                            <Menu.Item 
                              leftSection={<IconTrash size={14} />}
                              color="red"
                              disabled={family.positionsCount > 0}
                            >
                              Eliminar
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              {filteredFamilies.length === 0 && (
                <Text ta="center" c="dimmed" py="xl">
                  No se encontraron familias de cargos
                </Text>
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Paper>

      {/* Modal: Crear/Editar Cargo */}
      <Modal 
        opened={positionModalOpened} 
        onClose={closePositionModal}
        title={editingPosition ? 'Editar Cargo' : 'Nuevo Cargo'}
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Nombre del cargo"
            placeholder="Ej: Supervisor de Planta"
            required
            value={positionForm.name}
            onChange={(e) => setPositionForm({ ...positionForm, name: e.target.value })}
          />

          <TextInput
            label="Código"
            placeholder="Ej: SP-001"
            description="Código único para identificar el cargo"
            value={positionForm.code}
            onChange={(e) => setPositionForm({ ...positionForm, code: e.target.value })}
          />

          <Select
            label="Familia de cargo"
            placeholder="Seleccionar familia (opcional)"
            clearable
            data={familyOptions}
            value={positionForm.family_id}
            onChange={(value) => setPositionForm({ ...positionForm, family_id: value || '' })}
          />

          <Textarea
            label="Descripción"
            placeholder="Descripción del cargo y sus responsabilidades"
            rows={3}
            value={positionForm.description}
            onChange={(e) => setPositionForm({ ...positionForm, description: e.target.value })}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={closePositionModal}>
              Cancelar
            </Button>
            <Button onClick={closePositionModal}>
              {editingPosition ? 'Guardar cambios' : 'Crear cargo'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modal: Crear/Editar Familia */}
      <Modal 
        opened={familyModalOpened} 
        onClose={closeFamilyModal}
        title={editingFamily ? 'Editar Familia de Cargos' : 'Nueva Familia de Cargos'}
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Nombre de la familia"
            placeholder="Ej: Gerencia, Supervisión, Operativo"
            required
            value={familyForm.name}
            onChange={(e) => setFamilyForm({ ...familyForm, name: e.target.value })}
          />

          <Textarea
            label="Descripción"
            placeholder="Describe qué tipo de cargos agrupa esta familia"
            rows={3}
            value={familyForm.description}
            onChange={(e) => setFamilyForm({ ...familyForm, description: e.target.value })}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={closeFamilyModal}>
              Cancelar
            </Button>
            <Button onClick={closeFamilyModal}>
              {editingFamily ? 'Guardar cambios' : 'Crear familia'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modal: Confirmar Desactivación */}
      <Modal 
        opened={deactivateModalOpened} 
        onClose={closeDeactivateModal}
        title={
          <Group gap="xs">
            <IconAlertTriangle size={20} color="var(--mantine-color-orange-6)" />
            <Text>Confirmar Desactivación</Text>
          </Group>
        }
        size="md"
      >
        {itemToDeactivate && (
          <Stack gap="md">
            {itemToDeactivate.type === 'position' ? (
              <>
                <Text>
                  ¿Estás seguro de desactivar el cargo <strong>{(itemToDeactivate.item as Position).name}</strong>?
                </Text>
                {(itemToDeactivate.item as Position).usersCount > 0 && (
                  <Alert icon={<IconAlertTriangle size={16} />} color="orange" variant="light">
                    Este cargo tiene <strong>{(itemToDeactivate.item as Position).usersCount} usuario(s)</strong> asignados.
                    Los usuarios mantendrán su cargo actual, pero no se podrán asignar nuevos usuarios a este cargo hasta que sea reactivado.
                  </Alert>
                )}
              </>
            ) : (
              <>
                <Text>
                  ¿Estás seguro de desactivar la familia <strong>{(itemToDeactivate.item as PositionFamily).name}</strong>?
                </Text>
                {(itemToDeactivate.item as PositionFamily).positionsCount > 0 && (
                  <Alert icon={<IconAlertTriangle size={16} />} color="orange" variant="light">
                    Esta familia tiene <strong>{(itemToDeactivate.item as PositionFamily).positionsCount} cargo(s)</strong> asociados.
                    Los cargos mantendrán su familia actual, pero no se podrán crear nuevos cargos en esta familia hasta que sea reactivada.
                  </Alert>
                )}
              </>
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={closeDeactivateModal}>
                Cancelar
              </Button>
              <Button color="orange" onClick={handleConfirmDeactivate}>
                Desactivar
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  )
}
