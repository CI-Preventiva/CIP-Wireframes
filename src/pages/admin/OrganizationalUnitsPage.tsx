import { useState } from 'react'
import {
  Stack,
  Title,
  Text,
  Paper,
  Group,
  Button,
  Badge,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Select,
  Textarea,
  Alert,
  Box,
  ThemeIcon,
  Center,
  Tooltip,
  SegmentedControl,
  Checkbox,
  Table
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import {
  IconPlus,
  IconDotsVertical,
  IconEdit,
  IconAlertCircle,
  IconSearch,
  IconSitemap,
  IconFolder,
  IconFolderOpen,
  IconChevronRight,
  IconChevronDown,
  IconMapPin,
  IconPlayerPause,
  IconPlayerPlay,
  IconList,
  IconHierarchy,
  IconUsers
} from '@tabler/icons-react'
import { InfoTooltip } from '../../components/InfoTooltip'

interface OrganizationalUnit {
  id: string
  name: string
  code?: string
  description?: string
  country?: string
  parentId?: string
  levelDefinitionId: string
  levelOrder: number
  levelName: string
  isActive: boolean
  usersCount: number
  children?: OrganizationalUnit[]
}

interface HierarchyLevel {
  id: string
  name: string
  levelOrder: number
}

const hierarchyLevels: HierarchyLevel[] = [
  { id: 'l1', name: 'División', levelOrder: 1 },
  { id: 'l2', name: 'Gerencia', levelOrder: 2 },
  { id: 'l3', name: 'Departamento', levelOrder: 3 },
]

// Mock data con estructura de 3 niveles
const mockUnits: OrganizationalUnit[] = [
  // Nivel 1: Divisiones
  {
    id: 'div-1',
    name: 'Dirección de Operaciones',
    code: 'OP',
    country: 'Chile',
    levelDefinitionId: 'l1',
    levelOrder: 1,
    levelName: 'División',
    isActive: true,
    usersCount: 45,
    children: [
      // Nivel 2: Gerencias
      {
        id: 'ger-1',
        name: 'Gerencia de Producción',
        code: 'PROD',
        parentId: 'div-1',
        levelDefinitionId: 'l2',
        levelOrder: 2,
        levelName: 'Gerencia',
        isActive: true,
        usersCount: 25,
        children: [
          // Nivel 3: Departamentos
          { id: 'dep-1', name: 'Línea de Ensamble A', code: 'EA', parentId: 'ger-1', levelDefinitionId: 'l3', levelOrder: 3, levelName: 'Departamento', isActive: true, usersCount: 12 },
          { id: 'dep-2', name: 'Línea de Ensamble B', code: 'EB', parentId: 'ger-1', levelDefinitionId: 'l3', levelOrder: 3, levelName: 'Departamento', isActive: true, usersCount: 13 },
        ]
      },
      {
        id: 'ger-2',
        name: 'Gerencia de Mantenimiento',
        code: 'MANT',
        parentId: 'div-1',
        levelDefinitionId: 'l2',
        levelOrder: 2,
        levelName: 'Gerencia',
        isActive: true,
        usersCount: 15,
        children: [
          { id: 'dep-3', name: 'Mantenimiento Preventivo', code: 'MP', parentId: 'ger-2', levelDefinitionId: 'l3', levelOrder: 3, levelName: 'Departamento', isActive: true, usersCount: 8 },
          { id: 'dep-4', name: 'Mantenimiento Correctivo', code: 'MC', parentId: 'ger-2', levelDefinitionId: 'l3', levelOrder: 3, levelName: 'Departamento', isActive: true, usersCount: 7 },
        ]
      },
    ]
  },
  {
    id: 'div-2',
    name: 'Dirección de Administración',
    code: 'ADM',
    country: 'Chile',
    levelDefinitionId: 'l1',
    levelOrder: 1,
    levelName: 'División',
    isActive: true,
    usersCount: 20,
    children: [
      {
        id: 'ger-3',
        name: 'Gerencia de RRHH',
        code: 'RRHH',
        parentId: 'div-2',
        levelDefinitionId: 'l2',
        levelOrder: 2,
        levelName: 'Gerencia',
        isActive: true,
        usersCount: 10,
        children: [
          { id: 'dep-5', name: 'Reclutamiento', code: 'REC', parentId: 'ger-3', levelDefinitionId: 'l3', levelOrder: 3, levelName: 'Departamento', isActive: true, usersCount: 5 },
          { id: 'dep-6', name: 'Capacitación', code: 'CAP', parentId: 'ger-3', levelDefinitionId: 'l3', levelOrder: 3, levelName: 'Departamento', isActive: true, usersCount: 5 },
        ]
      },
      {
        id: 'ger-4',
        name: 'Gerencia de Finanzas',
        code: 'FIN',
        parentId: 'div-2',
        levelDefinitionId: 'l2',
        levelOrder: 2,
        levelName: 'Gerencia',
        isActive: true,
        usersCount: 8
      },
    ]
  },
  {
    id: 'div-3',
    name: 'Dirección Comercial',
    code: 'COM',
    country: 'Chile',
    levelDefinitionId: 'l1',
    levelOrder: 1,
    levelName: 'División',
    isActive: false,
    usersCount: 0
  },
]

const levelColors: Record<number, string> = {
  1: 'blue',
  2: 'cyan',
  3: 'teal'
}

export function OrganizationalUnitsPage() {
  const [units] = useState(mockUnits)
  const [opened, { open, close }] = useDisclosure(false)
  const [deactivateModal, { open: openDeactivate, close: closeDeactivate }] = useDisclosure(false)
  const [editingUnit, setEditingUnit] = useState<OrganizationalUnit | null>(null)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree')
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set(['div-1', 'div-2', 'ger-1', 'ger-2', 'ger-3']))
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [unitToDeactivate, setUnitToDeactivate] = useState<OrganizationalUnit | null>(null)
  const [cascadeDeactivate, setCascadeDeactivate] = useState(true)

  const form = useForm({
    initialValues: {
      name: '',
      code: '',
      description: '',
      country: '',
      parentId: '',
      levelDefinitionId: 'l1'
    },
    validate: {
      name: (value) => (!value ? 'Nombre requerido' : null),
      levelDefinitionId: (value) => (!value ? 'Nivel requerido' : null)
    }
  })

  // Obtener lista plana de unidades para selects
  const flattenUnits = (unitsList: OrganizationalUnit[], prefix = ''): { value: string; label: string; level: number, unit: OrganizationalUnit }[] => {
    let result: { value: string; label: string; level: number, unit: OrganizationalUnit }[] = []
    unitsList.forEach(unit => {
      result.push({ 
        value: unit.id, 
        label: `${prefix}${unit.name} (${unit.levelName})`,
        level: unit.levelOrder,
        unit: unit
      })
      if (unit.children) {
        result = [...result, ...flattenUnits(unit.children, prefix + '— ')]
      }
    })
    return result
  }

  // Filtrar padres válidos según el nivel seleccionado
  const getValidParents = () => {
    const selectedLevelOrder = hierarchyLevels.find(l => l.id === form.values.levelDefinitionId)?.levelOrder || 1
    if (selectedLevelOrder === 1) return [] // Nivel 1 no tiene padre
    
    const allUnits = flattenUnits(units)
    return allUnits.filter(u => u.level === selectedLevelOrder - 1)
  }

  // Lógica de filtrado para el árbol
  const filterTree = (nodes: OrganizationalUnit[], term: string): OrganizationalUnit[] => {
    if (!term) return nodes
    
    return nodes.reduce((acc: OrganizationalUnit[], node) => {
      const matches = node.name.toLowerCase().includes(term.toLowerCase()) || 
                      (node.code && node.code.toLowerCase().includes(term.toLowerCase()))
      
      const filteredChildren = node.children ? filterTree(node.children, term) : []
      
      if (matches || filteredChildren.length > 0) {
        // Si coincide o tiene hijos que coinciden, lo mantenemos
        // Si tiene hijos filtrados, usamos esos. Si no, mantenemos los originales si el padre coincide
        // Pero para "search", queremos ver solo lo relevante.
        // Estrategia: Si el padre coincide, mostramos hijos? O solo el padre?
        // Mejor: Si padre coincide, mostramos padre (y sus hijos filtrados si hay).
        // Si padre NO coincide pero hijo sí, mostramos padre (como contenedor) y el hijo.
        
        // Clonar nodo para no mutar el original
        const newNode = { ...node }
        if (filteredChildren.length > 0) {
            newNode.children = filteredChildren
            // Auto expandir si hay búsqueda
            if (term && !expandedUnits.has(newNode.id)) {
                // Side effect in render? No ideal, but acceptable for wireframe logic or use useEffect
                // Better: rely on user expanding or expand all on search?
                // Let's just keep the structure
            }
        }
        acc.push(newNode)
      }
      return acc
    }, [])
  }

  const filteredTreeUnits = filterTree(units, search)

  // Lógica de filtrado para la lista plana
  const flatUnitsList = flattenUnits(units).map(i => i.unit)
  const filteredListUnits = flatUnitsList.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                           (u.code && u.code.toLowerCase().includes(search.toLowerCase()))
      const matchesLevel = selectedLevel ? u.levelDefinitionId === selectedLevel : true
      return matchesSearch && matchesLevel
  })

  // Expandir automáticamente al buscar
  if (search && filteredTreeUnits.length > 0 && expandedUnits.size === 5) { // 5 is initial size
       // Esto es un hack rápido para el wireframe. En prod usaríamos useEffect
       // No lo haré aquí para evitar loops infinitos
  }

  const handleOpenNew = (parentUnit?: OrganizationalUnit) => {
    setEditingUnit(null)
    form.reset()
    if (parentUnit) {
      const nextLevel = hierarchyLevels.find(l => l.levelOrder === parentUnit.levelOrder + 1)
      if (nextLevel) {
        form.setFieldValue('parentId', parentUnit.id)
        form.setFieldValue('levelDefinitionId', nextLevel.id)
      }
    }
    open()
  }

  const handleOpenEdit = (unit: OrganizationalUnit) => {
    setEditingUnit(unit)
    form.setValues({
      name: unit.name,
      code: unit.code || '',
      description: unit.description || '',
      country: unit.country || '',
      parentId: unit.parentId || '',
      levelDefinitionId: unit.levelDefinitionId
    })
    open()
  }

  const handleSubmit = form.onSubmit(() => {
    close()
    form.reset()
  })

  const toggleExpand = (unitId: string) => {
    setExpandedUnits(prev => {
      const next = new Set(prev)
      if (next.has(unitId)) {
        next.delete(unitId)
      } else {
        next.add(unitId)
      }
      return next
    })
  }

  const handleDeactivateClick = (unit: OrganizationalUnit) => {
    setUnitToDeactivate(unit)
    openDeactivate()
  }

  // Renderizar árbol de unidades
  const renderUnitTree = (unitsList: OrganizationalUnit[], level = 0) => {
    return unitsList.map(unit => {
      const isExpanded = expandedUnits.has(unit.id)
      const hasChildren = unit.children && unit.children.length > 0
      const nextLevel = hierarchyLevels.find(l => l.levelOrder === unit.levelOrder + 1)

      return (
        <Box key={unit.id}>
          <Paper
            withBorder
            p="sm"
            mb="xs"
            radius="md"
            style={{
              opacity: unit.isActive ? 1 : 0.6,
              borderColor: unit.isActive ? undefined : '#ef4444',
              borderStyle: unit.isActive ? 'solid' : 'dashed'
            }}
          >
            <Group justify="space-between">
              <Group gap="sm">
                {hasChildren ? (
                  <ActionIcon 
                    variant="subtle" 
                    color="gray" 
                    size="sm"
                    onClick={() => toggleExpand(unit.id)}
                  >
                    {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                  </ActionIcon>
                ) : (
                  <Box w={28} />
                )}
                <ThemeIcon
                  size="sm"
                  variant="light"
                  color={levelColors[unit.levelOrder]}
                >
                  {hasChildren ? <IconFolderOpen size={14} /> : <IconFolder size={14} />}
                </ThemeIcon>
                <Box>
                  <Group gap="xs">
                    <Text fw={500} size="sm">{unit.name}</Text>
                    {unit.code && (
                      <Badge size="xs" variant="light" color="gray">{unit.code}</Badge>
                    )}
                    <Badge size="xs" variant="light" color={levelColors[unit.levelOrder]}>
                      {unit.levelName}
                    </Badge>
                  </Group>
                  <Group gap="xs">
                    {unit.country && (
                      <Text size="xs" c="dimmed">
                        <IconMapPin size={10} style={{ marginRight: 2 }} />
                        {unit.country}
                      </Text>
                    )}
                    <Text size="xs" c="dimmed">{unit.usersCount} usuarios</Text>
                  </Group>
                </Box>
              </Group>
              <Group gap="xs">
                {!unit.isActive && (
                  <Badge size="xs" color="red" variant="light">Inactiva</Badge>
                )}
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Tooltip label="Más opciones" withArrow position="left">
                      <ActionIcon variant="subtle" color="gray" size="sm">
                        <IconDotsVertical size={14} />
                      </ActionIcon>
                    </Tooltip>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {nextLevel && unit.isActive && (
                      <Menu.Item
                        leftSection={<IconPlus size={14} />}
                        onClick={() => handleOpenNew(unit)}
                      >
                        Agregar {nextLevel.name}
                      </Menu.Item>
                    )}
                    <Menu.Item
                      leftSection={<IconEdit size={14} />}
                      onClick={() => handleOpenEdit(unit)}
                    >
                      Editar
                    </Menu.Item>
                    <Menu.Divider />
                    {unit.isActive ? (
                      <Menu.Item
                        leftSection={<IconPlayerPause size={14} />}
                        color="red"
                        onClick={() => handleDeactivateClick(unit)}
                      >
                        Desactivar
                      </Menu.Item>
                    ) : (
                      <Menu.Item
                        leftSection={<IconPlayerPlay size={14} />}
                        color="green"
                      >
                        Activar
                      </Menu.Item>
                    )}
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          </Paper>
          {hasChildren && isExpanded && (
            <Box ml={20} pl={20} style={{ borderLeft: '2px solid #e5e5e5' }}>
              {renderUnitTree(unit.children!, level + 1)}
            </Box>
          )}
        </Box>
      )
    })
  }

  // Renderizar vista de lista plana
  const renderListView = () => {
    return (
        <Table striped highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Nombre</Table.Th>
                    <Table.Th>Código</Table.Th>
                    <Table.Th>Nivel</Table.Th>
                    <Table.Th>Padre</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    <Table.Th>Usuarios</Table.Th>
                    <Table.Th>Acciones</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {filteredListUnits.map(unit => {
                    const parent = flatUnitsList.find(u => u.id === unit.parentId)
                    return (
                        <Table.Tr key={unit.id} style={{ opacity: unit.isActive ? 1 : 0.6 }}>
                            <Table.Td>
                                <Text size="sm" fw={500}>{unit.name}</Text>
                                {unit.country && <Text size="xs" c="dimmed">{unit.country}</Text>}
                            </Table.Td>
                            <Table.Td>
                                {unit.code ? <Badge variant="light" color="gray">{unit.code}</Badge> : '-'}
                            </Table.Td>
                            <Table.Td>
                                <Badge variant="light" color={levelColors[unit.levelOrder]}>{unit.levelName}</Badge>
                            </Table.Td>
                            <Table.Td>
                                {parent ? (
                                    <Text size="sm">{parent.name}</Text>
                                ) : (
                                    <Text size="xs" c="dimmed">-</Text>
                                )}
                            </Table.Td>
                            <Table.Td>
                                <Badge color={unit.isActive ? 'green' : 'red'} variant="dot">
                                    {unit.isActive ? 'Activa' : 'Inactiva'}
                                </Badge>
                            </Table.Td>
                            <Table.Td>
                                <Group gap={4}>
                                    <IconUsers size={14} color="gray" />
                                    <Text size="sm">{unit.usersCount}</Text>
                                </Group>
                            </Table.Td>
                            <Table.Td>
                                <Group gap={4}>
                                    <Tooltip label="Editar">
                                        <ActionIcon variant="subtle" color="blue" onClick={() => handleOpenEdit(unit)}>
                                            <IconEdit size={16} />
                                        </ActionIcon>
                                    </Tooltip>
                                    <Menu shadow="md">
                                        <Menu.Target>
                                            <ActionIcon variant="subtle" color="gray">
                                                <IconDotsVertical size={16} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            {unit.isActive ? (
                                                <Menu.Item 
                                                    leftSection={<IconPlayerPause size={14} />} 
                                                    color="red"
                                                    onClick={() => handleDeactivateClick(unit)}
                                                >
                                                    Desactivar
                                                </Menu.Item>
                                            ) : (
                                                <Menu.Item 
                                                    leftSection={<IconPlayerPlay size={14} />} 
                                                    color="green"
                                                >
                                                    Activar
                                                </Menu.Item>
                                            )}
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    )
                })}
            </Table.Tbody>
        </Table>
    )
  }

  // Contar unidades por nivel
  const countByLevel = (unitsList: OrganizationalUnit[]): Record<number, number> => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0 }
    const count = (units: OrganizationalUnit[]) => {
      units.forEach(u => {
        counts[u.levelOrder] = (counts[u.levelOrder] || 0) + 1
        if (u.children) count(u.children)
      })
    }
    count(unitsList)
    return counts
  }

  const levelCounts = countByLevel(units)

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <Box>
          <Group gap="xs">
            <Title order={2}>Estructura organizacional</Title>
            <InfoTooltip
              label="Gestiona las unidades organizacionales de tu empresa según los 3 niveles jerárquicos definidos. Cada unidad puede contener sub-unidades del siguiente nivel."
              multiline
              maxWidth={300}
            />
          </Group>
          <Text c="dimmed">Gestiona divisiones, gerencias y departamentos</Text>
        </Box>
        <Button leftSection={<IconPlus size={16} />} onClick={() => handleOpenNew()}>
          Nueva unidad
        </Button>
      </Group>

      {/* Stats by level */}
      <Group>
        {hierarchyLevels.map(level => (
          <Badge 
            key={level.id} 
            size="lg" 
            variant="light" 
            color={levelColors[level.levelOrder]}
            leftSection={<IconSitemap size={14} />}
          >
            {level.name}: {levelCounts[level.levelOrder] || 0}
          </Badge>
        ))}
      </Group>

      {/* Filters */}
      <Group justify="space-between">
        <Group>
          <TextInput
            placeholder="Buscar por nombre o código..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            w={280}
          />
          {viewMode === 'list' && (
            <Select
                placeholder="Filtrar por nivel"
                data={[
                { value: '', label: 'Todos los niveles' },
                ...hierarchyLevels.map(l => ({ value: l.id, label: l.name }))
                ]}
                value={selectedLevel}
                onChange={setSelectedLevel}
                clearable
                w={180}
            />
          )}
        </Group>
        <SegmentedControl
          value={viewMode}
          onChange={(v) => setViewMode(v as 'tree' | 'list')}
          data={[
            { 
              value: 'tree', 
              label: (
                <Center style={{ gap: 10 }}>
                  <IconHierarchy size={16} />
                  <span>Árbol</span>
                </Center>
              ) 
            },
            { 
              value: 'list', 
              label: (
                <Center style={{ gap: 10 }}>
                  <IconList size={16} />
                  <span>Lista</span>
                </Center>
              ) 
            },
          ]}
        />
      </Group>

      {/* Content View */}
      <Paper withBorder p="md">
        {viewMode === 'tree' ? (
            <>
                <Group mb="md" gap="xs">
                <IconSitemap size={18} />
                <Text fw={500}>Organigrama</Text>
                <Text size="sm" c="dimmed">
                    (click en ▶ para expandir/colapsar)
                </Text>
                </Group>

                {filteredTreeUnits.length > 0 ? (
                renderUnitTree(filteredTreeUnits)
                ) : (
                <Center p="xl">
                    <Text c="dimmed">No se encontraron unidades que coincidan con la búsqueda.</Text>
                </Center>
                )}
            </>
        ) : (
            <>
                {filteredListUnits.length > 0 ? (
                    renderListView()
                ) : (
                    <Center p="xl">
                        <Text c="dimmed">No se encontraron unidades con los filtros aplicados.</Text>
                    </Center>
                )}
            </>
        )}
      </Paper>

      {/* Modales (se mantienen igual) */}

      {/* Modal crear/editar */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingUnit ? 'Editar unidad organizacional' : 'Nueva unidad organizacional'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Select
              label="Nivel jerárquico"
              placeholder="Seleccionar nivel"
              data={hierarchyLevels.map(l => ({ value: l.id, label: `Nivel ${l.levelOrder}: ${l.name}` }))}
              withAsterisk
              disabled={!!editingUnit}
              {...form.getInputProps('levelDefinitionId')}
            />

            {form.values.levelDefinitionId !== 'l1' && (
              <Select
                label="Unidad padre"
                placeholder="Seleccionar unidad padre"
                data={getValidParents()}
                description="La unidad superior en la jerarquía"
                withAsterisk
                {...form.getInputProps('parentId')}
              />
            )}

            <TextInput
              label="Nombre de la unidad"
              placeholder="Ej: Dirección de Operaciones"
              withAsterisk
              {...form.getInputProps('name')}
            />

            <Group grow>
              <TextInput
                label="Código (opcional)"
                placeholder="Ej: OP"
                description="Identificador corto"
                {...form.getInputProps('code')}
              />
              <TextInput
                label="País (opcional)"
                placeholder="Ej: Chile"
                {...form.getInputProps('country')}
              />
            </Group>

            <Textarea
              label="Descripción (opcional)"
              placeholder="Descripción de la unidad..."
              rows={2}
              {...form.getInputProps('description')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close}>Cancelar</Button>
              <Button type="submit">{editingUnit ? 'Guardar' : 'Crear'}</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Modal desactivar con cascada */}
      <Modal
        opened={deactivateModal}
        onClose={closeDeactivate}
        title="Desactivar unidad organizacional"
        size="md"
      >
        <Stack gap="md">
          <Alert color="orange" icon={<IconAlertCircle size={16} />}>
            <Text size="sm">
              Estás a punto de desactivar <strong>{unitToDeactivate?.name}</strong>.
            </Text>
          </Alert>

          {unitToDeactivate?.children && unitToDeactivate.children.length > 0 && (
            <Checkbox
              checked={cascadeDeactivate}
              onChange={(e) => setCascadeDeactivate(e.currentTarget.checked)}
              label="Desactivar también las sub-unidades y usuarios asignados"
              description="Esto desactivará en cascada todas las unidades hijas y sus usuarios"
            />
          )}

          {unitToDeactivate?.usersCount && unitToDeactivate.usersCount > 0 && (
            <Alert color="red" variant="light" icon={<IconAlertCircle size={16} />}>
              <Text size="sm">
                Esta unidad tiene <strong>{unitToDeactivate.usersCount} usuarios</strong> asignados 
                que serán desactivados automáticamente.
              </Text>
            </Alert>
          )}

          <Text size="sm" c="dimmed">
            Las unidades desactivadas no aparecerán como opciones al crear usuarios, 
            pero sus datos históricos se conservarán.
          </Text>

          <Group justify="flex-end">
            <Button variant="light" onClick={closeDeactivate}>Cancelar</Button>
            <Button color="red" onClick={closeDeactivate}>
              Desactivar
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Wireframe annotation */}
      <Alert variant="light" color="yellow" title="RF-S1-01.03, HU-S1-03, HU-S1-13" icon={<IconAlertCircle size={16} />}>
        <Text size="xs">
          • Crear unidades en 3 niveles jerárquicos: División → Gerencia → Departamento<br/>
          • Cada unidad tiene parent_id que debe ser del nivel superior<br/>
          • Validar: no duplicados, no ciclos, padre debe ser nivel N-1<br/>
          • HU-S1-13: Al desactivar padre, desactivar cascada (hijos + usuarios)<br/>
          • Al activar padre, NO activa cascada automática (manual)<br/>
          • Unidades desactivadas no aparecen en selects
        </Text>
      </Alert>
    </Stack>
  )
}
