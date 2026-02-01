import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PasswordInput,
  Button,
  Stack,
  Text,
  Alert,
  Progress,
  Box,
  List
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconLock, IconAlertCircle, IconCheck } from '@tabler/icons-react'

function getPasswordStrength(password: string) {
  let strength = 0
  if (password.length >= 8) strength += 25
  if (/[a-z]/.test(password)) strength += 25
  if (/[A-Z]/.test(password)) strength += 25
  if (/[0-9]/.test(password) || /[^a-zA-Z0-9]/.test(password)) strength += 25
  return strength
}

export function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const form = useForm({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validate: {
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
    setSuccess(true)
    setLoading(false)
  })

  if (success) {
    return (
      <Stack gap="md">
        <Box
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}
        >
          <IconCheck size={28} color="#16a34a" />
        </Box>

        <Stack gap={4} ta="center">
          <Text size="xl" fw={600}>Contraseña actualizada</Text>
          <Text size="sm" c="dimmed">
            Tu contraseña ha sido restablecida exitosamente.
          </Text>
        </Stack>

        <Button 
          component={Link} 
          to="/login" 
          variant="filled"
          color="dark"
        >
          Iniciar sesión
        </Button>
      </Stack>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Stack gap={4}>
          <Text size="xl" fw={600}>Nueva contraseña</Text>
          <Text size="sm" c="dimmed">
            Ingresa tu nueva contraseña.
          </Text>
        </Stack>

        <PasswordInput
          label="Nueva contraseña"
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
          Restablecer contraseña
        </Button>

        {/* Wireframe annotation */}
        <Alert variant="light" color="yellow" title="AC: S1-01.3" icon={<IconAlertCircle size={16} />}>
          <Text size="xs">
            • Token válido permite cambiar contraseña<br/>
            • Token inválido/expirado → se solicita uno nuevo
          </Text>
        </Alert>
      </Stack>
    </form>
  )
}
