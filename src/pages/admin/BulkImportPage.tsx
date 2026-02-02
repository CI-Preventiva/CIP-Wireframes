import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Stack,
  Title,
  Text,
  Paper,
  Group,
  Button,
  Table,
  Badge,
  Alert,
  Box,
  Stepper,
  ThemeIcon,
  Progress,
  Modal,
  List,
  Select,
  Divider,
  SegmentedControl,
  ScrollArea
} from '@mantine/core'
import { Dropzone, MIME_TYPES } from '@mantine/dropzone'
import { useDisclosure } from '@mantine/hooks'
import {
  IconUpload,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconFileSpreadsheet,
  IconDownload,
  IconArrowLeft,
  IconMail,
  IconAlertTriangle,
  IconArrowRight,
  IconHierarchy3,
  IconColumns
} from '@tabler/icons-react'
import { InfoTooltip } from '../../components/InfoTooltip'

interface ExcelColumn {
  index: number
  header: string
  sampleValues: string[]
}

interface FieldMapping {
  excelColumn: string | null
  systemField: string
  label: string
  required: boolean
}

interface HierarchyMapping {
  level: number
  levelName: string
  excelColumn: string | null
}

interface ImportRow {
  row: number
  email: string
  firstName: string
  lastName: string
  phone: string
  position: string
  supervisor: string
  level1: string
  level2: string
  level3: string
  status: 'VALID' | 'INVALID'
  errors?: string[]
  warnings?: string[]
}

// Columnas detectadas del Excel (simuladas)
const mockExcelColumns: ExcelColumn[] = [
  { index: 0, header: 'Nombre', sampleValues: ['Juan', 'María', 'Pedro'] },
  { index: 1, header: 'Apellido', sampleValues: ['Pérez', 'García', 'López'] },
  { index: 2, header: 'Correo', sampleValues: ['juan@acme.com', 'maria@acme.com', 'pedro@acme.com'] },
  { index: 3, header: 'Teléfono', sampleValues: ['+56912345678', '+56987654321', '+56911111111'] },
  { index: 4, header: 'División', sampleValues: ['Operaciones', 'Administración', 'Operaciones'] },
  { index: 5, header: 'Gerencia', sampleValues: ['G. Producción', 'G. RRHH', 'G. Mantenimiento'] },
  { index: 6, header: 'Departamento', sampleValues: ['Línea A', 'Reclutamiento', 'Preventivo'] },
  { index: 7, header: 'Cargo', sampleValues: ['Operador', 'Analista', 'Técnico'] },
  { index: 8, header: 'Jefe Directo', sampleValues: ['Carlos Ruiz', 'Ana Torres', 'Carlos Ruiz'] },
  { index: 9, header: 'RUT', sampleValues: ['12345678-9', '98765432-1', '11111111-1'] },
]

// Nombres de niveles jerárquicos (vendría de la configuración)
const hierarchyLevelNames = ['División', 'Gerencia', 'Departamento']

const mockValidatedRows: ImportRow[] = [
  { row: 1, email: 'juan@acme.com', firstName: 'Juan', lastName: 'Pérez', phone: '+56912345678', position: 'Operador', supervisor: 'Carlos Ruiz', level1: 'Operaciones', level2: 'G. Producción', level3: 'Línea A', status: 'VALID' },
  { row: 2, email: 'maria@acme.com', firstName: 'María', lastName: 'García', phone: '+56987654321', position: 'Analista', supervisor: 'Ana Torres', level1: 'Administración', level2: 'G. RRHH', level3: 'Reclutamiento', status: 'VALID' },
  { row: 3, email: 'invalid-email', firstName: 'Test', lastName: 'User', phone: '', position: 'Técnico', supervisor: '', level1: 'Operaciones', level2: 'G. Mantenimiento', level3: 'Preventivo', status: 'INVALID', errors: ['Email inválido', 'Teléfono vacío'] },
  { row: 4, email: 'pedro@acme.com', firstName: 'Pedro', lastName: 'López', phone: '+56911111111', position: 'Técnico', supervisor: 'NoExiste', level1: 'Operaciones', level2: 'G. Mantenimiento', level3: 'Preventivo', status: 'VALID', warnings: ['Supervisor "NoExiste" no encontrado, quedará sin asignar'] },
]

// Unidades que se crearían automáticamente
const mockNewUnits = [
  { level: 1, name: 'Operaciones', exists: true },
  { level: 1, name: 'Administración', exists: false },
  { level: 2, name: 'G. Producción', parent: 'Operaciones', exists: true },
  { level: 2, name: 'G. RRHH', parent: 'Administración', exists: false },
  { level: 2, name: 'G. Mantenimiento', parent: 'Operaciones', exists: false },
  { level: 3, name: 'Línea A', parent: 'G. Producción', exists: true },
  { level: 3, name: 'Reclutamiento', parent: 'G. RRHH', exists: false },
  { level: 3, name: 'Preventivo', parent: 'G. Mantenimiento', exists: false },
]

export function BulkImportPage() {
  const [active, setActive] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [excelColumns, setExcelColumns] = useState<ExcelColumn[]>([])
  const [validatedRows, setValidatedRows] = useState<ImportRow[]>([])
  const [processing, setProcessing] = useState(false)
  const [filter, setFilter] = useState('ALL')
  const [sendInvitesModal, { open: openSendModal, close: closeSendModal }] = useDisclosure(false)

  // Mapeo de campos
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([
    { excelColumn: null, systemField: 'email', label: 'Correo electrónico', required: true },
    { excelColumn: null, systemField: 'first_name', label: 'Nombre', required: true },
    { excelColumn: null, systemField: 'last_name', label: 'Apellido', required: true },
    { excelColumn: null, systemField: 'phone', label: 'Teléfono', required: true },
    { excelColumn: null, systemField: 'position', label: 'Cargo', required: false },
    { excelColumn: null, systemField: 'employee_id', label: 'ID de empleado', required: false },
    { excelColumn: null, systemField: 'supervisor', label: 'Supervisor', required: false },
  ])

  // Mapeo de jerarquía
  const [hierarchyMappings, setHierarchyMappings] = useState<HierarchyMapping[]>([
    { level: 1, levelName: hierarchyLevelNames[0], excelColumn: null },
    { level: 2, levelName: hierarchyLevelNames[1], excelColumn: null },
    { level: 3, levelName: hierarchyLevelNames[2], excelColumn: null },
  ])

  const validCount = validatedRows.filter(r => r.status === 'VALID').length
  const invalidCount = validatedRows.filter(r => r.status === 'INVALID').length
  const warningCount = validatedRows.filter(r => r.warnings && r.warnings.length > 0).length
  const newUnitsCount = mockNewUnits.filter(u => !u.exists).length

  const filteredRows = validatedRows.filter(r => {
    if (filter === 'VALID') return r.status === 'VALID'
    if (filter === 'INVALID') return r.status === 'INVALID'
    if (filter === 'WARNING') return r.warnings && r.warnings.length > 0
    return true
  })

  const handleUpload = async (files: File[]) => {
    const uploadedFile = files[0]
    setFile(uploadedFile)
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setExcelColumns(mockExcelColumns)
    setProcessing(false)
    setActive(1)
  }

  const updateFieldMapping = (systemField: string, excelColumn: string | null) => {
    setFieldMappings(prev => prev.map(m =>
      m.systemField === systemField ? { ...m, excelColumn } : m
    ))
  }

  const updateHierarchyMapping = (level: number, excelColumn: string | null) => {
    setHierarchyMappings(prev => prev.map(m =>
      m.level === level ? { ...m, excelColumn } : m
    ))
  }

  const canProceedToValidation = () => {
    const requiredMapped = fieldMappings.filter(m => m.required).every(m => m.excelColumn)
    return requiredMapped
  }

  const handleValidate = async () => {
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setValidatedRows(mockValidatedRows)
    setProcessing(false)
    setActive(2)
  }

  const handleProcess = async (_sendInvites: boolean) => {
    closeSendModal()
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setProcessing(false)
    setActive(4)
  }

  const downloadTemplate = () => {
    alert('Descargando plantilla Excel...')
  }

  const excelColumnOptions = [
    { value: '', label: '-- No mapear --' },
    ...excelColumns.map(c => ({ 
      value: c.header, 
      label: `${c.header} (ej: ${c.sampleValues[0]})` 
    }))
  ]

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <Box>
          <Group gap="xs" mb={4}>
            <Button
              variant="subtle"
              size="compact-sm"
              component={Link}
              to="/admin/users"
              leftSection={<IconArrowLeft size={14} />}
            >
              Volver a usuarios
            </Button>
          </Group>
          <Group gap={4}>
            <Title order={2}>Carga masiva de usuarios</Title>
            <InfoTooltip
              label="Importa múltiples usuarios desde un archivo Excel. El sistema validará los datos, creará automáticamente las unidades organizacionales faltantes e inferirá las relaciones de supervisión."
              multiline
              maxWidth={320}
            />
          </Group>
          <Text c="dimmed">Importa usuarios y estructura organizacional desde Excel</Text>
        </Box>
      </Group>

      {/* Stepper */}
      <Stepper active={active} allowNextStepsSelect={false}>
        {/* PASO 1: Subir archivo */}
        <Stepper.Step label="Subir archivo" description="Excel o CSV">
          <Paper withBorder p="xl" mt="md">
            <Stack gap="md">
              <Alert
                icon={<IconFileSpreadsheet size={16} />}
                title="Plantilla recomendada"
                color="blue"
                variant="light"
              >
                <Group justify="space-between" align="center">
                  <Text size="sm">
                    Descarga la plantilla con el formato correcto para facilitar la importación.
                  </Text>
                  <Button
                    variant="light"
                    size="xs"
                    leftSection={<IconDownload size={14} />}
                    onClick={downloadTemplate}
                  >
                    Descargar plantilla
                  </Button>
                </Group>
              </Alert>

              <Dropzone
                onDrop={handleUpload}
                accept={[MIME_TYPES.csv, MIME_TYPES.xlsx]}
                maxSize={5 * 1024 ** 2}
                loading={processing}
              >
                <Group justify="center" gap="xl" mih={200} style={{ pointerEvents: 'none' }}>
                  <Dropzone.Accept>
                    <IconCheck size={52} color="green" />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX size={52} color="red" />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconUpload size={52} color="#737373" />
                  </Dropzone.Idle>
                  <div>
                    <Text size="xl" inline>
                      Arrastra el archivo aquí o haz clic para seleccionar
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Archivos CSV o Excel, máximo 5MB
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            </Stack>
          </Paper>
        </Stepper.Step>

        {/* PASO 2: Mapeo de columnas */}
        <Stepper.Step label="Mapear columnas" description="Asignar campos">
          <Paper withBorder p="xl" mt="md">
            <Stack gap="lg">
              <Group justify="space-between">
                <Box>
                  <Group gap="xs">
                    <IconColumns size={20} />
                    <Text fw={500}>Mapeo de columnas</Text>
                  </Group>
                  <Text size="sm" c="dimmed">Archivo: {file?.name}</Text>
                </Box>
                <Badge color="blue" variant="light">
                  {excelColumns.length} columnas detectadas
                </Badge>
              </Group>

              <Divider label="Campos de usuario" labelPosition="center" />

              <Box>
                <Text size="sm" fw={500} mb="xs">
                  Asigna cada columna del Excel al campo correspondiente del sistema
                </Text>
                <Paper withBorder p="md" bg="gray.0">
                  <Stack gap="sm">
                    {fieldMappings.map(mapping => (
                      <Group key={mapping.systemField} justify="space-between">
                        <Group gap="xs">
                          <Text size="sm" fw={500}>{mapping.label}</Text>
                          {mapping.required && (
                            <Badge size="xs" color="red" variant="light">Requerido</Badge>
                          )}
                        </Group>
                        <Select
                          placeholder="Seleccionar columna"
                          data={excelColumnOptions}
                          value={mapping.excelColumn || ''}
                          onChange={(v) => updateFieldMapping(mapping.systemField, v || null)}
                          w={300}
                          size="sm"
                          error={mapping.required && !mapping.excelColumn}
                        />
                      </Group>
                    ))}
                  </Stack>
                </Paper>
              </Box>

              <Divider label="Estructura organizacional" labelPosition="center" />

              <Alert icon={<IconHierarchy3 size={16} />} color="cyan" variant="light">
                <Text size="sm">
                  <strong>Inferencia de jerarquía:</strong> Si mapeas columnas a los niveles jerárquicos, 
                  el sistema creará automáticamente las unidades organizacionales que no existan.
                </Text>
              </Alert>

              <Box>
                <Text size="sm" fw={500} mb="xs">
                  Mapeo de niveles jerárquicos (opcional)
                </Text>
                <Paper withBorder p="md" bg="gray.0">
                  <Stack gap="sm">
                    {hierarchyMappings.map(mapping => (
                      <Group key={mapping.level} justify="space-between">
                        <Group gap="xs">
                          <Badge variant="filled" color={mapping.level === 1 ? 'blue' : mapping.level === 2 ? 'cyan' : 'teal'}>
                            Nivel {mapping.level}
                          </Badge>
                          <Text size="sm">{mapping.levelName}</Text>
                        </Group>
                        <Select
                          placeholder="Seleccionar columna"
                          data={excelColumnOptions}
                          value={mapping.excelColumn || ''}
                          onChange={(v) => updateHierarchyMapping(mapping.level, v || null)}
                          w={300}
                          size="sm"
                        />
                      </Group>
                    ))}
                  </Stack>
                </Paper>
                <Text size="xs" c="dimmed" mt="xs">
                  Puedes mapear 1, 2 o 3 niveles según la información disponible en tu archivo.
                </Text>
              </Box>

              <Group justify="flex-end">
                <Button variant="light" onClick={() => setActive(0)}>
                  Volver
                </Button>
                <Button
                  onClick={handleValidate}
                  disabled={!canProceedToValidation()}
                  loading={processing}
                  rightSection={<IconArrowRight size={16} />}
                >
                  Validar datos
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Stepper.Step>

        {/* PASO 3: Validación */}
        <Stepper.Step label="Validar" description="Revisar errores">
          <Paper withBorder p="xl" mt="md">
            <Stack gap="md">
              {/* Summary */}
              <Group justify="space-between">
                <Box>
                  <Group gap="xs">
                    <Text fw={500}>Resultados de validación</Text>
                    <InfoTooltip
                      label="El sistema ha verificado cada fila y detectado las unidades organizacionales que se crearían automáticamente."
                      multiline
                      maxWidth={260}
                    />
                  </Group>
                </Box>
                <Group>
                  <Badge size="lg" color="green" variant="light">
                    {validCount} válidos
                  </Badge>
                  {warningCount > 0 && (
                    <Badge size="lg" color="yellow" variant="light">
                      {warningCount} con advertencias
                    </Badge>
                  )}
                  <Badge size="lg" color="red" variant="light">
                    {invalidCount} con errores
                  </Badge>
                </Group>
              </Group>

              <Progress.Root size="xl">
                <Progress.Section value={(validCount / validatedRows.length) * 100} color="green">
                  <Progress.Label>Válidos</Progress.Label>
                </Progress.Section>
                <Progress.Section value={(invalidCount / validatedRows.length) * 100} color="red">
                  <Progress.Label>Errores</Progress.Label>
                </Progress.Section>
              </Progress.Root>

              {/* New units to be created */}
              {newUnitsCount > 0 && (
                <Alert icon={<IconHierarchy3 size={16} />} color="cyan" variant="light" title="Unidades a crear">
                  <Text size="sm" mb="xs">
                    Se crearán automáticamente <strong>{newUnitsCount} unidades organizacionales</strong> nuevas:
                  </Text>
                  <Group gap="xs">
                    {mockNewUnits.filter(u => !u.exists).map((unit, i) => (
                      <Badge key={i} variant="light" color="cyan" size="sm">
                        {unit.name}
                      </Badge>
                    ))}
                  </Group>
                </Alert>
              )}

              {/* Filter controls */}
              <Group justify="space-between" mt="md">
                <Text fw={500}>Detalle de filas</Text>
                <SegmentedControl
                  value={filter}
                  onChange={setFilter}
                  data={[
                    { label: 'Todos', value: 'ALL' },
                    { label: `Válidos (${validCount})`, value: 'VALID' },
                    { label: `Advertencias (${warningCount})`, value: 'WARNING' },
                    { label: `Errores (${invalidCount})`, value: 'INVALID' }
                  ]}
                />
              </Group>

              {/* Table */}
              <ScrollArea h={400}>
                <Table withTableBorder striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Fila</Table.Th>
                      <Table.Th>Email</Table.Th>
                      <Table.Th>Nombre</Table.Th>
                      <Table.Th>Estructura</Table.Th>
                      <Table.Th>Supervisor</Table.Th>
                      <Table.Th>Estado</Table.Th>
                      <Table.Th>Detalles</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredRows.map((row) => (
                      <Table.Tr key={row.row} bg={row.status === 'INVALID' ? 'red.0' : row.warnings ? 'yellow.0' : undefined}>
                        <Table.Td>{row.row}</Table.Td>
                        <Table.Td>{row.email}</Table.Td>
                        <Table.Td>{row.firstName} {row.lastName}</Table.Td>
                        <Table.Td>
                          <Stack gap={2}>
                            <Text size="xs">{row.level1}</Text>
                            <Text size="xs" c="dimmed">→ {row.level2} → {row.level3}</Text>
                          </Stack>
                        </Table.Td>
                        <Table.Td>
                          <Text size="xs">{row.supervisor || '-'}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={row.status === 'VALID' ? (row.warnings ? 'yellow' : 'green') : 'red'}
                            variant="light"
                            size="sm"
                          >
                            {row.status === 'VALID' ? (row.warnings ? 'Advertencia' : 'Válido') : 'Error'}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {row.status === 'INVALID' ? (
                            <Group gap={4}>
                              <IconAlertTriangle size={14} color="red" />
                              <Text size="xs" c="red">{row.errors?.join(', ')}</Text>
                            </Group>
                          ) : row.warnings ? (
                            <Group gap={4}>
                              <IconAlertTriangle size={14} color="orange" />
                              <Text size="xs" c="orange">{row.warnings.join(', ')}</Text>
                            </Group>
                          ) : (
                            <Group gap={4}>
                              <IconCheck size={14} color="green" />
                              <Text size="xs" c="green">Listo</Text>
                            </Group>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              {/* Actions */}
              <Group justify="flex-end">
                <Button variant="light" onClick={() => setActive(1)}>
                  Volver al mapeo
                </Button>
                <Button variant="light" onClick={() => setActive(0)}>
                  Subir otro archivo
                </Button>
                <Button
                  onClick={openSendModal}
                  disabled={validCount === 0}
                >
                  Procesar {validCount} usuarios válidos
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Stepper.Step>

        {/* PASO 4: Procesar */}
        <Stepper.Step label="Procesar" description="Crear usuarios">
        </Stepper.Step>

        {/* Completado */}
        <Stepper.Completed>
          <Paper withBorder p="xl" mt="md">
            <Stack align="center" gap="md">
              <ThemeIcon size={64} radius="xl" color="green">
                <IconCheck size={36} />
              </ThemeIcon>
              <Title order={3}>¡Importación completada!</Title>
              <Text c="dimmed" ta="center">
                Se crearon <strong>{validCount} usuarios</strong> correctamente.
                {newUnitsCount > 0 && (
                  <>
                    <br />
                    Se crearon <strong>{newUnitsCount} unidades organizacionales</strong> nuevas.
                  </>
                )}
              </Text>
              <Group>
                <Button
                  variant="light"
                  component={Link}
                  to="/admin/users"
                >
                  Ver usuarios
                </Button>
                <Button
                  variant="light"
                  component={Link}
                  to="/admin/organizational-units"
                >
                  Ver estructura
                </Button>
                <Button onClick={() => {
                  setActive(0)
                  setFile(null)
                  setValidatedRows([])
                  setExcelColumns([])
                }}>
                  Nueva importación
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Stepper.Completed>
      </Stepper>

      {/* Modal enviar invitaciones */}
      <Modal
        opened={sendInvitesModal}
        onClose={closeSendModal}
        title="¿Enviar invitaciones?"
        centered
      >
        <Stack gap="md">
          <Alert icon={<IconMail size={16} />} color="blue" variant="light">
            Se crearán {validCount} usuarios con estado <Badge size="xs">INVITED</Badge>
          </Alert>

          {newUnitsCount > 0 && (
            <Alert icon={<IconHierarchy3 size={16} />} color="cyan" variant="light">
              Se crearán {newUnitsCount} unidades organizacionales nuevas
            </Alert>
          )}

          <Text size="sm">
            ¿Deseas enviar las invitaciones por correo electrónico ahora?
          </Text>

          <List size="sm" c="dimmed">
            <List.Item>Si eliges "Sí", se enviará un email a cada usuario con un link de activación.</List.Item>
            <List.Item>Si eliges "No", los usuarios quedarán en estado "Invitado" y podrás enviar las invitaciones después.</List.Item>
          </List>

          <Group justify="flex-end">
            <Button variant="light" onClick={() => handleProcess(false)}>
              No, solo crear
            </Button>
            <Button
              leftSection={<IconMail size={16} />}
              onClick={() => handleProcess(true)}
              loading={processing}
            >
              Sí, enviar invitaciones
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Wireframe annotation */}
      <Alert variant="light" color="yellow" title="RF-S1-01.06, RF-S1-01.07 / HU-S1-08, HU-S1-09" icon={<IconAlertCircle size={16} />}>
        <Text size="xs">
          • Subida Excel con detección automática de columnas<br/>
          • <strong>Mapeo interactivo</strong>: Owner asigna cada columna a campo del sistema<br/>
          • <strong>Mapeo de niveles jerárquicos</strong>: Owner indica qué columna es Nivel 1, 2, 3<br/>
          • <strong>Inferencia de estructura</strong>: Se crean unidades organizacionales automáticamente<br/>
          • <strong>Inferencia de supervisión</strong>: Se asigna supervisor si existe en el sistema<br/>
          • Flexibilidad: soporta 1, 2 o 3 niveles según el archivo<br/>
          • Validación completa antes de crear usuarios
        </Text>
      </Alert>
    </Stack>
  )
}
