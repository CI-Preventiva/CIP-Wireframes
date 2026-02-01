import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TextInput,
  Button,
  Stack,
  Text,
  Anchor,
  Alert,
  Box
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconMail, IconAlertCircle, IconArrowLeft, IconCheck } from '@tabler/icons-react'

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const form = useForm({
    initialValues: {
      email: ''
    },
    validate: {
      email: (value) => {
        if (!value) return 'Email requerido'
        if (!/^\S+@\S+$/.test(value)) return 'Email inválido'
        return null
      }
    }
  })

  const handleSubmit = form.onSubmit(async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSubmitted(true)
    setLoading(false)
  })

  if (submitted) {
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
          <Text size="xl" fw={600}>Revisa tu correo</Text>
          <Text size="sm" c="dimmed">
            Si existe una cuenta con <strong>{form.values.email}</strong>, 
            recibirás un enlace para restablecer tu contraseña.
          </Text>
        </Stack>

        <Button 
          component={Link} 
          to="/login" 
          variant="light"
          leftSection={<IconArrowLeft size={16} />}
        >
          Volver al login
        </Button>

        {/* Wireframe annotation */}
        <Alert variant="light" color="yellow" title="AC: S1-01.3" icon={<IconAlertCircle size={16} />}>
          <Text size="xs">
            • Solicitud genera email con token expirable<br/>
            • No revelar si el email existe (seguridad)
          </Text>
        </Alert>
      </Stack>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Stack gap={4}>
          <Text size="xl" fw={600}>Recuperar contraseña</Text>
          <Text size="sm" c="dimmed">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </Text>
        </Stack>

        <TextInput
          label="Correo electrónico"
          placeholder="tu@email.com"
          leftSection={<IconMail size={16} />}
          {...form.getInputProps('email')}
        />

        <Button 
          type="submit" 
          fullWidth 
          loading={loading}
          variant="filled"
          color="dark"
        >
          Enviar enlace
        </Button>

        <Anchor component={Link} to="/login" size="sm" ta="center">
          <IconArrowLeft size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Volver al login
        </Anchor>
      </Stack>
    </form>
  )
}
