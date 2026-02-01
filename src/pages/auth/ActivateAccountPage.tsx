import { useState } from 'react'
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Alert,
  Progress,
  Box,
  List,
  Divider
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconLock, IconAlertCircle, IconCheck, IconUser, IconBriefcase } from '@tabler/icons-react'

function getPasswordStrength(password: string) {
  let strength = 0
  if (password.length >= 8) strength += 25
  if (/[a-z]/.test(password)) strength += 25
  if (/[A-Z]/.test(password)) strength += 25
  if (/[0-9]/.test(password) || /[^a-zA-Z0-9]/.test(password)) strength += 25
  return strength
}

export function ActivateAccountPage() {
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      jobTitle: '',
      password: '',
      confirmPassword: ''
    },
    validate: {
      firstName: (value) => (!value ? 'Nombre requerido' : null),
      lastName: (value) => (!value ? 'Apellido requerido' : null),
      password: (value) => {
        if (!value) return 'Contraseña requerida'
        if (value.length < 8) return 'Mínimo 8 caracteres'
        return null
      },
      confirmPassword: (value, values) => {
        if (!value) return 'Confirma tu contraseña'
        if (value !== values.password) return 'Las contraseñas no coinciden'
        return null
      }
    }
  })

  const strength = getPasswordStrength(form.values.password)
  const strengthColor = strength < 50 ? 'red' : strength < 75 ? 'yellow' : 'green'

  const handleSubmit = form.onSubmit(async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    window.location.href = '/'
  })

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Stack gap={4}>
          <Text size="xl" fw={600}>Activa tu cuenta</Text>
          <Text size="sm" c="dimmed">
            Completa tus datos y crea tu contraseña para comenzar.
          </Text>
        </Stack>

        {/* Info de invitación */}
        <Alert variant="light" color="blue">
          <Text size="sm">
            Has sido invitado a <strong>Acme Corp</strong> como <strong>Owner/Admin</strong>
          </Text>
        </Alert>

        <Divider label="Datos personales" labelPosition="center" />

        <TextInput
          label="Nombre"
          placeholder="Juan"
          leftSection={<IconUser size={16} />}
          {...form.getInputProps('firstName')}
        />

        <TextInput
          label="Apellido"
          placeholder="Pérez"
          leftSection={<IconUser size={16} />}
          {...form.getInputProps('lastName')}
        />

        <TextInput
          label="Cargo (opcional)"
          placeholder="Jefe de Prevención"
          leftSection={<IconBriefcase size={16} />}
          {...form.getInputProps('jobTitle')}
        />

        <Divider label="Crear contraseña" labelPosition="center" />

        <PasswordInput
          label="Contraseña"
          placeholder="••••••••"
          leftSection={<IconLock size={16} />}
          {...form.getInputProps('password')}
        />

        {form.values.password && (
          <Box>
            <Progress value={strength} color={strengthColor} size="xs" mb="xs" />
            <List size="xs" c="dimmed" spacing={2}>
              <List.Item 
                icon={form.values.password.length >= 8 ? <IconCheck size={12} color="green" /> : null}
              >
                Mínimo 8 caracteres
              </List.Item>
              <List.Item
                icon={/[a-z]/.test(form.values.password) ? <IconCheck size={12} color="green" /> : null}
              >
                Al menos una minúscula
              </List.Item>
              <List.Item
                icon={/[A-Z]/.test(form.values.password) ? <IconCheck size={12} color="green" /> : null}
              >
                Al menos una mayúscula
              </List.Item>
              <List.Item
                icon={/[0-9]/.test(form.values.password) ? <IconCheck size={12} color="green" /> : null}
              >
                Al menos un número
              </List.Item>
            </List>
          </Box>
        )}

        <PasswordInput
          label="Confirmar contraseña"
          placeholder="••••••••"
          leftSection={<IconLock size={16} />}
          {...form.getInputProps('confirmPassword')}
        />

        <Button 
          type="submit" 
          fullWidth 
          loading={loading}
          variant="filled"
          color="dark"
        >
          Activar cuenta
        </Button>

        {/* Wireframe annotation */}
        <Alert variant="light" color="yellow" title="AC: S1-02.2 / S1-05.9" icon={<IconAlertCircle size={16} />}>
          <Text size="xs">
            • Token válido + org Active → pantalla activar cuenta<br/>
            • Activación crea contraseña y deja usuario Active<br/>
            • Token expirado/revocado → mensaje y no activa
          </Text>
        </Alert>
      </Stack>
    </form>
  )
}
