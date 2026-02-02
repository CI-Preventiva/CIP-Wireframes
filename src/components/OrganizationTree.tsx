import { useState } from 'react'
import { Tree, TreeNode } from 'react-organizational-chart'
import {
    Paper,
    Text,
    Avatar,
    Badge,
    Group,
    Stack,
    ActionIcon,
    Box,
    Tooltip,
    useMantineTheme
} from '@mantine/core'
import {
    IconChevronDown,
    IconChevronRight,
    IconBuilding,
    IconUsers,
    IconHierarchy
} from '@tabler/icons-react'

// Types - Updated to match new user structure
interface User {
    id: string
    email: string
    firstName?: string
    lastName?: string
    phone?: string
    position?: string
    employeeId?: string
    role: string
    organizationalUnitPath: string // e.g., "División > Área > Subárea"
    supervisorId?: string
    supervisorName?: string
    status: 'INVITED' | 'ACTIVE' | 'INACTIVE'
}

interface OrgNode {
    id: string
    type: 'user' | 'level1' | 'level2' | 'level3'
    name: string
    subtitle?: string
    user?: User
    children?: OrgNode[]
}

// Status colors
const statusColors: Record<string, string> = {
    ACTIVE: 'green',
    INVITED: 'blue',
    INACTIVE: 'red'
}

// Build organizational tree from users with 3-level hierarchy
function buildOrgTree(users: User[]): OrgNode {
    // Parse the organizational unit path to extract levels
    const level1Map = new Map<string, Map<string, Map<string, User[]>>>()

    users.forEach(user => {
        // Parse path like "División Industrial > Producción > Planta Norte"
        const parts = user.organizationalUnitPath.split(' > ').map(p => p.trim())
        const level1 = parts[0] || 'Sin asignar'
        const level2 = parts[1] || 'Sin asignar'
        const level3 = parts[2] || 'Sin asignar'

        if (!level1Map.has(level1)) {
            level1Map.set(level1, new Map())
        }
        const level2Map = level1Map.get(level1)!
        
        if (!level2Map.has(level2)) {
            level2Map.set(level2, new Map())
        }
        const level3Map = level2Map.get(level2)!
        
        if (!level3Map.has(level3)) {
            level3Map.set(level3, [])
        }
        level3Map.get(level3)!.push(user)
    })

    // Build tree structure
    const level1Nodes: OrgNode[] = []

    level1Map.forEach((level2Map, level1Name) => {
        const level2Nodes: OrgNode[] = []

        level2Map.forEach((level3Map, level2Name) => {
            const level3Nodes: OrgNode[] = []

            level3Map.forEach((level3Users, level3Name) => {
                // Sort users by role priority
                const sortedUsers = [...level3Users].sort((a, b) => {
                    const rolePriority: Record<string, number> = {
                        'Owner': 1,
                        'Admin': 2,
                        'Supervisor': 3,
                        'Auditor': 4,
                        'Trabajador': 5
                    }
                    return (rolePriority[a.role] || 6) - (rolePriority[b.role] || 6)
                })

                const userNodes: OrgNode[] = sortedUsers.map(user => ({
                    id: `user-${user.id}`,
                    type: 'user' as const,
                    name: user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.email,
                    subtitle: user.position || user.role,
                    user
                }))

                level3Nodes.push({
                    id: `level3-${level1Name}-${level2Name}-${level3Name}`,
                    type: 'level3' as const,
                    name: level3Name,
                    subtitle: `${level3Users.length} usuario${level3Users.length !== 1 ? 's' : ''}`,
                    children: userNodes
                })
            })

            // Calculate total users in level2
            const totalUsersInLevel2 = Array.from(level3Map.values()).reduce((sum, users) => sum + users.length, 0)

            level2Nodes.push({
                id: `level2-${level1Name}-${level2Name}`,
                type: 'level2' as const,
                name: level2Name,
                subtitle: `${level3Nodes.length} subárea${level3Nodes.length !== 1 ? 's' : ''} · ${totalUsersInLevel2} usuario${totalUsersInLevel2 !== 1 ? 's' : ''}`,
                children: level3Nodes
            })
        })

        // Calculate total users in level1
        const totalUsersInLevel1 = level2Nodes.reduce((sum, node) => {
            return sum + (node.children?.reduce((s, n) => s + (n.children?.length || 0), 0) || 0)
        }, 0)

        level1Nodes.push({
            id: `level1-${level1Name}`,
            type: 'level1' as const,
            name: level1Name,
            subtitle: `${level2Nodes.length} área${level2Nodes.length !== 1 ? 's' : ''} · ${totalUsersInLevel1} usuario${totalUsersInLevel1 !== 1 ? 's' : ''}`,
            children: level2Nodes
        })
    })

    // Root node
    return {
        id: 'org-root',
        type: 'level1' as const,
        name: 'Organización',
        subtitle: `${level1Nodes.length} división${level1Nodes.length !== 1 ? 'es' : ''}`,
        children: level1Nodes
    }
}

// Node component styles
const nodeStyles = {
    user: {
        minWidth: 180,
        maxWidth: 220,
        padding: '12px 16px',
        borderRadius: 12,
        cursor: 'default'
    },
    level1: {
        minWidth: 160,
        padding: '10px 14px',
        borderRadius: 10,
        cursor: 'pointer'
    },
    level2: {
        minWidth: 160,
        padding: '10px 14px',
        borderRadius: 10,
        cursor: 'pointer'
    },
    level3: {
        minWidth: 160,
        padding: '10px 14px',
        borderRadius: 10,
        cursor: 'pointer'
    }
}

// User node component
function UserNode({ node }: { node: OrgNode }) {
    const user = node.user!

    const getInitials = () => {
        if (user.firstName && user.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`
        }
        return user.email[0].toUpperCase()
    }

    return (
        <Paper
            withBorder
            shadow="sm"
            style={nodeStyles.user}
        >
            <Stack gap={8} align="center">
                <Avatar size="md" radius="xl" color="dark">
                    {getInitials()}
                </Avatar>
                <Stack gap={2} align="center">
                    <Text size="sm" fw={600} ta="center" lineClamp={1}>
                        {node.name}
                    </Text>
                    <Text size="xs" c="dimmed" ta="center" lineClamp={1}>
                        {node.subtitle}
                    </Text>
                    {user.supervisorName && (
                        <Tooltip label={`Supervisor: ${user.supervisorName}`}>
                            <Text size="xs" c="blue" ta="center" lineClamp={1}>
                                → {user.supervisorName}
                            </Text>
                        </Tooltip>
                    )}
                    <Badge
                        size="xs"
                        variant="light"
                        color={statusColors[user.status]}
                        mt={4}
                    >
                        {user.status === 'ACTIVE' ? 'Activo' :
                            user.status === 'INVITED' ? 'Invitado' : 'Inactivo'}
                    </Badge>
                </Stack>
            </Stack>
        </Paper>
    )
}

// Group node component (level1, level2, or level3)
function GroupNode({
    node,
    expanded,
    onToggle,
    hasChildren
}: {
    node: OrgNode
    expanded: boolean
    onToggle: () => void
    hasChildren: boolean
}) {
    const theme = useMantineTheme()
    
    const bgColor = node.type === 'level1'
        ? theme.colors.blue[0]
        : node.type === 'level2'
        ? theme.colors.violet[0]
        : theme.colors.gray[0]

    const borderColor = node.type === 'level1'
        ? theme.colors.blue[3]
        : node.type === 'level2'
        ? theme.colors.violet[3]
        : theme.colors.gray[3]

    const iconColor = node.type === 'level1' ? 'blue' : node.type === 'level2' ? 'violet' : 'gray'

    const getIcon = () => {
        switch (node.type) {
            case 'level1':
                return <IconBuilding size={18} color={theme.colors.blue[6]} />
            case 'level2':
                return <IconHierarchy size={18} color={theme.colors.violet[6]} />
            case 'level3':
                return <IconUsers size={18} color={theme.colors.gray[6]} />
            default:
                return <IconBuilding size={18} />
        }
    }

    const getTooltipLabel = () => {
        switch (node.type) {
            case 'level1': return 'División'
            case 'level2': return 'Área'
            case 'level3': return 'Subárea'
            default: return 'Unidad'
        }
    }

    return (
        <Paper
            withBorder
            shadow="sm"
            style={{
                ...nodeStyles[node.type],
                backgroundColor: bgColor,
                borderColor: borderColor
            }}
            onClick={hasChildren ? onToggle : undefined}
        >
            <Group gap="xs" justify="center" wrap="nowrap">
                {hasChildren && (
                    <ActionIcon
                        variant="subtle"
                        color={iconColor}
                        size="sm"
                    >
                        {expanded ? (
                            <IconChevronDown size={16} />
                        ) : (
                            <IconChevronRight size={16} />
                        )}
                    </ActionIcon>
                )}
                <Tooltip label={getTooltipLabel()}>
                    <Box>
                        {getIcon()}
                    </Box>
                </Tooltip>
                <Stack gap={0}>
                    <Text size="sm" fw={600} lineClamp={1}>
                        {node.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                        {node.subtitle}
                    </Text>
                </Stack>
            </Group>
        </Paper>
    )
}

// Recursive tree node renderer
function OrgTreeNode({
    node,
    expandedNodes,
    toggleNode
}: {
    node: OrgNode
    expandedNodes: Set<string>
    toggleNode: (id: string) => void
}) {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children && node.children.length > 0

    const nodeContent = node.type === 'user' ? (
        <UserNode node={node} />
    ) : (
        <GroupNode
            node={node}
            expanded={isExpanded}
            onToggle={() => toggleNode(node.id)}
            hasChildren={!!hasChildren}
        />
    )

    if (!hasChildren || !isExpanded) {
        return <TreeNode label={nodeContent} />
    }

    return (
        <TreeNode label={nodeContent}>
            {node.children!.map(child => (
                <OrgTreeNode
                    key={child.id}
                    node={child}
                    expandedNodes={expandedNodes}
                    toggleNode={toggleNode}
                />
            ))}
        </TreeNode>
    )
}

// Main component
interface OrganizationTreeProps {
    users: User[]
}

export function OrganizationTree({ users }: OrganizationTreeProps) {
    const orgTree = buildOrgTree(users)

    // Initialize with all nodes expanded
    const getAllNodeIds = (node: OrgNode): string[] => {
        const ids = [node.id]
        if (node.children) {
            node.children.forEach(child => {
                ids.push(...getAllNodeIds(child))
            })
        }
        return ids
    }

    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
        () => new Set(getAllNodeIds(orgTree))
    )

    const toggleNode = (id: string) => {
        setExpandedNodes(prev => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    return (
        <Box
            style={{
                overflowX: 'auto',
                padding: '24px 16px',
                minHeight: 400
            }}
        >
            <Tree
                lineWidth="2px"
                lineColor="var(--mantine-color-gray-4)"
                lineBorderRadius="8px"
                label={
                    <GroupNode
                        node={orgTree}
                        expanded={expandedNodes.has(orgTree.id)}
                        onToggle={() => toggleNode(orgTree.id)}
                        hasChildren={!!orgTree.children?.length}
                    />
                }
            >
                {expandedNodes.has(orgTree.id) && orgTree.children?.map(child => (
                    <OrgTreeNode
                        key={child.id}
                        node={child}
                        expandedNodes={expandedNodes}
                        toggleNode={toggleNode}
                    />
                ))}
            </Tree>
        </Box>
    )
}
