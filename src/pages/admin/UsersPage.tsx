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
  ThemeIcon
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
  IconInfoCircle
} from '@tabler/icons-react'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  jobTitle?: string
  role: string
  subsidiary: string
  primaryArea: string
  scopeMode: string
  status: 'INVITED' | 'ACTIVE' | 'SUSPENDED'
}

const mockUsers: User[] = [
  { id: '1', email: 'juan.diaz@acme.com', firstName: 'Juan', lastName: 'Díaz', jobTitle: 'Gerente General', role: 'Owner/Admin', subsidiary: 'Sede Principal', primaryArea: 'Dirección General', scopeMode: 'ORG_ALL', status: 'ACTIVE' },
  { id: '2', email: 'maria.lopez@acme.com', firstName: 'María', lastName: 'López', jobTitle: 'Jefe RRHH', role: 'Supervisor', subsidiary: 'Sede Principal', primaryArea: 'Recursos Humanos', scopeMode: 'PRIMARY_BRANCH', status: 'ACTIVE' },
  { id: '3', email: 'carlos.ruiz@acme.com', firstName: 'Carlos', lastName: 'Ruiz', jobTitle: 'Operador', role: 'Trabajador', subsidiary: 'Planta Norte', primaryArea: 'Producción', scopeMode: 'PRIMARY_AREA_ONLY', status: 'ACTIVE' },
  { id: '4', email: 'ana.martinez@acme.com', firstName: '', lastName: '', jobTitle: '', role: 'Trabajador', subsidiary: 'Sede Principal', primaryArea: 'Logística', scopeMode: 'PRIMARY_AREA_ONLY', status: 'INVITED' },
  { id: '5', email: 'pedro.sanchez@acme.com', firstName: 'Pedro', lastName: 'Sánchez', jobTitle: 'Supervisor SSO', role: 'Supervisor', subsidiary: 'Planta Norte', primaryArea: 'Control de Calidad', scopeMode: 'SUBSIDIARY_ALL', status: 'SUSPENDED' },
]

const roles = [
  { value: 'owner', label: 'Owner/Admin', description: 'Acceso total a la plataforma' },
  { value: 'supervisor', label: 'Supervisor', description: 'Gestión de usuarios y áreas asignadas' },
  { value: 'worker', label: 'Trabajador', description: 'Acceso básico y reportes' },
  { value: 'auditor', label: 'Auditor', description: 'Solo lectura de registros' },
]

const subsidiaries = [
  { value: '1', label: 'Sede Principal' },
  { value: '2', label: 'Planta Norte' },
]

const areas = [
  { value: 'a1', label: 'Dirección General', group: 'Sede Principal' },
  { value: 'a2', label: 'Recursos Humanos', group: 'Sede Principal' },
  { value: 'a3', label: 'Operaciones', group: 'Sede Principal' },
  { value: 'b1', label: 'Gerencia Planta', group: 'Planta Norte' },
  { value: 'b2', label: 'Producción', group: 'Planta Norte' },
]

const scopeModes = [
  { value: 'PRIMARY_AREA_ONLY', label: 'Solo mi área', description: 'Ve datos solo de su área principal' },
  { value: 'PRIMARY_BRANCH', label: 'Mi rama', description: 'Ve datos de su área y sub-áreas' },
  { value: 'AREAS_SELECTED', label: 'Áreas específicas', description: 'Ve datos de áreas seleccionadas' },
  { value: 'SUBSIDIARY_ALL', label: 'Toda la filial', description: 'Ve datos de toda su filial primaria' },
  { value: 'SUBSIDIARIES_SELECTED', label: 'Filiales seleccionadas', description: 'Ve datos de filiales específicas' },
  { value: 'ORG_ALL', label: 'Toda la organización', description: 'Ve datos de toda la organización' },
]

const statusColors: Record<string, string> = {
  ACTIVE: 'green',
  INVITED: 'blue',
  SUSPENDED: 'red'
}

const statusLabels: Record<string, string> = {
  ACTIVE: 'Activo',
  INVITED: 'Invitado',
  SUSPENDED: 'Suspendido'
}

export function UsersPage() {
  const [users, setUsers] = useState(mockUsers)
  const [opened, { open, close }] = useDisclosure(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const form = useForm({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      jobTitle: '',
      role: '',
      subsidiary: '',
      primaryArea: '',
      scopeMode: 'PRIMARY_AREA_ONLY'
    },
    validate: {
      email: (value) => {
        if (!value) return 'Email requerido'
        if (!/^\S+@\S+$/.test(value)) return 'Email inválido'
        return null
      },
      role: (value) => (!value ? 'Rol requerido' : null),
      subsidiary: (value) => (!value ? 'Filial requerida' : null),
      primaryArea: (value) => (!value ? 'Área requerida' : null)
    }
  })

  // Obtener descripción del rol seleccionado para el tooltip/info
  const selectedRole = roles.find(r => r.value === form.values.role)

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
      jobTitle: user.jobTitle || '',
      role: user.role,
      subsidiary: user.subsidiary,
      primaryArea: user.primaryArea,
      scopeMode: user.scopeMode
    })
    open()
  }

  const handleSubmit = form.onSubmit(() => {
    close()
    form.reset()
  })

  const toggleStatus = (id: string, newStatus: 'ACTIVE' | 'SUSPENDED') => {
    setUsers(users => users.map(u => 
      u.id === id ? { ...u, status: newStatus } : u
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

      {/* Filters */}
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
            { value: 'SUSPENDED', label: 'Suspendidos' },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          clearable
          w={180}
        />
      </Group>

      {/* Stats */}
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
          Suspendidos: {users.filter(u => u.status === 'SUSPENDED').length}
        </Badge>
      </Group>

      {/* Table with Empty State */}
      <Paper withBorder>
        {filteredUsers.length > 0 ? (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Usuario</Table.Th>
                <Table.Th>Cargo</Table.Th>
                <Table.Th>Rol</Table.Th>
                <Table.Th>Filial / Área</Table.Th>
                <Table.Th>Alcance</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th w={100}>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredUsers.map((user) => (
                <Table.Tr key={user.id}>
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
                      </Box>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{user.jobTitle || '-'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="dark">{user.role}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{user.subsidiary}</Text>
                    <Text size="xs" c="dimmed">{user.primaryArea}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs">
                      {scopeModes.find(s => s.value === user.scopeMode)?.label || user.scopeMode}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color={statusColors[user.status]}>
                      {statusLabels[user.status]}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      {user.status === 'ACTIVE' && (
                        <ActionIcon 
                          variant="subtle" 
                          color="red" 
                          size="sm"
                          onClick={() => toggleStatus(user.id, 'SUSPENDED')}
                          title="Suspender usuario"
                        >
                          <IconPlayerPause size={16} />
                        </ActionIcon>
                      )}
                      {user.status === 'SUSPENDED' && (
                        <ActionIcon 
                          variant="subtle" 
                          color="green" 
                          size="sm"
                          onClick={() => toggleStatus(user.id, 'ACTIVE')}
                          title="Reactivar usuario"
                        >
                          <IconPlayerPlay size={16} />
                        </ActionIcon>
                      )}
                      
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDotsVertical size={16} />
                          </ActionIcon>
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
             {!search && !statusFilter && (
               <Group>
                 <Button leftSection={<IconPlus size={16} />} onClick={handleOpenNew}>
                   Invitar usuario
                 </Button>
                 <Button variant="light" leftSection={<IconUpload size={16} />} component={Link} to="/admin/users/bulk-import">
                   Carga masiva
                 </Button>
               </Group>
             )}
          </Center>
        )}
      </Paper>

      {/* Modal */}
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
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="Apellido"
                placeholder="Pérez"
                {...form.getInputProps('lastName')}
              />
            </Group>

            <TextInput
              label="Cargo"
              placeholder="Ej: Jefe de Operaciones"
              {...form.getInputProps('jobTitle')}
            />

            <Divider label="Accesos" labelPosition="center" />

            <Stack gap="xs">
              <Select
                label="Rol"
                placeholder="Seleccionar rol"
                data={roles}
                withAsterisk
                {...form.getInputProps('role')}
              />
              {selectedRole && (
                <Alert variant="light" color="blue" icon={<IconInfoCircle size={14}/>} py="xs">
                  <Text size="xs">{selectedRole.description}</Text>
                </Alert>
              )}
            </Stack>

            <Group grow>
              <Select
                label="Filial primaria"
                placeholder="Seleccionar filial"
                data={subsidiaries}
                withAsterisk
                {...form.getInputProps('subsidiary')}
              />
              <Select
                label="Área principal"
                placeholder="Seleccionar área"
                data={areas}
                withAsterisk
                {...form.getInputProps('primaryArea')}
              />
            </Group>

            <Select
              label="Alcance de visualización"
              description="Define qué datos puede ver este usuario"
              data={scopeModes.map(s => ({ value: s.value, label: `${s.label} - ${s.description}` }))}
              {...form.getInputProps('scopeMode')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close}>Cancelar</Button>
              <Button type="submit">
                {editingUser ? 'Guardar' : 'Enviar invitación'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Wireframe annotation */}
      <Alert variant="light" color="yellow" title="AC: S1-05.1 a S1-05.5" icon={<IconAlertCircle size={16} />}>
        <Text size="xs">
          • Lista muestra: nombre, email, cargo, rol, filial primaria, área principal, alcance, estado<br/>
          • Filtro por estado y búsqueda por email/nombre<br/>
          • Crear usuario Invited con rol + filial + área obligatorios<br/>
          • Reenviar genera token nuevo / Revocar invalida token<br/>
          • Suspender/reactivar usuarios sin perder historial<br/>
          • Alcance: mi área / mi rama / áreas específicas / toda filial / filiales seleccionadas / toda org
        </Text>
      </Alert>
    </Stack>
  )
}
