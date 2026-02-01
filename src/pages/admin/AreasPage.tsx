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
  Center
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import {
  IconPlus,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconAlertCircle,
  IconSearch,
  IconSitemap,
  IconBuilding,
  IconFolder,
  IconFolderOpen
} from '@tabler/icons-react'

interface Area {
  id: string
  name: string
  code?: string
  description?: string
  parentId?: string
  subsidiaryId: string
  status: 'ACTIVE' | 'INACTIVE'
  children?: Area[]
}

const mockAreas: Record<string, Area[]> = {
  '1': [ // Sede Principal
    {
      id: 'a1',
      name: 'Dirección General',
      code: 'DG',
      subsidiaryId: '1',
      status: 'ACTIVE',
      children: [
        { id: 'a1-1', name: 'Recursos Humanos', code: 'RRHH', parentId: 'a1', subsidiaryId: '1', status: 'ACTIVE' },
        { id: 'a1-2', name: 'Finanzas', code: 'FIN', parentId: 'a1', subsidiaryId: '1', status: 'ACTIVE' },
      ]
    },
    {
      id: 'a2',
      name: 'Operaciones',
      code: 'OPS',
      subsidiaryId: '1',
      status: 'ACTIVE',
      children: [
        { id: 'a2-1', name: 'Producción', code: 'PROD', parentId: 'a2', subsidiaryId: '1', status: 'ACTIVE' },
        { id: 'a2-2', name: 'Mantenimiento', code: 'MANT', parentId: 'a2', subsidiaryId: '1', status: 'ACTIVE' },
        { id: 'a2-3', name: 'Logística', code: 'LOG', parentId: 'a2', subsidiaryId: '1', status: 'ACTIVE' },
      ]
    },
    {
      id: 'a3',
      name: 'Seguridad y Prevención',
      code: 'SSO',
      subsidiaryId: '1',
      status: 'ACTIVE'
    }
  ],
  '2': [ // Planta Norte
    {
      id: 'b1',
      name: 'Gerencia Planta',
      code: 'GP',
      subsidiaryId: '2',
      status: 'ACTIVE',
      children: [
        { id: 'b1-1', name: 'Línea de Ensamble', code: 'ENS', parentId: 'b1', subsidiaryId: '2', status: 'ACTIVE' },
        { id: 'b1-2', name: 'Control de Calidad', code: 'QA', parentId: 'b1', subsidiaryId: '2', status: 'ACTIVE' },
      ]
    }
  ]
}

const subsidiaries = [
  { value: '1', label: 'Sede Principal' },
  { value: '2', label: 'Planta Norte' },
  { value: '3', label: 'Sucursal Perú' }
]

const areaTypes = [
  { value: 'DEPARTMENT', label: 'Departamento' },
  { value: 'SITE', label: 'Sitio/Planta' },
  { value: 'TEAM', label: 'Equipo' },
  { value: 'OTHER', label: 'Otro' }
]

export function AreasPage() {
  const [selectedSubsidiary, setSelectedSubsidiary] = useState<string>('1')
  const [opened, { open, close }] = useDisclosure(false)
  const [editingArea, setEditingArea] = useState<Area | null>(null)
  const [search, setSearch] = useState('')

  const currentAreas = mockAreas[selectedSubsidiary] || []

  // Obtener lista plana de áreas para el select de padre
  const flattenAreas = (areas: Area[], prefix = ''): { value: string; label: string }[] => {
    let result: { value: string; label: string }[] = []
    areas.forEach(area => {
      result.push({ value: area.id, label: prefix + area.name })
      if (area.children) {
        result = [...result, ...flattenAreas(area.children, prefix + '— ')]
      }
    })
    return result
  }

  const parentOptions = flattenAreas(currentAreas)

  const form = useForm({
    initialValues: {
      name: '',
      code: '',
      description: '',
      parentId: '',
      areaType: ''
    },
    validate: {
      name: (value) => (!value ? 'Nombre requerido' : null)
    }
  })

  const handleOpenNew = (parentId?: string) => {
    setEditingArea(null)
    form.reset()
    if (parentId) {
      form.setFieldValue('parentId', parentId)
    }
    open()
  }

  const handleOpenEdit = (area: Area) => {
    setEditingArea(area)
    form.setValues({
      name: area.name,
      code: area.code || '',
      description: area.description || '',
      parentId: area.parentId || '',
      areaType: ''
    })
    open()
  }

  const handleSubmit = form.onSubmit(() => {
    // Simular guardado
    close()
    form.reset()
  })

  // Renderizar árbol de áreas
  const renderAreaTree = (areas: Area[], level = 0) => {
    return areas.map(area => (
      <Box key={area.id}>
        <Paper 
          withBorder 
          p="sm" 
          mb="xs"
          radius="md"
          bg={level === 0 ? 'white' : 'gray.0'}
        >
          <Group justify="space-between">
            <Group gap="sm">
              <ThemeIcon 
                size="sm" 
                variant="light" 
                color={area.children?.length ? 'dark' : 'gray'}
              >
                {area.children?.length ? <IconFolderOpen size={14} /> : <IconFolder size={14} />}
              </ThemeIcon>
              <Box>
                <Group gap="xs">
                  <Text fw={500} size="sm">{area.name}</Text>
                  {area.code && (
                    <Badge size="xs" variant="light" color="gray">{area.code}</Badge>
                  )}
                </Group>
                {area.description && (
                  <Text size="xs" c="dimmed">{area.description}</Text>
                )}
              </Box>
            </Group>
            <Group gap="xs">
              <Badge 
                size="xs" 
                variant="light" 
                color={area.status === 'ACTIVE' ? 'green' : 'red'}
              >
                {area.status === 'ACTIVE' ? 'Activa' : 'Inactiva'}
              </Badge>
              <Menu shadow="md" width={180}>
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray" size="sm">
                    <IconDotsVertical size={14} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item 
                    leftSection={<IconPlus size={14} />}
                    onClick={() => handleOpenNew(area.id)}
                  >
                    Agregar sub-área
                  </Menu.Item>
                  <Menu.Item 
                    leftSection={<IconEdit size={14} />}
                    onClick={() => handleOpenEdit(area)}
                  >
                    Editar
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item 
                    leftSection={<IconTrash size={14} />}
                    color="red"
                  >
                    Desactivar
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Paper>
        {area.children && (
          <Box ml={20} pl={20} style={{ borderLeft: '2px solid #f1f3f5' }}>
            {renderAreaTree(area.children, level + 1)}
          </Box>
        )}
      </Box>
    ))
  }

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <Box>
          <Title order={2}>Áreas</Title>
          <Text c="dimmed">Gestiona la estructura organizacional jerárquica</Text>
        </Box>
        <Button leftSection={<IconPlus size={16} />} onClick={() => handleOpenNew()}>
          Nueva área
        </Button>
      </Group>

      {/* Filters */}
      <Group>
        <Select
          label="Filial"
          placeholder="Seleccionar filial"
          data={subsidiaries}
          value={selectedSubsidiary}
          onChange={(v) => setSelectedSubsidiary(v || '1')}
          leftSection={<IconBuilding size={16} />}
          w={250}
        />
        <TextInput
          label="Buscar"
          placeholder="Buscar por nombre..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          w={250}
        />
      </Group>

      {/* Tree view */}
      <Paper withBorder p="md">
        <Group mb="md" gap="xs">
          <IconSitemap size={18} />
          <Text fw={500}>Organigrama: {subsidiaries.find(s => s.value === selectedSubsidiary)?.label}</Text>
        </Group>
        
        {currentAreas.length > 0 ? (
          renderAreaTree(currentAreas)
        ) : (
          <Center p="xl" style={{ flexDirection: 'column', gap: 16 }}>
            <ThemeIcon size={64} radius="xl" color="gray" variant="light">
              <IconSitemap size={32} />
            </ThemeIcon>
            <Stack gap={4} align="center">
              <Text fw={500}>No hay áreas en esta filial</Text>
              <Text size="sm" c="dimmed">
                Comienza creando el área raíz (ej. Dirección General) para esta filial.
              </Text>
            </Stack>
            <Button 
              mt="md" 
              leftSection={<IconPlus size={16} />}
              onClick={() => handleOpenNew()}
            >
              Crear primera área
            </Button>
          </Center>
        )}
      </Paper>

      {/* Modal */}
      <Modal 
        opened={opened} 
        onClose={close} 
        title={editingArea ? 'Editar área' : 'Nueva área'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Nombre del área"
              placeholder="Ej: Recursos Humanos"
              withAsterisk
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Código (opcional)"
              placeholder="Ej: RRHH"
              description="Identificador corto del área"
              {...form.getInputProps('code')}
            />
            <Textarea
              label="Descripción (opcional)"
              placeholder="Descripción del área..."
              {...form.getInputProps('description')}
            />
            <Select
              label="Tipo de área"
              placeholder="Seleccionar tipo"
              data={areaTypes}
              {...form.getInputProps('areaType')}
            />
            <Select
              label="Área padre (opcional)"
              placeholder="Sin área padre (raíz)"
              data={parentOptions}
              clearable
              description="Debe pertenecer a la misma filial"
              {...form.getInputProps('parentId')}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close}>Cancelar</Button>
              <Button type="submit">{editingArea ? 'Guardar' : 'Crear'}</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Wireframe annotation */}
      <Alert variant="light" color="yellow" title="AC: S1-03.1" icon={<IconAlertCircle size={16} />}>
        <Text size="xs">
          • Crear área con nombre obligatorio y opcional: código/descr<br/>
          • Definir parent_area_id para jerarquía<br/>
          • Validaciones: evitar ciclos, evitar duplicados por mismo padre<br/>
          • Desactivar área sin borrar historial<br/>
          • parent_area_id debe ser de la misma filial<br/>
          • Listado/árbol se filtra por filial
        </Text>
      </Alert>
    </Stack>
  )
}
