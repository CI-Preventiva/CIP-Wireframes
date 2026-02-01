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
  SegmentedControl
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
  IconAlertTriangle
} from '@tabler/icons-react'
import { InfoTooltip } from '../../components/InfoTooltip'

interface ImportRow {
  row: number
  email: string
  firstName: string
  lastName: string
  role: string
  subsidiary: string
  area: string
  status: 'VALID' | 'INVALID'
  errors?: string[]
}

const mockValidatedRows: ImportRow[] = [
  { row: 1, email: 'pedro.garcia@acme.com', firstName: 'Pedro', lastName: 'García', role: 'Trabajador', subsidiary: 'Sede Principal', area: 'Producción', status: 'VALID' },
  { row: 2, email: 'lucia.torres@acme.com', firstName: 'Lucía', lastName: 'Torres', role: 'Supervisor', subsidiary: 'Planta Norte', area: 'Control de Calidad', status: 'VALID' },
  { row: 3, email: 'invalid-email', firstName: 'Test', lastName: 'User', role: 'Trabajador', subsidiary: 'Sede Principal', area: 'Logística', status: 'INVALID', errors: ['Email inválido'] },
  { row: 4, email: 'roberto.silva@acme.com', firstName: 'Roberto', lastName: 'Silva', role: 'NoExiste', subsidiary: 'Sede Principal', area: 'RRHH', status: 'INVALID', errors: ['Rol "NoExiste" no existe'] },
  { row: 5, email: 'carmen.vega@acme.com', firstName: 'Carmen', lastName: 'Vega', role: 'Trabajador', subsidiary: 'FilialFalsa', area: 'Operaciones', status: 'INVALID', errors: ['Filial "FilialFalsa" no existe'] },
  { row: 6, email: 'mario.reyes@acme.com', firstName: 'Mario', lastName: 'Reyes', role: 'Trabajador', subsidiary: 'Sede Principal', area: 'Mantenimiento', status: 'VALID' },
]

export function BulkImportPage() {
  const [active, setActive] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [validatedRows, setValidatedRows] = useState<ImportRow[]>([])
  const [processing, setProcessing] = useState(false)
  const [filter, setFilter] = useState('ALL')
  const [sendInvitesModal, { open: openSendModal, close: closeSendModal }] = useDisclosure(false)

  const validCount = validatedRows.filter(r => r.status === 'VALID').length
  const invalidCount = validatedRows.filter(r => r.status === 'INVALID').length

  const filteredRows = validatedRows.filter(r => {
    if (filter === 'VALID') return r.status === 'VALID'
    if (filter === 'INVALID') return r.status === 'INVALID'
    return true
  })

  const handleUpload = async (files: File[]) => {
    const uploadedFile = files[0]
    setFile(uploadedFile)

    // Simular validación
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setValidatedRows(mockValidatedRows)
    setProcessing(false)
    setActive(1)
  }

  const handleProcess = async (_sendInvites: boolean) => {
    closeSendModal()
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setProcessing(false)
    setActive(3)
  }

  const downloadTemplate = () => {
    // En producción, descargaría un archivo real
    alert('Descargando plantilla CSV...')
  }

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
              label="La carga masiva permite crear múltiples usuarios a la vez desde un archivo CSV o Excel. El sistema validará los datos antes de crear los usuarios."
              multiline
              maxWidth={280}
            />
          </Group>
          <Text c="dimmed">Importa múltiples usuarios desde un archivo CSV o Excel</Text>
        </Box>
      </Group>

      {/* Stepper */}
      <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
        <Stepper.Step label="Subir archivo" description="CSV o Excel">
          <Paper withBorder p="xl" mt="md">
            <Stack gap="md">
              {/* Download template */}
              <Alert
                icon={<IconFileSpreadsheet size={16} />}
                title="Plantilla"
                color="blue"
                variant="light"
              >
                <Group justify="space-between" align="center">
                  <Text size="sm">
                    Descarga la plantilla con el formato correcto (incluye filial y área).
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

              {/* Dropzone */}
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

              {/* Expected columns */}
              <Box>
                <Group gap={4} mb="xs">
                  <Text size="sm" fw={500}>Columnas esperadas:</Text>
                  <InfoTooltip
                    label="Estas son las columnas requeridas en tu archivo. Descarga la plantilla para ver el formato exacto y ejemplos de cada columna."
                    multiline
                    maxWidth={250}
                  />
                </Group>
                <Group gap="xs">
                  {['email', 'nombre', 'apellido', 'cargo', 'rol', 'filial', 'area', 'alcance'].map(col => (
                    <Badge key={col} variant="light" color="gray">{col}</Badge>
                  ))}
                </Group>
              </Box>
            </Stack>
          </Paper>
        </Stepper.Step>

        <Stepper.Step label="Validar" description="Revisar errores">
          <Paper withBorder p="xl" mt="md">
            <Stack gap="md">
              {/* Summary */}
              <Group justify="space-between">
                <Box>
                  <Group gap={4}>
                    <Text fw={500}>Resultados de validación</Text>
                    <InfoTooltip
                      label="El sistema ha verificado cada fila del archivo. Las filas válidas se importarán, las inválidas requieren corrección antes de procesar."
                      multiline
                      maxWidth={260}
                    />
                  </Group>
                  <Text size="sm" c="dimmed">Archivo: {file?.name}</Text>
                </Box>
                <Group>
                  <Badge size="lg" color="green" variant="light">
                    {validCount} válidos
                  </Badge>
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

              {/* Filter controls */}
              <Group justify="space-between" mt="md">
                <Text fw={500}>Detalle de filas</Text>
                <SegmentedControl
                  value={filter}
                  onChange={setFilter}
                  data={[
                    { label: 'Todos', value: 'ALL' },
                    { label: `Válidos (${validCount})`, value: 'VALID' },
                    { label: `Con errores (${invalidCount})`, value: 'INVALID' }
                  ]}
                />
              </Group>

              {/* Unified Table */}
              <Table withTableBorder striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Fila</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Nombre</Table.Th>
                    <Table.Th>Rol / Filial / Área</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    <Table.Th>Detalles</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredRows.length > 0 ? (
                    filteredRows.map((row) => (
                      <Table.Tr key={row.row} bg={row.status === 'INVALID' ? 'red.0' : undefined}>
                        <Table.Td>{row.row}</Table.Td>
                        <Table.Td>{row.email}</Table.Td>
                        <Table.Td>{row.firstName} {row.lastName}</Table.Td>
                        <Table.Td>
                          <Stack gap={2}>
                            <Text size="xs" fw={500}>{row.role}</Text>
                            <Text size="xs" c="dimmed">{row.subsidiary} / {row.area}</Text>
                          </Stack>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={row.status === 'VALID' ? 'green' : 'red'}
                            variant="light"
                            size="sm"
                          >
                            {row.status === 'VALID' ? 'Válido' : 'Error'}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {row.status === 'INVALID' ? (
                            <Group gap={4}>
                              <IconAlertTriangle size={14} color="red" />
                              <Text size="xs" c="red">
                                {row.errors?.join(', ')}
                              </Text>
                            </Group>
                          ) : (
                            <Group gap={4}>
                              <IconCheck size={14} color="green" />
                              <Text size="xs" c="green">Listo para importar</Text>
                            </Group>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={6} align="center">
                        <Text c="dimmed" py="md">No hay filas que coincidan con el filtro seleccionado</Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>

              {/* Actions */}
              <Group justify="flex-end">
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

        <Stepper.Step label="Procesar" description="Crear usuarios">
          {/* Processing state handled by modal */}
        </Stepper.Step>

        <Stepper.Completed>
          <Paper withBorder p="xl" mt="md">
            <Stack align="center" gap="md">
              <ThemeIcon size={64} radius="xl" color="green">
                <IconCheck size={36} />
              </ThemeIcon>
              <Title order={3}>¡Importación completada!</Title>
              <Text c="dimmed" ta="center">
                Se crearon {validCount} usuarios correctamente.<br />
                Las invitaciones han sido enviadas.
              </Text>
              <Group>
                <Button
                  variant="light"
                  component={Link}
                  to="/admin/users"
                >
                  Ver usuarios
                </Button>
                <Button onClick={() => {
                  setActive(0)
                  setFile(null)
                  setValidatedRows([])
                }}>
                  Nueva importación
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Stepper.Completed>
      </Stepper>

      {/* Send invites modal */}
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
      <Alert variant="light" color="yellow" title="AC: S1-05.7, S1-05.8" icon={<IconAlertCircle size={16} />}>
        <Text size="xs">
          • Subida CSV/Excel con columnas: email, nombre, cargo, rol, filial, área principal, alcance<br />
          • Prevalidación verifica existencia de filial y coherencia área↔filial<br />
          • Previsualización: válidos vs inválidos y errores por fila<br />
          • No crea usuarios hasta confirmar<br />
          • Pop-up: "¿Enviar invitación a todos?" Sí/No<br />
          • Si Sí → envía invitación en lote, reporta N ok / M fallas<br />
          • Si No → usuarios quedan Invited y el admin puede enviar después
        </Text>
      </Alert>
    </Stack>
  )
}
