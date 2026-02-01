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
  Textarea,
  Checkbox,
  Alert,
  Box,
  SimpleGrid,
  Divider,
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
  IconShield,
  IconLock,
  IconUsers
} from '@tabler/icons-react'

interface Permission {
  id: string
  code: string
  name: string
  description: string
  category: string
}

interface Role {
  id: string
  name: string
  description?: string
  isProtected: boolean
  usersCount: number
  permissions: string[]
}

const permissionsCatalog: Permission[] = [
  // Admin Usuarios
  { id: 'p1', code: 'ADMIN_USERS_VIEW', name: 'Ver usuarios', description: 'Ver listado de usuarios', category: 'Usuarios' },
  { id: 'p2', code: 'ADMIN_USERS_INVITE', name: 'Invitar usuarios', description: 'Crear y enviar invitaciones', category: 'Usuarios' },
  { id: 'p3', code: 'ADMIN_USERS_EDIT', name: 'Editar usuarios', description: 'Modificar datos de usuarios', category: 'Usuarios' },
  { id: 'p4', code: 'ADMIN_USERS_SUSPEND', name: 'Suspender usuarios', description: 'Suspender/reactivar usuarios', category: 'Usuarios' },
  { id: 'p5', code: 'ADMIN_USERS_BULK', name: 'Carga masiva', description: 'Importar usuarios por archivo', category: 'Usuarios' },
  // Admin Estructura
  { id: 'p6', code: 'ADMIN_SUBSIDIARIES', name: 'Gestionar filiales', description: 'CRUD de filiales', category: 'Estructura' },
  { id: 'p7', code: 'ADMIN_AREAS', name: 'Gestionar áreas', description: 'CRUD de áreas', category: 'Estructura' },
  // Admin Roles
  { id: 'p8', code: 'ADMIN_ROLES_VIEW', name: 'Ver roles', description: 'Ver listado de roles', category: 'Roles' },
  { id: 'p9', code: 'ADMIN_ROLES_MANAGE', name: 'Gestionar roles', description: 'Crear/editar roles y permisos', category: 'Roles' },
  // Operativos (placeholder)
  { id: 'p10', code: 'OPS_VIEW_ALL', name: 'Ver todo (org)', description: 'Ver datos de toda la organización', category: 'Alcance' },
]

const mockRoles: Role[] = [
  { 
    id: '1', 
    name: 'Owner/Admin', 
    description: 'Administrador con todos los permisos', 
    isProtected: true, 
    usersCount: 2,
    permissions: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10']
  },
  { 
    id: '2', 
    name: 'Supervisor', 
    description: 'Supervisor de área con acceso limitado', 
    isProtected: false, 
    usersCount: 8,
    permissions: ['p1', 'p3']
  },
  { 
    id: '3', 
    name: 'Trabajador', 
    description: 'Usuario básico sin permisos de administración', 
    isProtected: false, 
    usersCount: 35,
    permissions: []
  },
  { 
    id: '4', 
    name: 'Auditor', 
    description: 'Solo lectura para auditorías', 
    isProtected: false, 
    usersCount: 3,
    permissions: ['p1', 'p8']
  },
]

export function RolesPage() {
  const [roles, setRoles] = useState(mockRoles)
  const [opened, { open, close }] = useDisclosure(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [search, setSearch] = useState('')

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      permissions: [] as string[]
    },
    validate: {
      name: (value) => (!value ? 'Nombre requerido' : null)
    }
  })

  const handleOpenNew = () => {
    setEditingRole(null)
    form.reset()
    open()
  }

  const handleOpenEdit = (role: Role) => {
    setEditingRole(role)
    form.setValues({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions
    })
    open()
  }

  const handleSubmit = form.onSubmit((values) => {
    if (editingRole) {
      setRoles(r => r.map(role => 
        role.id === editingRole.id ? { ...role, ...values } : role
      ))
    } else {
      setRoles(r => [...r, {
        id: String(Date.now()),
        ...values,
        isProtected: false,
        usersCount: 0
      }])
    }
    close()
    form.reset()
  })

  const togglePermission = (permId: string) => {
    const current = form.values.permissions
    if (current.includes(permId)) {
      form.setFieldValue('permissions', current.filter(p => p !== permId))
    } else {
      form.setFieldValue('permissions', [...current, permId])
    }
  }

  const filteredRoles = roles.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  // Agrupar permisos por categoría
  const permissionsByCategory = permissionsCatalog.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = []
    acc[perm.category].push(perm)
    return acc
  }, {} as Record<string, Permission[]>)

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <Box>
          <Title order={2}>Roles y Permisos</Title>
          <Text c="dimmed">Configura roles personalizados con permisos específicos</Text>
        </Box>
        <Button leftSection={<IconPlus size={16} />} onClick={handleOpenNew}>
          Nuevo rol
        </Button>
      </Group>

      {/* Search */}
      <TextInput
        placeholder="Buscar por nombre..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        w={300}
      />

      {/* Roles grid with Empty State */}
      {filteredRoles.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {filteredRoles.map((role) => (
            <Paper key={role.id} withBorder p="md">
              <Group justify="space-between" mb="sm">
                <Group gap="xs">
                  <ThemeIcon 
                    size="lg" 
                    variant="light" 
                    color={role.isProtected ? 'yellow' : 'dark'}
                  >
                    {role.isProtected ? <IconLock size={18} /> : <IconShield size={18} />}
                  </ThemeIcon>
                  <Box>
                    <Group gap="xs">
                      <Text fw={600}>{role.name}</Text>
                      {role.isProtected && (
                        <Badge size="xs" color="yellow" variant="light">Protegido</Badge>
                      )}
                    </Group>
                  </Box>
                </Group>
                {!role.isProtected && (
                  <Menu shadow="md" width={180}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item 
                        leftSection={<IconEdit size={14} />}
                        onClick={() => handleOpenEdit(role)}
                      >
                        Editar
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item 
                        leftSection={<IconTrash size={14} />}
                        color="red"
                        disabled={role.usersCount > 0}
                      >
                        Eliminar
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                )}
              </Group>
              
              {role.description && (
                <Text size="sm" c="dimmed" mb="sm">{role.description}</Text>
              )}
              
              <Group gap="xs" mb="md">
                <Badge variant="light" color="gray" leftSection={<IconUsers size={12} />}>
                  {role.usersCount} usuarios
                </Badge>
                <Badge variant="light" color="dark">
                  {role.permissions.length} permisos
                </Badge>
              </Group>

              <Button 
                variant="light" 
                size="xs" 
                fullWidth
                onClick={() => handleOpenEdit(role)}
                disabled={role.isProtected}
              >
                {role.isProtected ? 'Ver permisos' : 'Editar permisos'}
              </Button>
            </Paper>
          ))}
        </SimpleGrid>
      ) : (
        <Paper withBorder>
          <Center p="xl" style={{ flexDirection: 'column', gap: 16 }}>
            <ThemeIcon size={64} radius="xl" color="gray" variant="light">
              <IconShield size={32} />
            </ThemeIcon>
            <Stack gap={4} align="center">
              <Text fw={500}>No se encontraron roles</Text>
              <Text size="sm" c="dimmed">
                {search ? 'Prueba cambiando los filtros de búsqueda.' : 'Crea roles personalizados para asignar permisos específicos.'}
              </Text>
            </Stack>
            {!search && (
              <Button leftSection={<IconPlus size={16} />} onClick={handleOpenNew}>
                Nuevo rol
              </Button>
            )}
          </Center>
        </Paper>
      )}

      {/* Modal */}
      <Modal 
        opened={opened} 
        onClose={close} 
        title={editingRole ? `Editar: ${editingRole.name}` : 'Nuevo rol'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Nombre del rol"
              placeholder="Ej: Supervisor de Seguridad"
              withAsterisk
              disabled={editingRole?.isProtected}
              {...form.getInputProps('name')}
            />
            <Textarea
              label="Descripción (opcional)"
              placeholder="Descripción del rol..."
              disabled={editingRole?.isProtected}
              {...form.getInputProps('description')}
            />

            <Divider label="Permisos" labelPosition="center" />

            <Box 
              style={{ 
                maxHeight: 400, 
                overflow: 'auto',
                border: '1px solid #e5e5e5',
                borderRadius: 8,
                padding: 12
              }}
            >
              {Object.entries(permissionsByCategory).map(([category, perms]) => (
                <Box key={category} mb="md">
                  <Text fw={600} size="sm" mb="xs" c="dimmed">{category}</Text>
                  <Stack gap="xs">
                    {perms.map(perm => (
                      <Checkbox
                        key={perm.id}
                        label={
                          <Box>
                            <Text size="sm">{perm.name}</Text>
                            <Text size="xs" c="dimmed">{perm.description}</Text>
                          </Box>
                        }
                        checked={form.values.permissions.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                        disabled={editingRole?.isProtected}
                      />
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close}>Cancelar</Button>
              {!editingRole?.isProtected && (
                <Button type="submit">{editingRole ? 'Guardar' : 'Crear'}</Button>
              )}
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Wireframe annotation */}
      <Alert variant="light" color="yellow" title="AC: S1-04.1, S1-04.2, S1-04.3" icon={<IconAlertCircle size={16} />}>
        <Text size="xs">
          • Lista de permisos versionada (ids estables)<br/>
          • Crear rol con nombre único + seleccionar permisos (checkbox)<br/>
          • Editar rol y permisos<br/>
          • No se puede eliminar el rol protegido Owner/Admin<br/>
          • No se permite dejar la org sin ningún rol con permiso de administración (guardrail)<br/>
          • Auditoría de cambios
        </Text>
      </Alert>
    </Stack>
  )
}
