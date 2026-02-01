import { useState, useMemo } from 'react'
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom'
import {
  AppShell,
  Burger,
  Group,
  NavLink as MantineNavLink,
  Text,
  Box,
  Stack,
  Avatar,
  Menu,
  UnstyledButton,
  Divider,
  Badge,
  ScrollArea,
  Flex,
  Breadcrumbs,
  Anchor
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconHome,
  IconBuilding,
  IconSitemap,
  IconUsers,
  IconShield,
  IconBuildingSkyscraper,
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconUser,
  IconShieldCheck,
  IconChecklist
} from '@tabler/icons-react'

const navItems = [
  { 
    label: 'Inicio', 
    icon: IconHome, 
    path: '/' 
  },
  {
    label: 'Configuración Inicial',
    icon: IconChecklist,
    path: '/onboarding',
    badge: 'Setup',
    needsAttention: true
  },
  {
    label: 'Administración',
    icon: IconSettings,
    children: [
      { label: 'Filiales', icon: IconBuilding, path: '/admin/subsidiaries' },
      { label: 'Áreas', icon: IconSitemap, path: '/admin/areas' },
      { label: 'Roles', icon: IconShield, path: '/admin/roles' },
      { label: 'Usuarios', icon: IconUsers, path: '/admin/users' },
    ]
  },
  {
    label: 'SuperAdmin',
    icon: IconBuildingSkyscraper,
    children: [
      { label: 'Organizaciones', icon: IconBuildingSkyscraper, path: '/superadmin/organizations' },
    ],
    superadmin: true
  }
]

export function AppLayout() {
  const [opened, { toggle }] = useDisclosure()
  const [expandedSections, setExpandedSections] = useState<string[]>(['Administración'])
  const location = useLocation()
  const isSuperAdmin = location.pathname.startsWith('/superadmin')

  const toggleSection = (label: string) => {
    setExpandedSections(prev => 
      prev.includes(label) 
        ? prev.filter(l => l !== label)
        : [...prev, label]
    )
  }

  // Generar breadcrumbs basados en la ruta actual
  const breadcrumbs = useMemo(() => {
    const pathnames = location.pathname.split('/').filter((x) => x)
    
    // Mapeo manual de rutas a nombres amigables (MVP simple)
    const nameMap: Record<string, string> = {
      'admin': 'Administración',
      'subsidiaries': 'Filiales',
      'areas': 'Áreas',
      'roles': 'Roles',
      'users': 'Usuarios',
      'bulk-import': 'Carga Masiva',
      'superadmin': 'SuperAdmin',
      'organizations': 'Organizaciones',
      'onboarding': 'Configuración Inicial'
    }

    return [
      { title: 'Inicio', href: '/' },
      ...pathnames.map((value, index) => {
        const href = `/${pathnames.slice(0, index + 1).join('/')}`
        return {
          title: nameMap[value] || value,
          href
        }
      })
    ]
  }, [location.pathname])

  const renderNavItems = () => {
    return navItems.map((item) => {
      if (item.children) {
        const isExpanded = expandedSections.includes(item.label)
        const hasActiveChild = item.children.some(child => location.pathname === child.path)
        
        return (
          <Box key={item.label}>
            <MantineNavLink
              label={item.label}
              leftSection={<item.icon size={18} stroke={1.5} />}
              childrenOffset={28}
              opened={isExpanded}
              onClick={() => toggleSection(item.label)}
              active={hasActiveChild}
              style={item.superadmin ? { 
                background: '#fef3c7', 
                borderLeft: '3px solid #f59e0b' 
              } : undefined}
            >
              {item.children.map((child) => (
                <MantineNavLink
                  key={child.path}
                  component={NavLink}
                  to={child.path}
                  label={child.label}
                  leftSection={<child.icon size={16} stroke={1.5} />}
                  active={location.pathname === child.path}
                />
              ))}
            </MantineNavLink>
          </Box>
        )
      }

      return (
        <MantineNavLink
          key={item.path}
          component={NavLink}
          to={item.path!}
          label={
            <Group justify="space-between">
              <Text size="sm">{item.label}</Text>
              {item.needsAttention && (
                <Box style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
              )}
            </Group>
          }
          leftSection={<item.icon size={18} stroke={1.5} />}
          active={location.pathname === item.path}
          rightSection={item.badge ? <Badge size="xs" variant="light">{item.badge}</Badge> : null}
        />
      )
    })
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ 
        width: 280, 
        breakpoint: 'sm', 
        collapsed: { mobile: !opened } 
      }}
      padding="md"
    >
      <AppShell.Header style={{ borderTop: isSuperAdmin ? '4px solid #fcc419' : undefined }}>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Flex align="center" gap="xs">
              <Box
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  background: '#262626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconShieldCheck size={22} color="white" />
              </Box>
              <Stack gap={0}>
                <Text fw={600} size="sm" lh={1.2}>CIP</Text>
                <Text size="xs" c="dimmed" lh={1}>Wireframes Sprint 1</Text>
              </Stack>
            </Flex>
            {isSuperAdmin && (
              <Badge color="yellow" variant="filled" ml="sm" visibleFrom="xs">
                SUPER ADMIN
              </Badge>
            )}
          </Group>

          <Group>
            <Badge variant="light" color="gray">
              Org: Acme Corp
            </Badge>
            
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap="xs">
                    <Avatar size="sm" radius="xl" color="dark">JD</Avatar>
                    <Box visibleFrom="sm">
                      <Text size="sm" fw={500} lh={1}>Juan Díaz</Text>
                      <Text size="xs" c="dimmed" lh={1.2}>Owner</Text>
                    </Box>
                    <IconChevronDown size={14} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Cuenta</Menu.Label>
                <Menu.Item leftSection={<IconUser size={14} />}>
                  Mi Perfil
                </Menu.Item>
                <Menu.Item leftSection={<IconSettings size={14} />}>
                  Configuración
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item 
                  color="red" 
                  leftSection={<IconLogout size={14} />}
                  component={NavLink}
                  to="/login"
                >
                  Cerrar sesión
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="xs">
        <AppShell.Section grow component={ScrollArea}>
          <Stack gap={4}>
            {renderNavItems()}
          </Stack>
        </AppShell.Section>
        
        <AppShell.Section>
          <Divider my="sm" />
          <Text size="xs" c="dimmed" ta="center">
            Wireframes v1.0 - Sprint 1
          </Text>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main style={{ background: '#fafafa' }}>
        <Stack gap="md">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 1 && (
             <Breadcrumbs separator="→" mb="xs">
               {breadcrumbs.map((item, index) => (
                 <Anchor component={Link} to={item.href} key={index} size="sm" c={index === breadcrumbs.length - 1 ? 'dark' : 'dimmed'}>
                   {item.title}
                 </Anchor>
               ))}
             </Breadcrumbs>
          )}
          <Outlet />
        </Stack>
      </AppShell.Main>
    </AppShell>
  )
}
