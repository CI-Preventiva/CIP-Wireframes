import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Stack,
  Title,
  Text,
  Paper,
  Group,
  ThemeIcon,
  Badge,
  Box,
  Alert,
  Button,
  Progress
} from '@mantine/core'
import {
  IconBuilding,
  IconSitemap,
  IconShield,
  IconUsers,
  IconAlertCircle,
  IconCheck,
  IconArrowRight,
  IconCircleDashed
} from '@tabler/icons-react'

interface ChecklistItem {
  id: string
  title: string
  description: string
  icon: typeof IconBuilding
  path: string
  required: boolean
  completed: boolean
}

const checklistItems: ChecklistItem[] = [
  {
    id: 'subsidiaries',
    title: 'Crear al menos una filial',
    description: 'Define la estructura legal de tu organización (ej: Principal, Sucursal Norte)',
    icon: IconBuilding,
    path: '/admin/subsidiaries',
    required: true,
    completed: true
  },
  {
    id: 'areas',
    title: 'Crear áreas en cada filial',
    description: 'Organiza tu empresa con departamentos, plantas, equipos, etc.',
    icon: IconSitemap,
    path: '/admin/areas',
    required: true,
    completed: false
  },
  {
    id: 'roles',
    title: 'Configurar roles y permisos',
    description: 'Define qué puede hacer cada tipo de usuario en el sistema',
    icon: IconShield,
    path: '/admin/roles',
    required: false,
    completed: false
  },
  {
    id: 'users',
    title: 'Invitar usuarios',
    description: 'Agrega a tu equipo de trabajo al sistema',
    icon: IconUsers,
    path: '/admin/users',
    required: false,
    completed: false
  }
]

export function OnboardingChecklistPage() {
  const [items] = useState(checklistItems)
  
  const completedCount = items.filter(i => i.completed).length
  const requiredCompleted = items.filter(i => i.required && i.completed).length
  const requiredTotal = items.filter(i => i.required).length
  const progress = Math.round((completedCount / items.length) * 100)

  return (
    <Stack gap="lg">
      {/* Header */}
      <Box>
        <Title order={2}>Configuración inicial</Title>
        <Text c="dimmed">Completa estos pasos para habilitar el sistema</Text>
      </Box>

      {/* Progress */}
      <Paper withBorder p="lg">
        <Group justify="space-between" mb="md">
          <Box>
            <Text fw={500}>Progreso de configuración</Text>
            <Text size="sm" c="dimmed">
              {completedCount} de {items.length} pasos completados
            </Text>
          </Box>
          <Badge 
            size="lg" 
            variant={requiredCompleted === requiredTotal ? 'filled' : 'light'}
            color={requiredCompleted === requiredTotal ? 'green' : 'yellow'}
          >
            {requiredCompleted === requiredTotal ? 'Mínimos completados' : 'Pendiente'}
          </Badge>
        </Group>
        <Progress value={progress} size="lg" color={progress === 100 ? 'green' : 'dark'} />
      </Paper>

      {/* Required items alert */}
      {requiredCompleted < requiredTotal && (
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Configuración mínima requerida" 
          color="red"
          variant="light"
        >
          <Text size="sm">
            Debes completar los pasos marcados como <Badge size="xs" color="red">Requerido</Badge> para 
            poder acceder a los módulos operativos del sistema.
          </Text>
        </Alert>
      )}

      {/* Checklist */}
      <Stack gap="md">
        {items.map((item) => (
          <Paper 
            key={item.id} 
            withBorder 
            p="md"
            style={{
              borderColor: item.completed ? '#16a34a' : undefined,
              background: item.completed ? '#f0fdf4' : undefined
            }}
          >
            <Group justify="space-between" wrap="nowrap">
              <Group wrap="nowrap">
                <ThemeIcon 
                  size="xl" 
                  variant={item.completed ? 'filled' : 'light'} 
                  color={item.completed ? 'green' : 'gray'}
                >
                  {item.completed ? <IconCheck size={20} /> : <item.icon size={20} />}
                </ThemeIcon>
                <Box>
                  <Group gap="xs">
                    <Text fw={500}>{item.title}</Text>
                    {item.required && (
                      <Badge size="xs" color="red" variant="light">Requerido</Badge>
                    )}
                  </Group>
                  <Text size="sm" c="dimmed">{item.description}</Text>
                </Box>
              </Group>
              <Button
                component={Link}
                to={item.path}
                variant={item.completed ? 'light' : 'filled'}
                color={item.completed ? 'gray' : 'dark'}
                rightSection={<IconArrowRight size={16} />}
              >
                {item.completed ? 'Editar' : 'Configurar'}
              </Button>
            </Group>
          </Paper>
        ))}
      </Stack>

      {/* What's next */}
      <Paper withBorder p="md" bg="#f5f5f5">
        <Group gap="md">
          <ThemeIcon size="lg" variant="light" color="dark">
            <IconCircleDashed size={20} />
          </ThemeIcon>
          <Box>
            <Text fw={500}>¿Qué sigue después?</Text>
            <Text size="sm" c="dimmed">
              Una vez completada la configuración inicial, podrás acceder a los módulos 
              de prevención de riesgos, reportes, inspecciones y más.
            </Text>
          </Box>
        </Group>
      </Paper>

      {/* Wireframe annotation */}
      <Alert variant="light" color="yellow" title="AC: S1-03.2" icon={<IconAlertCircle size={16} />}>
        <Text size="xs">
          • Si no hay filiales, se muestra checklist y se obliga a crear al menos una (por ejemplo "Principal")<br/>
          • Si no hay áreas dentro de una filial, se muestra checklist y se bloquea avance a módulos operativos (por ahora: solo deja Admin)
        </Text>
      </Alert>
    </Stack>
  )
}
