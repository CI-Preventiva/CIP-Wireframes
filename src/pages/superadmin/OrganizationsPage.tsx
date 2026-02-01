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
  Center
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
  IconBuildingSkyscraper,
  IconUserPlus,
  IconMail
} from '@tabler/icons-react'

interface Organization {
  id: string
  name: string
  slug: string
  industry?: string
  country?: string
  status: 'ACTIVE' | 'SUSPENDED'
  suspendedReason?: 'MAINTENANCE' | 'CONTRACT' | 'SECURITY'
  ownerEmail?: string
  ownerStatus?: 'INVITED' | 'ACTIVE'
  usersCount: number
  createdAt: string
}

const mockOrganizations: Organization[] = [
  { id: '1', name: 'Acme Corp', slug: 'acme-corp', industry: 'Manufactura', country: 'Chile', status: 'ACTIVE', ownerEmail: 'juan.diaz@acme.com', ownerStatus: 'ACTIVE', usersCount: 45, createdAt: '2024-01-15' },
  { id: '2', name: 'Tech Solutions', slug: 'tech-solutions', industry: 'Tecnología', country: 'Perú', status: 'ACTIVE', ownerEmail: 'admin@techsol.pe', ownerStatus: 'ACTIVE', usersCount: 28, createdAt: '2024-01-20' },
  { id: '3', name: 'Mining Corp', slug: 'mining-corp', industry: 'Minería', country: 'Chile', status: 'SUSPENDED', suspendedReason: 'CONTRACT', ownerEmail: 'gerencia@mining.cl', ownerStatus: 'ACTIVE', usersCount: 120, createdAt: '2023-12-01' },
  { id: '4', name: 'Nueva Empresa', slug: 'nueva-empresa', industry: 'Construcción', country: 'Colombia', status: 'ACTIVE', ownerEmail: 'owner@nueva.co', ownerStatus: 'INVITED', usersCount: 0, createdAt: '2024-01-28' },
]

const industries = [
  { value: 'manufactura', label: 'Manufactura' },
  { value: 'mineria', label: 'Minería' },
  { value: 'construccion', label: 'Construcción' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'logistica', label: 'Logística' },
  { value: 'energia', label: 'Energía' },
  { value: 'otro', label: 'Otro' },
]

const countries = [
  { value: 'CL', label: 'Chile' },
  { value: 'PE', label: 'Perú' },
  { value: 'CO', label: 'Colombia' },
  { value: 'MX', label: 'México' },
  { value: 'AR', label: 'Argentina' },
]

const suspendReasons = [
  { value: 'MAINTENANCE', label: 'Mantenimiento' },
  { value: 'CONTRACT', label: 'Contrato' },
  { value: 'SECURITY', label: 'Seguridad' },
]

export function OrganizationsPage() {
  const [organizations, setOrganizations] = useState(mockOrganizations)
  const [opened, { open, close }] = useDisclosure(false)
  const [suspendModal, { open: openSuspend, close: closeSuspend }] = useDisclosure(false)
  const [inviteModal, { open: openInvite, close: closeInvite }] = useDisclosure(false)
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [search, setSearch] = useState('')

  const form = useForm({
    initialValues: {
      name: '',
      slug: '',
      industry: '',
      country: ''
    },
    validate: {
      name: (value) => (!value ? 'Nombre requerido' : null),
      slug: (value) => {
        if (!value) return 'Slug requerido'
        if (!/^[a-z0-9-]+$/.test(value)) return 'Solo minúsculas, números y guiones'
        return null
      }
    }
  })

  const inviteForm = useForm({
    initialValues: {
      email: '',
      firstName: '',
      lastName: ''
    },
    validate: {
      email: (value) => {
        if (!value) return 'Email requerido'
        if (!/^\S+@\S+$/.test(value)) return 'Email inválido'
        return null
      }
    }
  })

  const suspendForm = useForm({
    initialValues: {
      reason: ''
    },
    validate: {
      reason: (value) => (!value ? 'Motivo requerido' : null)
    }
  })

  const handleOpenNew = () => {
    form.reset()
    open()
  }

  const handleSubmit = form.onSubmit((values) => {
    setOrganizations(orgs => [...orgs, {
      id: String(Date.now()),
      ...values,
      status: 'ACTIVE',
      usersCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }])
    close()
    form.reset()
    
    // Abrir modal para invitar owner
    setSelectedOrg({ ...values, id: String(Date.now()), status: 'ACTIVE', usersCount: 0, createdAt: '' } as Organization)
    openInvite()
  })

  const handleSuspend = suspendForm.onSubmit((values) => {
    if (selectedOrg) {
      setOrganizations(orgs => orgs.map(o => 
        o.id === selectedOrg.id 
          ? { ...o, status: 'SUSPENDED', suspendedReason: values.reason as any } 
          : o
      ))
    }
    closeSuspend()
    suspendForm.reset()
  })

  const handleReactivate = (id: string) => {
    setOrganizations(orgs => orgs.map(o => 
      o.id === id ? { ...o, status: 'ACTIVE', suspendedReason: undefined } : o
    ))
  }

  const handleInviteOwner = inviteForm.onSubmit((values) => {
    // Simular envío de invitación
    if (selectedOrg) {
      setOrganizations(orgs => orgs.map(o => 
        o.id === selectedOrg.id 
          ? { ...o, ownerEmail: values.email, ownerStatus: 'INVITED' } 
          : o
      ))
    }
    closeInvite()
    inviteForm.reset()
  })

  const openSuspendModal = (org: Organization) => {
    setSelectedOrg(org)
    openSuspend()
  }

  const openInviteOwnerModal = (org: Organization) => {
    setSelectedOrg(org)
    openInvite()
  }

  const filteredOrgs = organizations.filter(o => 
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <Box>
          <Badge color="yellow" variant="light" mb="xs">SuperAdmin</Badge>
          <Title order={2}>Organizaciones</Title>
          <Text c="dimmed">Provisiona y gestiona las organizaciones cliente</Text>
        </Box>
        <Button leftSection={<IconPlus size={16} />} onClick={handleOpenNew}>
          Nueva organización
        </Button>
      </Group>

      {/* Search */}
      <TextInput
        placeholder="Buscar por nombre o slug..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        w={300}
      />

      {/* Stats */}
      <Group>
        <Badge variant="light" color="gray" size="lg">
          Total: {organizations.length}
        </Badge>
        <Badge variant="light" color="green" size="lg">
          Activas: {organizations.filter(o => o.status === 'ACTIVE').length}
        </Badge>
        <Badge variant="light" color="red" size="lg">
          Suspendidas: {organizations.filter(o => o.status === 'SUSPENDED').length}
        </Badge>
      </Group>

      {/* Table with Empty State */}
      <Paper withBorder>
        {filteredOrgs.length > 0 ? (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Organización</Table.Th>
                <Table.Th>Industria</Table.Th>
                <Table.Th>País</Table.Th>
                <Table.Th>Owner</Table.Th>
                <Table.Th>Usuarios</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Creada</Table.Th>
                <Table.Th w={100}>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredOrgs.map((org) => (
                <Table.Tr key={org.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <ThemeIcon size="sm" variant="light" color="dark">
                        <IconBuildingSkyscraper size={14} />
                      </ThemeIcon>
                      <Box>
                        <Text fw={500} size="sm">{org.name}</Text>
                        <Text size="xs" c="dimmed">{org.slug}</Text>
                      </Box>
                    </Group>
                  </Table.Td>
                  <Table.Td>{org.industry || '-'}</Table.Td>
                  <Table.Td>{org.country || '-'}</Table.Td>
                  <Table.Td>
                    {org.ownerEmail ? (
                      <Box>
                        <Text size="sm">{org.ownerEmail}</Text>
                        <Badge size="xs" color={org.ownerStatus === 'ACTIVE' ? 'green' : 'blue'} variant="light">
                          {org.ownerStatus === 'ACTIVE' ? 'Activo' : 'Invitado'}
                        </Badge>
                      </Box>
                    ) : (
                      <Button 
                        size="xs" 
                        variant="light"
                        leftSection={<IconUserPlus size={12} />}
                        onClick={() => openInviteOwnerModal(org)}
                      >
                        Invitar Owner
                      </Button>
                    )}
                  </Table.Td>
                  <Table.Td>{org.usersCount}</Table.Td>
                  <Table.Td>
                    <Box>
                      <Badge 
                        variant="light" 
                        color={org.status === 'ACTIVE' ? 'green' : 'red'}
                      >
                        {org.status === 'ACTIVE' ? 'Activa' : 'Suspendida'}
                      </Badge>
                      {org.suspendedReason && (
                        <Text size="xs" c="dimmed">
                          Motivo: {suspendReasons.find(r => r.value === org.suspendedReason)?.label}
                        </Text>
                      )}
                    </Box>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{org.createdAt}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      {org.status === 'ACTIVE' ? (
                        <ActionIcon 
                          variant="subtle" 
                          color="red" 
                          size="sm"
                          onClick={() => openSuspendModal(org)}
                          title="Suspender organización"
                        >
                          <IconPlayerPause size={16} />
                        </ActionIcon>
                      ) : (
                        <ActionIcon 
                          variant="subtle" 
                          color="green" 
                          size="sm"
                          onClick={() => handleReactivate(org.id)}
                          title="Reactivar organización"
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
                          <Menu.Item leftSection={<IconEdit size={14} />}>
                            Editar
                          </Menu.Item>
                          {!org.ownerEmail && (
                            <Menu.Item 
                              leftSection={<IconUserPlus size={14} />}
                              onClick={() => openInviteOwnerModal(org)}
                            >
                              Invitar Owner
                            </Menu.Item>
                          )}
                          {org.ownerEmail && org.ownerStatus === 'INVITED' && (
                            <Menu.Item leftSection={<IconMail size={14} />}>
                              Reenviar invitación
                            </Menu.Item>
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
              <IconBuildingSkyscraper size={32} />
            </ThemeIcon>
            <Stack gap={4} align="center">
              <Text fw={500}>No se encontraron organizaciones</Text>
              <Text size="sm" c="dimmed">
                {search ? 'Prueba cambiando los filtros de búsqueda.' : 'Registra la primera organización para comenzar.'}
              </Text>
            </Stack>
            {!search && (
              <Button leftSection={<IconPlus size={16} />} onClick={handleOpenNew}>
                Nueva organización
              </Button>
            )}
          </Center>
        )}
      </Paper>

      {/* Create org modal */}
      <Modal 
        opened={opened} 
        onClose={close} 
        title="Nueva organización"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Nombre"
              placeholder="Ej: Acme Corp"
              withAsterisk
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Slug (identificador único)"
              placeholder="Ej: acme-corp"
              description="Solo minúsculas, números y guiones"
              withAsterisk
              {...form.getInputProps('slug')}
            />
            <Select
              label="Industria"
              placeholder="Seleccionar"
              data={industries}
              {...form.getInputProps('industry')}
            />
            <Select
              label="País"
              placeholder="Seleccionar"
              data={countries}
              {...form.getInputProps('country')}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close}>Cancelar</Button>
              <Button type="submit">Crear y continuar</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Suspend modal */}
      <Modal 
        opened={suspendModal} 
        onClose={closeSuspend} 
        title={`Suspender: ${selectedOrg?.name}`}
        size="sm"
      >
        <form onSubmit={handleSuspend}>
          <Stack gap="md">
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
              Al suspender esta organización, todos los usuarios perderán acceso al sistema.
            </Alert>
            <Select
              label="Motivo de suspensión"
              placeholder="Seleccionar motivo"
              data={suspendReasons}
              withAsterisk
              {...suspendForm.getInputProps('reason')}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={closeSuspend}>Cancelar</Button>
              <Button type="submit" color="red">Suspender</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Invite owner modal */}
      <Modal 
        opened={inviteModal} 
        onClose={closeInvite} 
        title={`Invitar Owner: ${selectedOrg?.name}`}
        size="md"
      >
        <form onSubmit={handleInviteOwner}>
          <Stack gap="md">
            <Alert icon={<IconUserPlus size={16} />} color="blue" variant="light">
              El Owner podrá autogestionar la organización y sus usuarios.
            </Alert>
            <TextInput
              label="Email del Owner"
              placeholder="owner@empresa.com"
              withAsterisk
              {...inviteForm.getInputProps('email')}
            />
            <Group grow>
              <TextInput
                label="Nombre (opcional)"
                placeholder="Juan"
                {...inviteForm.getInputProps('firstName')}
              />
              <TextInput
                label="Apellido (opcional)"
                placeholder="Pérez"
                {...inviteForm.getInputProps('lastName')}
              />
            </Group>
            <Text size="xs" c="dimmed">
              Se enviará un email de invitación con un token válido por 48-72 horas.
            </Text>
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={closeInvite}>Cancelar</Button>
              <Button type="submit" leftSection={<IconMail size={16} />}>
                Enviar invitación
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Wireframe annotation */}
      <Alert variant="light" color="yellow" title="AC: S1-07.1, S1-07.2, S1-02.1" icon={<IconAlertCircle size={16} />}>
        <Text size="xs">
          • Crear org con nombre, org_slug único, estado Active + auditoría<br/>
          • Suspender organización (MAINTENANCE/CONTRACT) bloquea login/acceso + mensaje "Organización no disponible"<br/>
          • Crear Owner en estado Invited + token 48–72h + email invitación<br/>
          • Auditoría: "org creada", "owner invitado", etc.
        </Text>
      </Alert>
    </Stack>
  )
}
