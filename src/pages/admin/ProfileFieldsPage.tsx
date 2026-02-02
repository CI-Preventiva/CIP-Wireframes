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
  Table,
  Checkbox
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
  IconUserCog,
  IconEye,
  IconEyeOff,
  IconPencil,
  IconPencilOff,
  IconArrowUp,
  IconArrowDown
} from '@tabler/icons-react'
import { InfoTooltip } from '../../components/InfoTooltip'

interface ProfileField {
  id: string
  name: string
  label: string
  fieldType: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean' | 'email' | 'phone' | 'url'
  options?: string[] // Para select/multiselect
  isRequired: boolean
  isVisibleToUser: boolean
  isEditableByUser: boolean
  orderIndex: number
  isActive: boolean
  isSystem: boolean // Campos del sistema no se pueden eliminar
}

const fieldTypes = [
  { value: 'text', label: 'Texto', description: 'Texto libre' },
  { value: 'number', label: 'Número', description: 'Valor numérico' },
  { value: 'date', label: 'Fecha', description: 'Selector de fecha' },
  { value: 'select', label: 'Selección única', description: 'Lista desplegable' },
  { value: 'multiselect', label: 'Selección múltiple', description: 'Varias opciones' },
  { value: 'boolean', label: 'Sí/No', description: 'Casilla de verificación' },
  { value: 'email', label: 'Email', description: 'Dirección de correo' },
  { value: 'phone', label: 'Teléfono', description: 'Número telefónico' },
  { value: 'url', label: 'URL', description: 'Enlace web' },
]

const mockFields: ProfileField[] = [
  // Campos del sistema (no editables)
  { id: 's1', name: 'email', label: 'Correo electrónico', fieldType: 'email', isRequired: true, isVisibleToUser: true, isEditableByUser: false, orderIndex: 1, isActive: true, isSystem: true },
  { id: 's2', name: 'first_name', label: 'Nombre', fieldType: 'text', isRequired: true, isVisibleToUser: true, isEditableByUser: true, orderIndex: 2, isActive: true, isSystem: true },
  { id: 's3', name: 'last_name', label: 'Apellido', fieldType: 'text', isRequired: true, isVisibleToUser: true, isEditableByUser: true, orderIndex: 3, isActive: true, isSystem: true },
  { id: 's4', name: 'phone', label: 'Teléfono', fieldType: 'phone', isRequired: true, isVisibleToUser: true, isEditableByUser: true, orderIndex: 4, isActive: true, isSystem: true },
  // Campos personalizados
  { id: 'c1', name: 'employee_id', label: 'ID de Empleado', fieldType: 'text', isRequired: false, isVisibleToUser: true, isEditableByUser: false, orderIndex: 5, isActive: true, isSystem: false },
  { id: 'c2', name: 'hire_date', label: 'Fecha de ingreso', fieldType: 'date', isRequired: false, isVisibleToUser: true, isEditableByUser: false, orderIndex: 6, isActive: true, isSystem: false },
  { id: 'c3', name: 'emergency_contact', label: 'Contacto de emergencia', fieldType: 'text', isRequired: false, isVisibleToUser: true, isEditableByUser: true, orderIndex: 7, isActive: true, isSystem: false },
  { id: 'c4', name: 'blood_type', label: 'Tipo de sangre', fieldType: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], isRequired: false, isVisibleToUser: true, isEditableByUser: true, orderIndex: 8, isActive: true, isSystem: false },
  { id: 'c5', name: 'medical_cert_expiry', label: 'Vencimiento cert. médico', fieldType: 'date', isRequired: false, isVisibleToUser: false, isEditableByUser: false, orderIndex: 9, isActive: true, isSystem: false },
]

export function ProfileFieldsPage() {
  const [fields, setFields] = useState(mockFields)
  const [opened, { open, close }] = useDisclosure(false)
  const [editingField, setEditingField] = useState<ProfileField | null>(null)
  const [search, setSearch] = useState('')
  const [deleteModal, { open: openDelete, close: closeDelete }] = useDisclosure(false)
  const [fieldToDelete, setFieldToDelete] = useState<ProfileField | null>(null)

  const form = useForm({
    initialValues: {
      name: '',
      label: '',
      fieldType: 'text' as ProfileField['fieldType'],
      options: '',
      isRequired: false,
      isVisibleToUser: true,
      isEditableByUser: false
    },
    validate: {
      name: (value) => {
        if (!value) return 'Nombre requerido'
        if (!/^[a-z_]+$/.test(value)) return 'Solo letras minúsculas y guión bajo'
        return null
      },
      label: (value) => (!value ? 'Etiqueta requerida' : null),
      options: (value, values) => {
        if ((values.fieldType === 'select' || values.fieldType === 'multiselect') && !value) {
          return 'Opciones requeridas para este tipo de campo'
        }
        return null
      }
    }
  })

  const handleOpenNew = () => {
    setEditingField(null)
    form.reset()
    open()
  }

  const handleOpenEdit = (field: ProfileField) => {
    setEditingField(field)
    form.setValues({
      name: field.name,
      label: field.label,
      fieldType: field.fieldType,
      options: field.options?.join(', ') || '',
      isRequired: field.isRequired,
      isVisibleToUser: field.isVisibleToUser,
      isEditableByUser: field.isEditableByUser
    })
    open()
  }

  const handleSubmit = form.onSubmit((values) => {
    const newField: ProfileField = {
      id: editingField?.id || `c${Date.now()}`,
      name: values.name,
      label: values.label,
      fieldType: values.fieldType,
      options: values.options ? values.options.split(',').map(o => o.trim()) : undefined,
      isRequired: values.isRequired,
      isVisibleToUser: values.isVisibleToUser,
      isEditableByUser: values.isEditableByUser,
      orderIndex: editingField?.orderIndex || fields.length + 1,
      isActive: true,
      isSystem: false
    }

    if (editingField) {
      setFields(prev => prev.map(f => f.id === editingField.id ? newField : f))
    } else {
      setFields(prev => [...prev, newField])
    }
    close()
    form.reset()
  })

  const handleDeleteClick = (field: ProfileField) => {
    setFieldToDelete(field)
    openDelete()
  }

  const handleConfirmDelete = () => {
    if (fieldToDelete) {
      setFields(prev => prev.filter(f => f.id !== fieldToDelete.id))
    }
    closeDelete()
    setFieldToDelete(null)
  }

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    setFields(prev => {
      const idx = prev.findIndex(f => f.id === fieldId)
      if (idx === -1) return prev
      if (direction === 'up' && idx === 0) return prev
      if (direction === 'down' && idx === prev.length - 1) return prev

      const newFields = [...prev]
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      const temp = newFields[idx].orderIndex
      newFields[idx].orderIndex = newFields[swapIdx].orderIndex
      newFields[swapIdx].orderIndex = temp
      return newFields.sort((a, b) => a.orderIndex - b.orderIndex)
    })
  }

  const filteredFields = fields
    .filter(f => f.label.toLowerCase().includes(search.toLowerCase()) || f.name.includes(search.toLowerCase()))
    .sort((a, b) => a.orderIndex - b.orderIndex)

  const systemFields = filteredFields.filter(f => f.isSystem)
  const customFields = filteredFields.filter(f => !f.isSystem)

  const showOptionsField = form.values.fieldType === 'select' || form.values.fieldType === 'multiselect'

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <Box>
          <Group gap="xs">
            <Title order={2}>Campos de perfil</Title>
            <InfoTooltip
              label="Define campos adicionales para los perfiles de usuario. Puedes configurar si son visibles y editables por los propios usuarios."
              multiline
              maxWidth={300}
            />
          </Group>
          <Text c="dimmed">Configura los campos del perfil de usuario</Text>
        </Box>
        <Button leftSection={<IconPlus size={16} />} onClick={handleOpenNew}>
          Nuevo campo
        </Button>
      </Group>

      {/* Search */}
      <TextInput
        placeholder="Buscar por nombre o etiqueta..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        w={300}
      />

      {/* System fields */}
      <Paper withBorder p="md">
        <Group mb="md" gap="xs">
          <ThemeIcon size="sm" variant="light" color="gray">
            <IconUserCog size={14} />
          </ThemeIcon>
          <Text fw={500}>Campos del sistema</Text>
          <Badge size="xs" variant="light" color="gray">No editables</Badge>
        </Group>
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Campo</Table.Th>
              <Table.Th>Tipo</Table.Th>
              <Table.Th>
                <Group gap={4}>
                  Requerido
                  <InfoTooltip label="Si el campo es obligatorio al crear/editar usuarios" />
                </Group>
              </Table.Th>
              <Table.Th>
                <Group gap={4}>
                  Visible
                  <InfoTooltip label="Si el usuario puede ver este campo en su perfil" />
                </Group>
              </Table.Th>
              <Table.Th>
                <Group gap={4}>
                  Editable
                  <InfoTooltip label="Si el usuario puede editar este campo él mismo" />
                </Group>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {systemFields.map(field => (
              <Table.Tr key={field.id}>
                <Table.Td>
                  <Box>
                    <Text size="sm" fw={500}>{field.label}</Text>
                    <Text size="xs" c="dimmed">{field.name}</Text>
                  </Box>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" color="gray" size="sm">
                    {fieldTypes.find(t => t.value === field.fieldType)?.label}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {field.isRequired ? (
                    <Badge color="red" variant="light" size="xs">Requerido</Badge>
                  ) : (
                    <Text size="xs" c="dimmed">Opcional</Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <ThemeIcon size="sm" variant="light" color={field.isVisibleToUser ? 'green' : 'gray'}>
                    {field.isVisibleToUser ? <IconEye size={14} /> : <IconEyeOff size={14} />}
                  </ThemeIcon>
                </Table.Td>
                <Table.Td>
                  <ThemeIcon size="sm" variant="light" color={field.isEditableByUser ? 'blue' : 'gray'}>
                    {field.isEditableByUser ? <IconPencil size={14} /> : <IconPencilOff size={14} />}
                  </ThemeIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Custom fields */}
      <Paper withBorder p="md">
        <Group mb="md" justify="space-between">
          <Group gap="xs">
            <ThemeIcon size="sm" variant="light" color="dark">
              <IconUserCog size={14} />
            </ThemeIcon>
            <Text fw={500}>Campos personalizados</Text>
            <Badge size="xs" variant="light">{customFields.length} campos</Badge>
          </Group>
        </Group>

        {customFields.length > 0 ? (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={40}></Table.Th>
                <Table.Th>Campo</Table.Th>
                <Table.Th>Tipo</Table.Th>
                <Table.Th>Requerido</Table.Th>
                <Table.Th>Visible</Table.Th>
                <Table.Th>Editable</Table.Th>
                <Table.Th w={100}>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {customFields.map((field, index) => (
                <Table.Tr key={field.id}>
                  <Table.Td>
                    <Group gap={2}>
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="xs"
                        onClick={() => moveField(field.id, 'up')}
                        disabled={index === 0}
                      >
                        <IconArrowUp size={12} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="xs"
                        onClick={() => moveField(field.id, 'down')}
                        disabled={index === customFields.length - 1}
                      >
                        <IconArrowDown size={12} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Box>
                      <Text size="sm" fw={500}>{field.label}</Text>
                      <Text size="xs" c="dimmed">{field.name}</Text>
                    </Box>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="gray" size="sm">
                      {fieldTypes.find(t => t.value === field.fieldType)?.label}
                    </Badge>
                    {field.options && (
                      <Text size="xs" c="dimmed">{field.options.length} opciones</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    {field.isRequired ? (
                      <Badge color="red" variant="light" size="xs">Requerido</Badge>
                    ) : (
                      <Text size="xs" c="dimmed">Opcional</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Tooltip label={field.isVisibleToUser ? 'Visible al usuario' : 'Oculto al usuario'}>
                      <ThemeIcon size="sm" variant="light" color={field.isVisibleToUser ? 'green' : 'gray'}>
                        {field.isVisibleToUser ? <IconEye size={14} /> : <IconEyeOff size={14} />}
                      </ThemeIcon>
                    </Tooltip>
                  </Table.Td>
                  <Table.Td>
                    <Tooltip label={field.isEditableByUser ? 'Editable por usuario' : 'Solo administradores'}>
                      <ThemeIcon size="sm" variant="light" color={field.isEditableByUser ? 'blue' : 'gray'}>
                        {field.isEditableByUser ? <IconPencil size={14} /> : <IconPencilOff size={14} />}
                      </ThemeIcon>
                    </Tooltip>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <Tooltip label="Editar campo" withArrow position="left">
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          size="sm"
                          onClick={() => handleOpenEdit(field)}
                        >
                          <IconEdit size={14} />
                        </ActionIcon>
                      </Tooltip>
                      <Menu shadow="md" width={180}>
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray" size="sm">
                            <IconDotsVertical size={14} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconEdit size={14} />}
                            onClick={() => handleOpenEdit(field)}
                          >
                            Editar
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            leftSection={<IconTrash size={14} />}
                            color="red"
                            onClick={() => handleDeleteClick(field)}
                          >
                            Eliminar
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
              <IconUserCog size={32} />
            </ThemeIcon>
            <Stack gap={4} align="center">
              <Text fw={500}>No hay campos personalizados</Text>
              <Text size="sm" c="dimmed">
                Agrega campos adicionales para capturar información específica de tus empleados.
              </Text>
            </Stack>
            <Button leftSection={<IconPlus size={16} />} onClick={handleOpenNew}>
              Crear campo
            </Button>
          </Center>
        )}
      </Paper>

      {/* Modal crear/editar */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingField ? 'Editar campo' : 'Nuevo campo personalizado'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Nombre técnico"
              placeholder="Ej: employee_id"
              description="Solo letras minúsculas y guión bajo"
              withAsterisk
              disabled={!!editingField}
              {...form.getInputProps('name')}
            />

            <TextInput
              label="Etiqueta"
              placeholder="Ej: ID de Empleado"
              description="Nombre que verán los usuarios"
              withAsterisk
              {...form.getInputProps('label')}
            />

            <Select
              label="Tipo de campo"
              placeholder="Seleccionar tipo"
              data={fieldTypes.map(t => ({ value: t.value, label: `${t.label} - ${t.description}` }))}
              withAsterisk
              {...form.getInputProps('fieldType')}
            />

            {showOptionsField && (
              <Textarea
                label="Opciones"
                placeholder="Opción 1, Opción 2, Opción 3"
                description="Separa las opciones con comas"
                withAsterisk
                {...form.getInputProps('options')}
              />
            )}

            <Checkbox
              label="Campo requerido"
              description="Los usuarios no podrán guardarse sin completar este campo"
              {...form.getInputProps('isRequired', { type: 'checkbox' })}
            />

            <Checkbox
              label="Visible al usuario"
              description="El usuario puede ver este campo en su perfil"
              {...form.getInputProps('isVisibleToUser', { type: 'checkbox' })}
            />

            <Checkbox
              label="Editable por el usuario"
              description="El usuario puede modificar este campo él mismo"
              disabled={!form.values.isVisibleToUser}
              {...form.getInputProps('isEditableByUser', { type: 'checkbox' })}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close}>Cancelar</Button>
              <Button type="submit">{editingField ? 'Guardar' : 'Crear'}</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Modal eliminar */}
      <Modal
        opened={deleteModal}
        onClose={closeDelete}
        title="Eliminar campo"
        size="sm"
      >
        <Stack gap="md">
          <Alert color="red" icon={<IconAlertCircle size={16} />}>
            <Text size="sm">
              ¿Estás seguro de eliminar el campo <strong>{fieldToDelete?.label}</strong>?
            </Text>
          </Alert>
          <Text size="sm" c="dimmed">
            Esta acción eliminará permanentemente el campo y todos los valores 
            asociados en los perfiles de usuario. Esta acción no se puede deshacer.
          </Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={closeDelete}>Cancelar</Button>
            <Button color="red" onClick={handleConfirmDelete}>Eliminar</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Wireframe annotation */}
      <Alert variant="light" color="yellow" title="RF-S1-01.05 / HU-S1-07" icon={<IconAlertCircle size={16} />}>
        <Text size="xs">
          • Campos del sistema: email, nombre, apellido, teléfono (no eliminables)<br/>
          • Owner puede crear campos personalizados (text, number, date, select, etc.)<br/>
          • Configurar visibilidad: si el usuario ve el campo en su perfil<br/>
          • Configurar editabilidad: si el usuario puede modificar el campo<br/>
          • Nombres de campos únicos, se puede reordenar<br/>
          • Al eliminar campo, se pierden los valores (confirmación fuerte)
        </Text>
      </Alert>
    </Stack>
  )
}
