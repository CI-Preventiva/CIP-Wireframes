import { Link } from 'react-router-dom'
import {
  Stack,
  Title,
  Text,
  SimpleGrid,
  Paper,
  Group,
  ThemeIcon,
  Badge,
  Box,
  Alert
} from '@mantine/core'
import {
  IconBuilding,
  IconSitemap,
  IconShield,
  IconUsers,
  IconAlertCircle,
  IconArrowRight
} from '@tabler/icons-react'

const quickActions = [
  {
    title: 'Filiales',
    description: 'Gestionar filiales y sub-empresas',
    icon: IconBuilding,
    path: '/admin/subsidiaries',
    count: 3
  },
  {
    title: 'Áreas',
    description: 'Organigrama y estructura jerárquica',
    icon: IconSitemap,
    path: '/admin/areas',
    count: 12
  },
  {
    title: 'Roles',
    description: 'Permisos y control de acceso',
    icon: IconShield,
    path: '/admin/roles',
    count: 5
  },
  {
    title: 'Usuarios',
    description: 'Administrar usuarios del sistema',
    icon: IconUsers,
    path: '/admin/users',
    count: 28
  }
]

const recentActivity = [
  { action: 'Usuario invitado', detail: 'maria.lopez@acme.com', time: 'Hace 5 min' },
  { action: 'Área creada', detail: 'Operaciones - Planta Norte', time: 'Hace 1 hora' },
  { action: 'Rol actualizado', detail: 'Supervisor de Seguridad', time: 'Hace 2 horas' },
  { action: 'Usuario activado', detail: 'carlos.ruiz@acme.com', time: 'Hace 3 horas' }
]

export function HomePage() {
  return (
    <Stack gap="lg">
      {/* Header */}
      <Box>
        <Title order={2}>Bienvenido, Juan</Title>
        <Text c="dimmed">Panel de administración - Acme Corp</Text>
      </Box>

      {/* Config alert */}
      <Alert 
        icon={<IconAlertCircle size={16} />} 
        title="Configuración pendiente" 
        color="yellow"
        variant="light"
      >
        <Group justify="space-between" align="center">
          <Text size="sm">
            Completa la configuración inicial para habilitar todas las funcionalidades.
          </Text>
          <Badge 
            component={Link} 
            to="/onboarding" 
            variant="light" 
            rightSection={<IconArrowRight size={12} />}
            style={{ cursor: 'pointer' }}
          >
            Completar
          </Badge>
        </Group>
      </Alert>

      {/* Quick actions */}
      <Box>
        <Title order={4} mb="md">Acciones rápidas</Title>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
          {quickActions.map((action) => (
            <Paper
              key={action.path}
              component={Link}
              to={action.path}
              p="md"
              withBorder
              style={{ 
                textDecoration: 'none',
                transition: 'all 150ms ease',
                cursor: 'pointer'
              }}
              className="hover-card"
            >
              <Group justify="space-between" mb="xs">
                <ThemeIcon size="lg" variant="light" color="dark">
                  <action.icon size={20} />
                </ThemeIcon>
                <Badge variant="light" color="gray">{action.count}</Badge>
              </Group>
              <Text fw={500}>{action.title}</Text>
              <Text size="xs" c="dimmed">{action.description}</Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Box>

      {/* Recent activity */}
      <Box>
        <Title order={4} mb="md">Actividad reciente</Title>
        <Paper withBorder>
          <Stack gap={0}>
            {recentActivity.map((item, index) => (
              <Box 
                key={index} 
                p="sm"
                style={{ 
                  borderBottom: index < recentActivity.length - 1 ? '1px solid #e5e5e5' : 'none' 
                }}
              >
                <Group justify="space-between">
                  <Box>
                    <Text size="sm" fw={500}>{item.action}</Text>
                    <Text size="xs" c="dimmed">{item.detail}</Text>
                  </Box>
                  <Text size="xs" c="dimmed">{item.time}</Text>
                </Group>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* Wireframe annotation */}
      <Alert variant="light" color="yellow" title="AC: S1-01.4" icon={<IconAlertCircle size={16} />}>
        <Text size="xs">
          • Sidebar muestra/oculta módulos por permisos<br/>
          • Acceso directo por URL a módulo no permitido → 403 "Acceso denegado"
        </Text>
      </Alert>
    </Stack>
  )
}
