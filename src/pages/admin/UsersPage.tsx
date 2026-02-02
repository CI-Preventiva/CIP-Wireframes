import { useState } from 'react'
import { Link } from 'react-router-dom'
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
  Avatar,
  Divider,
  Center,
  ThemeIcon,
  Tooltip,
  SegmentedControl,
  Checkbox
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
  IconMail,
  IconMailForward,
  IconMailOff,
  IconUpload,
  IconFilter,
  IconUsers,
  IconInfoCircle,
  IconHierarchy,
  IconList,
  IconPhone,
  IconUser
} from '@tabler/icons-react'
import { InfoTooltip } from '../../components/InfoTooltip'
import { OrganizationTree } from '../../components/OrganizationTree'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  avatarUrl?: string
  role: string
  position?: string
  positionId?: string
  employeeId?: string
  organizationalUnitId: string
  organizationalUnitPath: string // "División > Gerencia > Departamento"
  supervisorId?: string
  supervisorName?: string
  status: 'INVITED' | 'ACTIVE' | 'INACTIVE'
}

const mockUsers: User[] = [
  { 
    id: '1', 
    email: 'juan.diaz@acme.com', 
    firstName: 'Juan', 
    lastName: 'Díaz', 
    phone: '+56912345678',
    employeeId: 'EMP001',
    role: 'Owner/Admin', 
    position: 'Gerente General',
    organizationalUnitId: 'div-1',
    organizationalUnitPath: 'Dirección de Operaciones',
    status: 'ACTIVE' 
  },
  { 
    id: '2', 
    email: 'maria.lopez@acme.com', 
    firstName: 'María', 
    lastName: 'López', 
    phone: '+56987654321',
    employeeId: 'EMP002',
    role: 'Supervisor', 
    position: 'Jefa de RRHH',
    organizationalUnitId: 'ger-3',
    organizationalUnitPath: 'Administración > G. RRHH',
    supervisorId: '1',
    supervisorName: 'Juan Díaz',
    status: 'ACTIVE' 
  },
  { 
    id: '3', 
    email: 'carlos.ruiz@acme.com', 
    firstName: 'Carlos', 
    lastName: 'Ruiz', 
    phone: '+56911111111',
    employeeId: 'EMP003',
    role: 'Trabajador', 
    position: 'Operador Línea A',
    organizationalUnitId: 'dep-1',
    organizationalUnitPath: 'Operaciones > G. Producción > Línea A',
    supervisorId: '2',
    supervisorName: 'María López',
    status: 'ACTIVE' 
  },
  { 
    id: '4', 
    email: 'ana.martinez@acme.com', 
    firstName: '', 
    lastName: '', 
    role: 'Trabajador', 
    organizationalUnitId: 'dep-2',
    organizationalUnitPath: 'Operaciones > G. Producción > Línea B',
    status: 'INVITED' 
  },
  { 
    id: '5', 
    email: 'pedro.sanchez@acme.com', 
    firstName: 'Pedro', 
    lastName: 'Sánchez', 
    phone: '+56922222222',
    employeeId: 'EMP005',
    role: 'Supervisor', 
    position: 'Supervisor SSO',
    organizationalUnitId: 'dep-3',
    organizationalUnitPath: 'Operaciones > G. Mantenimiento > Preventivo',
    supervisorId: '1',
    supervisorName: 'Juan Díaz',
    status: 'INACTIVE' 
  },
]

const roles = [
  { value: 'owner', label: 'Owner/Admin', description: 'Acceso total a la plataforma' },
  { value: 'supervisor', label: 'Supervisor', description: 'Gestión de usuarios y áreas asignadas' },
  { value: 'worker', label: 'Trabajador', description: 'Acceso básico y reportes' },
  { value: 'auditor', label: 'Auditor', description: 'Solo lectura de registros' },
]

// Unidades organizacionales disponibles (vendrían del sistema)
const organizationalUnits = [
  { value: 'div-1', label: 'Dirección de Operaciones', level: 1 },
  { value: 'div-2', label: 'Dirección de Administración', level: 1 },
  { value: 'ger-1', label: 'Operaciones > G. Producción', level: 2 },
  { value: 'ger-2', label: 'Operaciones > G. Mantenimiento', level: 2 },
  { value: 'ger-3', label: 'Administración > G. RRHH', level: 2 },
  { value: 'dep-1', label: 'Operaciones > G. Producción > Línea A', level: 3 },
  { value: 'dep-2', label: 'Operaciones > G. Producción > Línea B', level: 3 },
  { value: 'dep-3', label: 'Operaciones > G. Mantenimiento > Preventivo', level: 3 },
]

const positions = [
  { value: 'p1', label: 'Gerente General' },
  { value: 'p2', label: 'Jefe de Área' },
  { value: 'p3', label: 'Supervisor' },
  { value: 'p4', label: 'Analista' },
  { value: 'p5', label: 'Operador' },
  { value: 'p6', label: 'Técnico' },
]

const statusColors: Record<string, string> = {
  ACTIVE: 'green',
  INVITED: 'blue',
  INACTIVE: 'red'
}

const statusLabels: Record<string, string> = {
  ACTIVE: 'Activo',
  INVITED: 'Invitado',
  INACTIVE: 'Inactivo'
}

export function UsersPage() {
  const [users, setUsers] = useState(mockUsers)
  const [opened, { open, close }] = useDisclosure(false)
  const [deactivateModal, { open: openDeactivate, close: closeDeactivate }] = useDisclosure(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null)
  const [cascadeDeactivate, setCascadeDeactivate] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list')

  const form = useForm({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: '',
      positionId: '',
      organizationalUnitId: '',
      supervisorId: '',
      employeeId: ''
    },
    validate: {
      email: (value) => {
        if (!value) return 'Email requerido'
        if (!/^\S+@\S+$/.test(value)) return 'Email inválido'
        return null
      },
      phone: (value) => {
        if (!value) return 'Teléfono requerido'
        return null
      },
      role: (value) => (!value ? 'Rol requerido' : null),
      organizationalUnitId: (value) => (!value ? 'Unidad organizacional requerida' : null)
    }
  })

  const selectedRole = roles.find(r => r.value === form.values.role)

  // Supervisores disponibles (usuarios activos)
  const availableSupervisors = users
    .filter(u => u.status === 'ACTIVE' && u.id !== editingUser?.id)
    .map(u => ({
      value: u.id,
      label: `${u.firstName} ${u.lastName} (${u.position || u.role})`
    }))

  // Subordinados del usuario a desactivar
  const getSubordinates = (userId: string) => {
    return users.filter(u => u.supervisorId === userId && u.status === 'ACTIVE')
  }

  const handleOpenNew = () => {
    setEditingUser(null)
    form.reset()
    open()
  }

  const handleOpenEdit = (user: User) => {
    setEditingUser(user)
    form.setValues({
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      role: user.role,
      positionId: user.positionId || '',
      organizationalUnitId: user.organizationalUnitId,
      supervisorId: user.supervisorId || '',
      employeeId: user.employeeId || ''
    })
    open()
  }

  const handleSubmit = form.onSubmit(() => {
    close()
    form.reset()
  })

  const handleDeactivateClick = (user: User) => {
    setUserToDeactivate(user)
    setCascadeDeactivate(false)
    openDeactivate()
  }

  const handleConfirmDeactivate = () => {
    if (userToDeactivate) {
      setUsers(users => users.map(u =>
        u.id === userToDeactivate.id ? { ...u, status: 'INACTIVE' as const } : u
      ))
      // Si cascade, desactivar subordinados también
      if (cascadeDeactivate) {
        const subordinates = getSubordinates(userToDeactivate.id)
        setUsers(users => users.map(u =>
          subordinates.find(s => s.id === u.id) ? { ...u, status: 'INACTIVE' as const } : u
        ))
      }
    }
    closeDeactivate()
    setUserToDeactivate(null)
  }

  const reactivateUser = (id: string) => {
    setUsers(users => users.map(u =>
      u.id === id ? { ...u, status: 'ACTIVE' as const } : u
    ))
  }

  const filteredUsers = users.filter(u => {
    const matchSearch = u.email.toLowerCase().includes(search.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || u.status === statusFilter
    return matchSearch && matchStatus
  })

  const getInitials = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`
    }
    return user.email[0].toUpperCase()
  }

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <Box>
          <Title order={2}>Usuarios</Title>
          <Text c="dimmed">Administra los usuarios de tu organización</Text>
        </Box>
        <Group>
          <Button
            variant="light"
            leftSection={<IconUpload size={16} />}
            component={Link}
            to="/admin/users/bulk-import"
          >
            Carga masiva
          </Button>
          <Button leftSection={<IconPlus size={16} />} onClick={handleOpenNew}>
            Invitar usuario
          </Button>
        </Group>
      </Group>

      {/* Filters & View Toggle */}
      <Group justify="space-between">
        <Group>
          <TextInput
            placeholder="Buscar por email o nombre..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            w={300}
          />
          <Select
            placeholder="Filtrar por estado"
            leftSection={<IconFilter size={16} />}
            data={[
              { value: 'ACTIVE', label: 'Activos' },
              { value: 'INVITED', label: 'Invitados' },
              { value: 'INACTIVE', label: 'Inactivos' },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            w={180}
          />
        </Group>

        <SegmentedControl
          value={viewMode}
          onChange={(value) => setViewMode(value as 'list' | 'tree')}
          data={[
            {
              value: 'list',
              label: (
                <Center style={{ gap: 10 }}>
                  <IconList size={16} />
                  <span>Lista</span>
                </Center>
              )
            },
            {
              value: 'tree',
              label: (
                <Center style={{ gap: 10 }}>
                  <IconHierarchy size={16} />
                  <span>Organigrama</span>
                </Center>
              )
            }
          ]}
        />
      </Group>

      {/* Stats */}
      {viewMode === 'list' && (
        <Group>
          <Badge variant="light" color="gray" size="lg">
            Total: {users.length}
          </Badge>
          <Badge variant="light" color="green" size="lg">
            Activos: {users.filter(u => u.status === 'ACTIVE').length}
          </Badge>
          <Badge variant="light" color="blue" size="lg">
            Invitados: {users.filter(u => u.status === 'INVITED').length}
          </Badge>
          <Badge variant="light" color="red" size="lg">
            Inactivos: {users.filter(u => u.status === 'INACTIVE').length}
          </Badge>
        </Group>
      )}

      {/* Content */}
      {viewMode === 'tree' ? (
        <Paper withBorder>
          <OrganizationTree users={users} />
        </Paper>
      ) : (
        <Paper withBorder>
          {filteredUsers.length > 0 ? (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Usuario</Table.Th>
                  <Table.Th>Cargo</Table.Th>
                  <Table.Th>Rol</Table.Th>
                  <Table.Th>Unidad organizacional</Table.Th>
                  <Table.Th>Supervisor</Table.Th>
                  <Table.Th>
                    <Group gap={4}>
                      Estado
                      <Tooltip label="Invitado: pendiente de activación | Activo: acceso completo | Inactivo: acceso bloqueado" multiline w={250} withArrow>
                        <ActionIcon variant="subtle" color="gray" size="xs" style={{ cursor: 'help' }}>
                          <IconInfoCircle size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Th>
                  <Table.Th w={100}>Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredUsers.map((user) => (
                  <Table.Tr key={user.id} style={{ opacity: user.status === 'INACTIVE' ? 0.6 : 1 }}>
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar size="sm" radius="xl" color="dark">
                          {getInitials(user)}
                        </Avatar>
                        <Box>
                          <Text size="sm" fw={500}>
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : '(Sin completar)'}
                          </Text>
                          <Text size="xs" c="dimmed">{user.email}</Text>
                          {user.phone && (
                            <Text size="xs" c="dimmed">{user.phone}</Text>
                          )}
                        </Box>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{user.position || '-'}</Text>
                      {user.employeeId && (
                        <Text size="xs" c="dimmed">ID: {user.employeeId}</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="dark">{user.role}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" lineClamp={2}>{user.organizationalUnitPath}</Text>
                    </Table.Td>
                    <Table.Td>
                      {user.supervisorName ? (
                        <Text size="sm">{user.supervisorName}</Text>
                      ) : (
                        <Text size="xs" c="dimmed">-</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={statusColors[user.status]}>
                        {statusLabels[user.status]}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        {user.status === 'ACTIVE' && (
                          <Tooltip label="Desactivar usuario" withArrow position="left">
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              size="sm"
                              onClick={() => handleDeactivateClick(user)}
                            >
                              <IconPlayerPause size={16} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                        {user.status === 'INACTIVE' && (
                          <Tooltip label="Reactivar usuario" withArrow position="left">
                            <ActionIcon
                              variant="subtle"
                              color="green"
                              size="sm"
                              onClick={() => reactivateUser(user.id)}
                            >
                              <IconPlayerPlay size={16} />
                            </ActionIcon>
                          </Tooltip>
                        )}

                        <Menu shadow="md" width={200}>
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
                              onClick={() => handleOpenEdit(user)}
                            >
                              Editar
                            </Menu.Item>
                            {user.status === 'INVITED' && (
                              <>
                                <Menu.Item leftSection={<IconMailForward size={14} />}>
                                  Reenviar invitación
                                </Menu.Item>
                                <Menu.Item leftSection={<IconMailOff size={14} />} color="orange">
                                  Revocar invitación
                                </Menu.Item>
                              </>
                            )}
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
                <IconUsers size={32} />
              </ThemeIcon>
              <Stack gap={4} align="center">
                <Text fw={500}>No se encontraron usuarios</Text>
                <Text size="sm" c="dimmed">
                  {search || statusFilter ? 'Prueba cambiando los filtros de búsqueda.' : 'Comienza invitando a tu primer usuario o importándolos masivamente.'}
                </Text>
              </Stack>
            </Center>
          )}
        </Paper>
      )}

      {/* Modal crear/editar */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingUser ? 'Editar usuario' : 'Invitar usuario'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Correo electrónico"
              placeholder="usuario@empresa.com"
              withAsterisk
              leftSection={<IconMail size={16} />}
              disabled={!!editingUser}
              {...form.getInputProps('email')}
            />

            <Group grow>
              <TextInput
                label="Nombre"
                placeholder="Juan"
                leftSection={<IconUser size={16} />}
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="Apellido"
                placeholder="Pérez"
                {...form.getInputProps('lastName')}
              />
            </Group>

            <TextInput
              label="Teléfono"
              placeholder="+56912345678"
              withAsterisk
              leftSection={<IconPhone size={16} />}
              {...form.getInputProps('phone')}
            />

            <TextInput
              label="ID de empleado"
              placeholder="EMP001"
              description="Identificador interno del empleado"
              {...form.getInputProps('employeeId')}
            />

            <Divider label="Ubicación organizacional" labelPosition="center" />

            <Select
              label="Unidad organizacional"
              placeholder="Seleccionar unidad"
              data={organizationalUnits.map(u => ({ 
                value: u.value, 
                label: u.label 
              }))}
              withAsterisk
              searchable
              {...form.getInputProps('organizationalUnitId')}
            />

            <Select
              label="Cargo"
              placeholder="Seleccionar cargo"
              data={positions}
              searchable
              {...form.getInputProps('positionId')}
            />

            <Select
              label="Supervisor"
              placeholder="Seleccionar supervisor"
              data={availableSupervisors}
              searchable
              clearable
              description="Usuario que supervisa directamente a este empleado"
              {...form.getInputProps('supervisorId')}
            />

            <Divider label="Accesos" labelPosition="center" />

            <Stack gap="xs">
              <Group gap="xs" align="center">
                <Select
                  label="Rol"
                  placeholder="Seleccionar rol"
                  data={roles.map(r => ({ value: r.value, label: r.label }))}
                  withAsterisk
                  style={{ flex: 1 }}
                  {...form.getInputProps('role')}
                />
                <Box mt={24}>
                  <InfoTooltip
                    label="El rol determina los permisos y funcionalidades a las que el usuario tendrá acceso en la plataforma."
                    multiline
                    maxWidth={280}
                  />
                </Box>
              </Group>
              {selectedRole && (
                <Alert variant="light" color="blue" icon={<IconInfoCircle size={14} />} py="xs">
                  <Text size="xs">{selectedRole.description}</Text>
                </Alert>
              )}
            </Stack>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close}>Cancelar</Button>
              <Button type="submit">
                {editingUser ? 'Guardar' : 'Enviar invitación'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Modal desactivar con cascada */}
      <Modal
        opened={deactivateModal}
        onClose={closeDeactivate}
        title="Desactivar usuario"
        size="md"
      >
        <Stack gap="md">
          <Alert color="orange" icon={<IconAlertCircle size={16} />}>
            <Text size="sm">
              Estás a punto de desactivar a <strong>{userToDeactivate?.firstName} {userToDeactivate?.lastName}</strong>.
            </Text>
          </Alert>

          {userToDeactivate && getSubordinates(userToDeactivate.id).length > 0 && (
            <>
              <Alert color="yellow" variant="light" icon={<IconUsers size={16} />}>
                <Text size="sm">
                  Este usuario supervisa a <strong>{getSubordinates(userToDeactivate.id).length} personas</strong>:
                </Text>
                <Group gap="xs" mt="xs">
                  {getSubordinates(userToDeactivate.id).map(sub => (
                    <Badge key={sub.id} size="sm" variant="light">
                      {sub.firstName} {sub.lastName}
                    </Badge>
                  ))}
                </Group>
              </Alert>

              <Checkbox
                checked={cascadeDeactivate}
                onChange={(e) => setCascadeDeactivate(e.currentTarget.checked)}
                label="Desactivar también a los usuarios que supervisa"
                description="Si no marcas esta opción, los subordinados quedarán sin supervisor asignado"
              />
            </>
          )}

          <Text size="sm" c="dimmed">
            El usuario desactivado no podrá iniciar sesión, pero sus datos históricos se conservarán.
          </Text>

          <Group justify="flex-end">
            <Button variant="light" onClick={closeDeactivate}>Cancelar</Button>
            <Button color="red" onClick={handleConfirmDeactivate}>
              Desactivar
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Wireframe annotation */}
      <Alert variant="light" color="yellow" title="RF-S1-01.09, HU-S1-11, HU-S1-14" icon={<IconAlertCircle size={16} />}>
        <Text size="xs">
          • Campos: email, nombre, apellido, teléfono, ID empleado, unidad org., cargo, supervisor, rol<br/>
          • Usuario Invited: pendiente de activación<br/>
          • Reenviar/revocar invitación<br/>
          • HU-S1-14: Al desactivar supervisor, preguntar si desactivar subordinados<br/>
          • Subordinados sin supervisor quedan con campo vacío<br/>
          • Usuarios inactivos no aparecen en lista de supervisores
        </Text>
      </Alert>
    </Stack>
  )
}
