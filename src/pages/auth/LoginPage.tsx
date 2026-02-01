import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Anchor,
  Alert,
  Checkbox,
  Group
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertCircle, IconMail, IconLock } from '@tabler/icons-react'

export function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validate: {
      email: (value) => (!value ? 'Email requerido' : null),
      password: (value) => (!value ? 'Contraseña requerida' : null)
    }
  })

  const handleSubmit = form.onSubmit(async () => {
    setLoading(true)
    setError(null)
    
    // Simular login
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simular error (para demo)
    // setError('Credenciales inválidas')
    
    // Redirigir a home
    window.location.href = '/'
    setLoading(false)
  })

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Stack gap={4}>
          <Text size="xl" fw={600}>Iniciar sesión</Text>
          <Text size="sm" c="dimmed">
            Ingresa tus credenciales para acceder al sistema
          </Text>
        </Stack>

        {error && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            color="red" 
            variant="light"
          >
            {error}
          </Alert>
        )}

        <TextInput
          label="Correo electrónico"
          placeholder="tu@email.com"
          leftSection={<IconMail size={16} />}
          {...form.getInputProps('email')}
        />

        <PasswordInput
          label="Contraseña"
          placeholder="••••••••"
          leftSection={<IconLock size={16} />}
          {...form.getInputProps('password')}
        />

        <Group justify="space-between">
          <Checkbox
            label="Recordarme"
            size="sm"
            {...form.getInputProps('rememberMe', { type: 'checkbox' })}
          />
          <Anchor component={Link} to="/forgot-password" size="sm">
            ¿Olvidaste tu contraseña?
          </Anchor>
        </Group>

        <Button 
          type="submit" 
          fullWidth 
          loading={loading}
          variant="filled"
          color="dark"
        >
          Iniciar sesión
        </Button>

        {/* Wireframe annotation */}
        <Alert variant="light" color="yellow" title="AC: S1-01.2" icon={<IconAlertCircle size={16} />}>
          <Text size="xs">
            • Credenciales válidas + usuario Active → accede a Home<br/>
            • Credenciales inválidas → error sin revelar existencia del correo<br/>
            • Usuario Suspended u Org Suspended → login bloqueado
          </Text>
        </Alert>
      </Stack>
    </form>
  )
}
