import { Outlet } from 'react-router-dom'
import { Box, Paper, Stack, Text, Flex } from '@mantine/core'
import { IconShieldCheck } from '@tabler/icons-react'

export function AuthLayout() {
  return (
    <Box 
      style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <Stack gap="xl" align="center" w="100%" maw={420}>
        {/* Logo placeholder */}
        <Flex align="center" gap="sm">
          <Box
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              background: '#262626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <IconShieldCheck size={28} color="white" />
          </Box>
          <Stack gap={0}>
            <Text fw={700} size="xl" c="dark">CIP</Text>
            <Text size="xs" c="dimmed">Centro de Inteligencia Preventiva</Text>
          </Stack>
        </Flex>

        {/* Auth card */}
        <Paper 
          shadow="sm" 
          p="xl" 
          radius="md" 
          withBorder 
          w="100%"
          style={{ background: 'white' }}
        >
          <Outlet />
        </Paper>

        {/* Footer */}
        <Text size="xs" c="dimmed">
          © 2024 CIP - Todos los derechos reservados
        </Text>
      </Stack>
    </Box>
  )
}
