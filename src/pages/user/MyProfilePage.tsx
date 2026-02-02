import { useState } from 'react'
import {
  Stack,
  Title,
  Text,
  Paper,
  Group,
  Button,
  Badge,
  TextInput,
  Select,
  Alert,
  Avatar,
  Divider,
  Grid,
  SimpleGrid,
  Card,
  ThemeIcon,
  Tooltip,
  Modal,
  PasswordInput,
  Notification
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconUser,
  IconMail,
  IconPhone,
  IconBuilding,
  IconBriefcase,
  IconUserCheck,
  IconCalendar,
  IconId,
  IconEdit,
  IconLock,
  IconAlertCircle,
  IconCheck,
  IconInfoCircle,
  IconDroplet,
  IconShieldCheck,
  IconHierarchy
} from '@tabler/icons-react'

// Simular datos del usuario actual
const currentUser = {
  id: '1',
  email: 'juan.diaz@acme.com',
  firstName: 'Juan',
  lastName: 'Díaz Rodríguez',
  phone: '+52 55 1234 5678',
  avatarUrl: null,
  employeeId: 'EMP-001',
  position: {
    id: '1',
    name: 'Supervisor de Planta',
    family: 'Supervisión'
  },
  organizationalUnit: {
    id: '1',
    name: 'Planta Norte',
    level: 'Subárea',
    parent: 'Producción',
    grandparent: 'División Industrial'
  },
  supervisor: {
    id: '2',
    name: 'María García López',
    position: 'Gerente de Operaciones'
  },
  role: {
    name: 'Supervisor',
    permissions: ['view_team', 'edit_team_profiles', 'view_reports']
  },
  hireDate: '2022-03-15',
  // Campos personalizados
  customFields: {
    emergency_contact: 'Ana Díaz - +52 55 9876 5432',
    blood_type: 'O+',
    medical_cert_expiry: '2025-06-30'
  }
}

// Campos del perfil con configuración de visibilidad/editabilidad
const profileFieldsConfig = [
  // Campos del sistema
  { name: 'email', label: 'Correo electrónico', type: 'email', isSystem: true, isVisible: true, isEditable: false },
  { name: 'firstName', label: 'Nombre', type: 'text', isSystem: true, isVisible: true, isEditable: true },
  { name: 'lastName', label: 'Apellido', type: 'text', isSystem: true, isVisible: true, isEditable: true },
  { name: 'phone', label: 'Teléfono', type: 'phone', isSystem: true, isVisible: true, isEditable: true },
  // Campos personalizados
  { name: 'emergency_contact', label: 'Contacto de emergencia', type: 'text', isSystem: false, isVisible: true, isEditable: true },
  { name: 'blood_type', label: 'Tipo de sangre', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], isSystem: false, isVisible: true, isEditable: true },
  { name: 'medical_cert_expiry', label: 'Vencimiento cert. médico', type: 'date', isSystem: false, isVisible: false, isEditable: false }, // Este no es visible para el usuario
]

export function MyProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [changePasswordOpened, { open: openChangePassword, close: closeChangePassword }] = useDisclosure(false)
  const [showSavedNotification, setShowSavedNotification] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    phone: currentUser.phone,
    emergency_contact: currentUser.customFields.emergency_contact,
    blood_type: currentUser.customFields.blood_type
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSave = () => {
    // Aquí iría la lógica de guardado
    console.log('Guardando:', formData)
    setIsEditing(false)
    setShowSavedNotification(true)
    setTimeout(() => setShowSavedNotification(false), 3000)
  }

  const handleCancel = () => {
    // Restaurar valores originales
    setFormData({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      phone: currentUser.phone,
      emergency_contact: currentUser.customFields.emergency_contact,
      blood_type: currentUser.customFields.blood_type
    })
    setIsEditing(false)
  }

  const handleChangePassword = () => {
    // Aquí iría la lógica de cambio de contraseña
    console.log('Cambiando contraseña')
    closeChangePassword()
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  // Filtrar campos visibles para el usuario
  const visibleFields = profileFieldsConfig.filter(f => f.isVisible)
  const editableFields = visibleFields.filter(f => f.isEditable)

  return (
    <Stack gap="lg">
      {/* Notification */}
      {showSavedNotification && (
        <Notification 
          icon={<IconCheck size={18} />} 
          color="green" 
          title="Cambios guardados"
          withCloseButton
          onClose={() => setShowSavedNotification(false)}
          style={{ position: 'fixed', top: 80, right: 20, zIndex: 1000 }}
        >
          Tu perfil ha sido actualizado correctamente
        </Notification>
      )}

      {/* Header */}
      <Paper shadow="xs" p="lg" radius="md">
        <Group justify="space-between" align="flex-start">
          <Group>
            <Avatar 
              size={80} 
              radius="xl" 
              color="dark"
              src={currentUser.avatarUrl}
            >
              {currentUser.firstName[0]}{currentUser.lastName[0]}
            </Avatar>
            <Stack gap={4}>
              <Title order={2}>{currentUser.firstName} {currentUser.lastName}</Title>
              <Group gap="xs">
                <Badge variant="light" color="blue">{currentUser.position.name}</Badge>
                <Badge variant="light" color="gray">{currentUser.organizationalUnit.name}</Badge>
              </Group>
              <Text size="sm" c="dimmed">{currentUser.email}</Text>
            </Stack>
          </Group>
          <Group>
            {!isEditing ? (
              <Button 
                leftSection={<IconEdit size={16} />} 
                variant="light"
                onClick={() => setIsEditing(true)}
                disabled={editableFields.length === 0}
              >
                Editar perfil
              </Button>
            ) : (
              <>
                <Button variant="subtle" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  Guardar cambios
                </Button>
              </>
            )}
          </Group>
        </Group>
      </Paper>

      <Grid gutter="lg">
        {/* Columna principal - Información del perfil */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            {/* Información personal */}
            <Paper shadow="xs" p="lg" radius="md">
              <Group mb="md" gap="xs">
                <ThemeIcon size="sm" variant="light" color="blue">
                  <IconUser size={14} />
                </ThemeIcon>
                <Text fw={500}>Información personal</Text>
                {isEditing && (
                  <Badge size="xs" color="blue" variant="light">Editando</Badge>
                )}
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {/* Email - No editable */}
                <TextInput
                  label="Correo electrónico"
                  value={currentUser.email}
                  disabled
                  leftSection={<IconMail size={16} />}
                  description="Este campo no puede ser modificado"
                />

                {/* Nombre - Editable */}
                <TextInput
                  label="Nombre"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                  leftSection={<IconUser size={16} />}
                />

                {/* Apellido - Editable */}
                <TextInput
                  label="Apellido"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                  leftSection={<IconUser size={16} />}
                />

                {/* Teléfono - Editable */}
                <TextInput
                  label="Teléfono"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  leftSection={<IconPhone size={16} />}
                />
              </SimpleGrid>
            </Paper>

            {/* Campos personalizados editables */}
            <Paper shadow="xs" p="lg" radius="md">
              <Group mb="md" gap="xs">
                <ThemeIcon size="sm" variant="light" color="violet">
                  <IconInfoCircle size={14} />
                </ThemeIcon>
                <Text fw={500}>Información adicional</Text>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {/* Contacto de emergencia - Editable */}
                <TextInput
                  label="Contacto de emergencia"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Nombre y teléfono"
                />

                {/* Tipo de sangre - Editable */}
                <Select
                  label="Tipo de sangre"
                  value={formData.blood_type}
                  onChange={(value) => setFormData({ ...formData, blood_type: value || '' })}
                  disabled={!isEditing}
                  data={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
                  leftSection={<IconDroplet size={16} />}
                />
              </SimpleGrid>
            </Paper>

            {/* Información organizacional - Solo lectura */}
            <Paper shadow="xs" p="lg" radius="md">
              <Group mb="md" gap="xs">
                <ThemeIcon size="sm" variant="light" color="orange">
                  <IconBuilding size={14} />
                </ThemeIcon>
                <Text fw={500}>Información organizacional</Text>
                <Tooltip label="Esta información solo puede ser modificada por un administrador">
                  <Badge size="xs" color="gray" variant="light">Solo lectura</Badge>
                </Tooltip>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label="ID de Empleado"
                  value={currentUser.employeeId}
                  disabled
                  leftSection={<IconId size={16} />}
                />

                <TextInput
                  label="Cargo"
                  value={currentUser.position.name}
                  disabled
                  leftSection={<IconBriefcase size={16} />}
                />

                <TextInput
                  label="Unidad organizacional"
                  value={`${currentUser.organizationalUnit.grandparent} > ${currentUser.organizationalUnit.parent} > ${currentUser.organizationalUnit.name}`}
                  disabled
                  leftSection={<IconHierarchy size={16} />}
                />

                <TextInput
                  label="Supervisor"
                  value={currentUser.supervisor.name}
                  disabled
                  leftSection={<IconUserCheck size={16} />}
                />

                <TextInput
                  label="Fecha de ingreso"
                  value={new Date(currentUser.hireDate).toLocaleDateString('es-MX', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  disabled
                  leftSection={<IconCalendar size={16} />}
                />

                <TextInput
                  label="Rol"
                  value={currentUser.role.name}
                  disabled
                  leftSection={<IconShieldCheck size={16} />}
                />
              </SimpleGrid>
            </Paper>
          </Stack>
        </Grid.Col>

        {/* Columna lateral - Acciones y resumen */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="lg">
            {/* Seguridad */}
            <Paper shadow="xs" p="lg" radius="md">
              <Group mb="md" gap="xs">
                <ThemeIcon size="sm" variant="light" color="red">
                  <IconLock size={14} />
                </ThemeIcon>
                <Text fw={500}>Seguridad</Text>
              </Group>

              <Stack gap="sm">
                <Button 
                  variant="light" 
                  leftSection={<IconLock size={16} />}
                  fullWidth
                  onClick={openChangePassword}
                >
                  Cambiar contraseña
                </Button>
              </Stack>
            </Paper>

            {/* Mi equipo (si es supervisor) */}
            <Paper shadow="xs" p="lg" radius="md">
              <Group mb="md" gap="xs">
                <ThemeIcon size="sm" variant="light" color="green">
                  <IconUserCheck size={14} />
                </ThemeIcon>
                <Text fw={500}>Mi supervisor</Text>
              </Group>

              <Card withBorder p="sm">
                <Group>
                  <Avatar size="md" radius="xl" color="blue">
                    {currentUser.supervisor.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </Avatar>
                  <Stack gap={2}>
                    <Text size="sm" fw={500}>{currentUser.supervisor.name}</Text>
                    <Text size="xs" c="dimmed">{currentUser.supervisor.position}</Text>
                  </Stack>
                </Group>
              </Card>
            </Paper>

            {/* Información sobre edición */}
            <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
              <Text size="xs">
                Algunos campos de tu perfil solo pueden ser modificados por un administrador. 
                Si necesitas actualizar información como tu cargo, unidad organizacional o supervisor, 
                contacta al departamento de RRHH.
              </Text>
            </Alert>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Modal: Cambiar contraseña */}
      <Modal 
        opened={changePasswordOpened} 
        onClose={closeChangePassword}
        title="Cambiar contraseña"
        size="md"
      >
        <Stack gap="md">
          <PasswordInput
            label="Contraseña actual"
            placeholder="Ingresa tu contraseña actual"
            required
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
          />

          <Divider label="Nueva contraseña" labelPosition="center" />

          <PasswordInput
            label="Nueva contraseña"
            placeholder="Ingresa tu nueva contraseña"
            required
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            description="Mínimo 8 caracteres, incluir mayúsculas, minúsculas y números"
          />

          <PasswordInput
            label="Confirmar nueva contraseña"
            placeholder="Repite tu nueva contraseña"
            required
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            error={
              passwordForm.confirmPassword && 
              passwordForm.newPassword !== passwordForm.confirmPassword 
                ? 'Las contraseñas no coinciden' 
                : null
            }
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={closeChangePassword}>
              Cancelar
            </Button>
            <Button 
              onClick={handleChangePassword}
              disabled={
                !passwordForm.currentPassword || 
                !passwordForm.newPassword || 
                passwordForm.newPassword !== passwordForm.confirmPassword
              }
            >
              Cambiar contraseña
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Wireframe annotation */}
      <Alert variant="light" color="yellow" title="HU-S1-13 / RF-S1-01.05" icon={<IconAlertCircle size={16} />}>
        <Text size="xs">
          • Usuario puede ver su perfil con campos marcados como visibles (is_visible_to_user)<br/>
          • Usuario puede editar campos marcados como editables (is_editable_by_user)<br/>
          • Campos organizacionales (cargo, unidad, supervisor) son solo lectura<br/>
          • Usuario puede cambiar su propia contraseña<br/>
          • Los campos no visibles no aparecen en esta vista (ej: medical_cert_expiry)
        </Text>
      </Alert>
    </Stack>
  )
}
