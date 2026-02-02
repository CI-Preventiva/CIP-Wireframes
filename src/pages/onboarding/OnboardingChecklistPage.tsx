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
  Progress,
  TextInput,
  Textarea,
  FileInput,
  Center
} from '@mantine/core'
import { useForm } from '@mantine/form'
import {
  IconBuilding,
  IconSitemap,
  IconShield,
  IconUsers,
  IconAlertCircle,
  IconCheck,
  IconArrowRight,
  IconCircleDashed,
  IconUserCog,
  IconUpload,
  IconBriefcase,
  IconHierarchy3
} from '@tabler/icons-react'
import { InfoTooltip } from '../../components/InfoTooltip'

interface ChecklistItem {
  id: string
  title: string
  description: string
  icon: typeof IconBuilding
  path: string
  required: boolean
  completed: boolean
  order: number
}

// Pasos según RF-S1-01
const checklistItems: ChecklistItem[] = [
  {
    id: 'org-data',
    title: 'Datos básicos de la organización',
    description: 'Nombre legal, dirección, sector industrial, logo, etc.',
    icon: IconBuilding,
    path: '#org-data', // Se configura en esta misma página (step 1)
    required: true,
    completed: true,
    order: 1
  },
  {
    id: 'hierarchy-levels',
    title: 'Definir niveles jerárquicos',
    description: 'Nombra los 3 niveles de tu estructura (ej: División > Área > Subárea)',
    icon: IconHierarchy3,
    path: '/admin/hierarchy-levels',
    required: true,
    completed: true,
    order: 2
  },
  {
    id: 'org-units',
    title: 'Crear unidades organizacionales',
    description: 'Crea las divisiones, áreas y subáreas de tu empresa',
    icon: IconSitemap,
    path: '/admin/organizational-units',
    required: true,
    completed: false,
    order: 3
  },
  {
    id: 'positions',
    title: 'Definir cargos',
    description: 'Configura los cargos y familias de cargos de tu organización',
    icon: IconBriefcase,
    path: '/admin/positions',
    required: false,
    completed: false,
    order: 4
  },
  {
    id: 'roles',
    title: 'Configurar roles y permisos',
    description: 'Define qué puede hacer cada tipo de usuario en el sistema',
    icon: IconShield,
    path: '/admin/roles',
    required: false,
    completed: false,
    order: 5
  },
  {
    id: 'profile-fields',
    title: 'Configurar campos de perfil',
    description: 'Define campos adicionales para los perfiles de usuario',
    icon: IconUserCog,
    path: '/admin/profile-fields',
    required: false,
    completed: false,
    order: 6
  },
  {
    id: 'users',
    title: 'Invitar o cargar usuarios',
    description: 'Agrega a tu equipo de trabajo al sistema',
    icon: IconUsers,
    path: '/admin/users',
    required: false,
    completed: false,
    order: 7
  }
]

// Formulario para datos básicos de organización
function OrganizationDataStep({ onComplete }: { onComplete: () => void }) {
  const form = useForm({
    initialValues: {
      legalName: 'Acme Corporation S.A.',
      tradeName: 'Acme Corp',
      taxId: '76.123.456-7',
      ciiu: '4520',
      industry: 'Manufactura',
      address: 'Av. Principal 1234, Santiago',
      country: 'Chile',
      description: 'Empresa líder en manufactura de productos industriales'
    }
  })

  return (
    <Paper withBorder p="lg">
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="lg" variant="light" color="dark">
            <IconBuilding size={20} />
          </ThemeIcon>
          <Box>
            <Text fw={500}>Datos básicos de la organización</Text>
            <Text size="sm" c="dimmed">Información legal y de identificación</Text>
          </Box>
        </Group>

        <Group grow>
          <TextInput
            label="Razón social"
            placeholder="Nombre legal de la empresa"
            withAsterisk
            {...form.getInputProps('legalName')}
          />
          <TextInput
            label="Nombre comercial"
            placeholder="Nombre de fantasía"
            {...form.getInputProps('tradeName')}
          />
        </Group>

        <Group grow>
          <TextInput
            label="RUT / NIT / Tax ID"
            placeholder="Identificador tributario"
            {...form.getInputProps('taxId')}
          />
          <Group grow>
            <TextInput
              label="Código CIIU"
              placeholder="Ej: 4520"
              {...form.getInputProps('ciiu')}
            />
            <Box mt={24}>
              <InfoTooltip
                label="Clasificación Industrial Internacional Uniforme. Identifica la actividad económica principal."
                multiline
                maxWidth={220}
              />
            </Box>
          </Group>
        </Group>

        <TextInput
          label="Industria / Sector"
          placeholder="Ej: Manufactura, Minería, Servicios..."
          {...form.getInputProps('industry')}
        />

        <Group grow>
          <TextInput
            label="Dirección"
            placeholder="Dirección principal"
            {...form.getInputProps('address')}
          />
          <TextInput
            label="País"
            placeholder="País"
            {...form.getInputProps('country')}
          />
        </Group>

        <Textarea
          label="Descripción"
          placeholder="Breve descripción de la organización"
          rows={3}
          {...form.getInputProps('description')}
        />

        <Box>
          <Text size="sm" fw={500} mb="xs">Logo de la organización</Text>
          <Group>
            <Paper withBorder p="md" bg="gray.0" w={100} h={100}>
              <Center h="100%">
                <IconBuilding size={40} color="#868e96" />
              </Center>
            </Paper>
            <FileInput
              placeholder="Subir logo"
              leftSection={<IconUpload size={16} />}
              accept="image/*"
            />
          </Group>
        </Box>

        <Group justify="flex-end">
          <Button onClick={onComplete}>
            Guardar y continuar
          </Button>
        </Group>
      </Stack>
    </Paper>
  )
}

export function OnboardingChecklistPage() {
  const [items] = useState(checklistItems)
  const [showOrgForm, setShowOrgForm] = useState(false)
  
  const completedCount = items.filter(i => i.completed).length
  const requiredCompleted = items.filter(i => i.required && i.completed).length
  const requiredTotal = items.filter(i => i.required).length
  const progress = Math.round((completedCount / items.length) * 100)

  return (
    <Stack gap="lg">
      {/* Header */}
      <Box>
        <Group gap="xs">
          <Title order={2}>Configuración inicial</Title>
          <InfoTooltip
            label="Completa estos pasos para configurar tu organización en la plataforma. Los pasos marcados como 'Requerido' son obligatorios para acceder a los módulos operativos."
            multiline
            maxWidth={300}
          />
        </Group>
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

      {/* Organization Data Form (if expanded) */}
      {showOrgForm && (
        <OrganizationDataStep onComplete={() => setShowOrgForm(false)} />
      )}

      {/* Checklist */}
      <Stack gap="md">
        {items.sort((a, b) => a.order - b.order).map((item) => (
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
              {item.id === 'org-data' ? (
                <Button
                  variant={item.completed ? 'light' : 'filled'}
                  color={item.completed ? 'gray' : 'dark'}
                  rightSection={<IconArrowRight size={16} />}
                  onClick={() => setShowOrgForm(!showOrgForm)}
                >
                  {item.completed ? 'Editar' : 'Configurar'}
                </Button>
              ) : (
                <Button
                  component={Link}
                  to={item.path}
                  variant={item.completed ? 'light' : 'filled'}
                  color={item.completed ? 'gray' : 'dark'}
                  rightSection={<IconArrowRight size={16} />}
                >
                  {item.completed ? 'Editar' : 'Configurar'}
                </Button>
              )}
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
      <Alert variant="light" color="yellow" title="RF-S1-01: Onboarding de nueva organización" icon={<IconAlertCircle size={16} />}>
        <Text size="xs">
          • RF-S1-01.01: Datos básicos de la organización (nombre, dirección, sector, logo)<br/>
          • RF-S1-01.02: Definición de jerarquía organizacional de 3 niveles<br/>
          • RF-S1-01.03: Creación de unidades organizacionales<br/>
          • RF-S1-01.04: Roles y permisos predeterminados y personalizados<br/>
          • RF-S1-01.05: Configuración de campos de perfil adicionales<br/>
          • Pasos requeridos bloquean avance a módulos operativos
        </Text>
      </Alert>
    </Stack>
  )
}
