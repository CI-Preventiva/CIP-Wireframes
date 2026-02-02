import { useState } from 'react'
import {
  Stack,
  Title,
  Text,
  Paper,
  Group,
  Button,
  TextInput,
  Alert,
  Box,
  ThemeIcon,
  Badge,
  Table,
  ActionIcon,
  Tooltip,
  Modal
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import {
  IconAlertCircle,
  IconCheck,
  IconEdit,
  IconHierarchy3
} from '@tabler/icons-react'
import { InfoTooltip } from '../../components/InfoTooltip'

interface HierarchyLevel {
  id: string
  name: string
  levelOrder: number
  isActive: boolean
  unitsCount: number
}

const mockLevels: HierarchyLevel[] = [
  { id: '1', name: 'División', levelOrder: 1, isActive: true, unitsCount: 3 },
  { id: '2', name: 'Gerencia', levelOrder: 2, isActive: true, unitsCount: 8 },
  { id: '3', name: 'Departamento', levelOrder: 3, isActive: true, unitsCount: 15 },
]

export function HierarchyLevelsPage() {
  const [levels, setLevels] = useState<HierarchyLevel[]>(mockLevels)
  const [opened, { open, close }] = useDisclosure(false)
  const [editingLevel, setEditingLevel] = useState<HierarchyLevel | null>(null)
  const [isConfigured, setIsConfigured] = useState(true)

  const form = useForm({
    initialValues: {
      name: '',
      levelOrder: 1
    },
    validate: {
      name: (value) => (!value ? 'Nombre requerido' : null)
    }
  })

  const handleOpenEdit = (level: HierarchyLevel) => {
    setEditingLevel(level)
    form.setValues({
      name: level.name,
      levelOrder: level.levelOrder
    })
    open()
  }

  const handleSubmit = form.onSubmit((values) => {
    if (editingLevel) {
      setLevels(prev => prev.map(l =>
        l.id === editingLevel.id ? { ...l, name: values.name } : l
      ))
    }
    close()
    form.reset()
    setEditingLevel(null)
  })

  const handleQuickSetup = () => {
    setLevels([
      { id: '1', name: 'División', levelOrder: 1, isActive: true, unitsCount: 0 },
      { id: '2', name: 'Área', levelOrder: 2, isActive: true, unitsCount: 0 },
      { id: '3', name: 'Subárea', levelOrder: 3, isActive: true, unitsCount: 0 },
    ])
    setIsConfigured(true)
  }

  const handleCustomSetup = () => {
    setIsConfigured(true)
  }

  // Si no está configurado, mostrar wizard inicial
  if (!isConfigured) {
    return (
      <Stack gap="lg">
        <Box>
          <Group gap="xs">
            <Title order={2}>Definir estructura jerárquica</Title>
            <InfoTooltip
              label="Define los nombres de los 3 niveles jerárquicos de tu organización. Esto permite reflejar tu organigrama real en el sistema."
              multiline
              maxWidth={300}
            />
          </Group>
          <Text c="dimmed">Configura los niveles de tu estructura organizacional</Text>
        </Box>

        <Alert color="blue" icon={<IconHierarchy3 size={16} />}>
          <Text size="sm">
            Tu estructura organizacional tendrá <strong>3 niveles jerárquicos</strong>. 
            Puedes usar los nombres predeterminados o personalizarlos según tu empresa.
          </Text>
        </Alert>

        <Paper withBorder p="xl">
          <Stack gap="xl">
            <Box ta="center">
              <ThemeIcon size={64} radius="xl" variant="light" color="dark" mx="auto" mb="md">
                <IconHierarchy3 size={32} />
              </ThemeIcon>
              <Title order={3}>¿Cómo quieres nombrar tus niveles?</Title>
              <Text c="dimmed" mt="xs">
                Elige la opción que mejor se adapte a tu organización
              </Text>
            </Box>

            <Paper withBorder p="lg" bg="gray.0">
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Text fw={500}>Usar nombres predeterminados</Text>
                  <Text size="sm" c="dimmed">División → Área → Subárea</Text>
                  <Text size="xs" c="dimmed" mt="xs">
                    Ideal si tu organización sigue una estructura tradicional
                  </Text>
                </Box>
                <Button variant="filled" onClick={handleQuickSetup}>
                  Usar predeterminados
                </Button>
              </Group>
            </Paper>

            <Paper withBorder p="lg">
              <Stack gap="md">
                <Box>
                  <Text fw={500}>Personalizar nombres</Text>
                  <Text size="sm" c="dimmed">Define nombres específicos para cada nivel</Text>
                </Box>
                
                <Group grow>
                  <TextInput
                    label="Nivel 1 (Superior)"
                    placeholder="Ej: División, Dirección, Vicepresidencia"
                    defaultValue="División"
                  />
                  <TextInput
                    label="Nivel 2 (Intermedio)"
                    placeholder="Ej: Gerencia, Área, Departamento"
                    defaultValue="Gerencia"
                  />
                  <TextInput
                    label="Nivel 3 (Inferior)"
                    placeholder="Ej: Subárea, Equipo, Unidad"
                    defaultValue="Departamento"
                  />
                </Group>

                <Group justify="flex-end">
                  <Button variant="light" onClick={handleCustomSetup}>
                    Guardar nombres personalizados
                  </Button>
                </Group>
              </Stack>
            </Paper>

            <Alert variant="light" color="gray" icon={<IconAlertCircle size={16} />}>
              <Text size="xs">
                <strong>Ejemplo de estructura:</strong><br/>
                Nivel 1: "Dirección de Operaciones" (División)<br/>
                → Nivel 2: "Gerencia de Producción" (Gerencia)<br/>
                → → Nivel 3: "Línea de Ensamble A" (Departamento)
              </Text>
            </Alert>
          </Stack>
        </Paper>
      </Stack>
    )
  }

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <Box>
          <Group gap="xs">
            <Title order={2}>Niveles jerárquicos</Title>
            <InfoTooltip
              label="Los niveles jerárquicos definen la estructura de tu organización. Puedes cambiar los nombres en cualquier momento."
              multiline
              maxWidth={280}
            />
          </Group>
          <Text c="dimmed">Configura los nombres de los niveles de tu estructura organizacional</Text>
        </Box>
      </Group>

      {/* Success message */}
      <Alert 
        icon={<IconCheck size={16} />} 
        color="green" 
        variant="light"
        title="Estructura configurada"
      >
        <Text size="sm">
          Tu organización tiene configurados <strong>3 niveles jerárquicos</strong>. 
          Ahora puedes crear unidades organizacionales en cada nivel.
        </Text>
      </Alert>

      {/* Preview */}
      <Paper withBorder p="lg">
        <Text fw={500} mb="md">Vista previa de tu estructura</Text>
        <Box
          style={{
            borderLeft: '3px solid #228be6',
            paddingLeft: 16
          }}
        >
          {levels.map((level, index) => (
            <Box key={level.id} ml={index * 24} mb="sm">
              <Group gap="xs">
                <Badge variant="filled" color={index === 0 ? 'blue' : index === 1 ? 'cyan' : 'teal'}>
                  Nivel {level.levelOrder}
                </Badge>
                <Text fw={500}>{level.name}</Text>
                {level.unitsCount > 0 && (
                  <Text size="xs" c="dimmed">({level.unitsCount} unidades creadas)</Text>
                )}
              </Group>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Table */}
      <Paper withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={60}>Orden</Table.Th>
              <Table.Th>Nombre del nivel</Table.Th>
              <Table.Th>Unidades creadas</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th w={100}>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {levels.sort((a, b) => a.levelOrder - b.levelOrder).map((level) => (
              <Table.Tr key={level.id}>
                <Table.Td>
                  <Badge variant="light" color="gray">
                    {level.levelOrder}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <IconHierarchy3 size={16} color="#737373" />
                    <Text fw={500}>{level.name}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{level.unitsCount}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" color={level.isActive ? 'green' : 'red'}>
                    {level.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Tooltip label="Editar nombre" withArrow position="left">
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      onClick={() => handleOpenEdit(level)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={`Editar: Nivel ${editingLevel?.levelOrder}`}
        size="sm"
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Nombre del nivel"
              placeholder="Ej: División, Gerencia, Departamento"
              withAsterisk
              {...form.getInputProps('name')}
            />
            
            <Alert variant="light" color="gray" icon={<IconAlertCircle size={16} />}>
              <Text size="xs">
                Cambiar el nombre del nivel actualizará cómo se muestra en toda la plataforma, 
                pero no afectará las unidades organizacionales ya creadas.
              </Text>
            </Alert>

            <Group justify="flex-end">
              <Button variant="light" onClick={close}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Wireframe annotation */}
      <Alert variant="light" color="yellow" title="RF-S1-01.02 / HU-S1-02" icon={<IconAlertCircle size={16} />}>
        <Text size="xs">
          • Definir estructura jerárquica de 3 niveles predefinidos<br/>
          • Por defecto: División → Área → Subárea<br/>
          • Owner puede personalizar los nombres de cada nivel<br/>
          • Los nombres son solo etiquetas de visualización<br/>
          • Los 3 niveles son fijos, pero se puede optar por usar menos en la práctica
        </Text>
      </Alert>
    </Stack>
  )
}
