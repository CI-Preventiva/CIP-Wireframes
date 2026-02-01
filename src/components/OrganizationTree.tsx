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
    IconUsers
} from '@tabler/icons-react'

// Types
interface User {
    id: string
    email: string
    firstName?: string
    lastName?: string
    jobTitle?: string
    role: string
    subsidiary: string
    primaryArea: string
    status: 'INVITED' | 'ACTIVE' | 'SUSPENDED'
}

interface OrgNode {
    id: string
    type: 'user' | 'area' | 'subsidiary'
    name: string
    subtitle?: string
    user?: User
    children?: OrgNode[]
}

// Status colors
const statusColors: Record<string, string> = {
    ACTIVE: 'green',
    INVITED: 'blue',
    SUSPENDED: 'red'
}

// Build organizational tree from users
function buildOrgTree(users: User[]): OrgNode {
    // Group users by subsidiary, then by area
    const subsidiaryMap = new Map<string, Map<string, User[]>>()

    users.forEach(user => {
        if (!subsidiaryMap.has(user.subsidiary)) {
            subsidiaryMap.set(user.subsidiary, new Map())
        }
        const areaMap = subsidiaryMap.get(user.subsidiary)!
        if (!areaMap.has(user.primaryArea)) {
            areaMap.set(user.primaryArea, [])
        }
        areaMap.get(user.primaryArea)!.push(user)
    })

    // Build tree structure
    const subsidiaryNodes: OrgNode[] = []

    subsidiaryMap.forEach((areaMap, subsidiaryName) => {
        const areaNodes: OrgNode[] = []

        areaMap.forEach((areaUsers, areaName) => {
            // Sort users by role priority
            const sortedUsers = [...areaUsers].sort((a, b) => {
                const rolePriority: Record<string, number> = {
                    'Owner/Admin': 1,
                    'Supervisor': 2,
                    'Auditor': 3,
                    'Trabajador': 4
                }
                return (rolePriority[a.role] || 5) - (rolePriority[b.role] || 5)
            })

            const userNodes: OrgNode[] = sortedUsers.map(user => ({
                id: `user-${user.id}`,
                type: 'user' as const,
                name: user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email,
                subtitle: user.jobTitle || user.role,
                user
            }))

            areaNodes.push({
                id: `area-${subsidiaryName}-${areaName}`,
                type: 'area' as const,
                name: areaName,
                subtitle: `${areaUsers.length} usuario${areaUsers.length !== 1 ? 's' : ''}`,
                children: userNodes
            })
        })

        subsidiaryNodes.push({
            id: `subsidiary-${subsidiaryName}`,
            type: 'subsidiary' as const,
            name: subsidiaryName,
            subtitle: `${areaNodes.length} área${areaNodes.length !== 1 ? 's' : ''}`,
            children: areaNodes
        })
    })

    // Root node
    return {
        id: 'org-root',
        type: 'subsidiary' as const,
        name: 'Organización',
        subtitle: `${subsidiaryNodes.length} filial${subsidiaryNodes.length !== 1 ? 'es' : ''}`,
        children: subsidiaryNodes
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
    area: {
        minWidth: 160,
        padding: '10px 14px',
        borderRadius: 10,
        cursor: 'pointer'
    },
    subsidiary: {
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
                    <Badge
                        size="xs"
                        variant="light"
                        color={statusColors[user.status]}
                        mt={4}
                    >
                        {user.status === 'ACTIVE' ? 'Activo' :
                            user.status === 'INVITED' ? 'Invitado' : 'Suspendido'}
                    </Badge>
                </Stack>
            </Stack>
        </Paper>
    )
}

// Group node component (area or subsidiary)
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
    const isSubsidiary = node.type === 'subsidiary'

    const bgColor = isSubsidiary
        ? theme.colors.blue[0]
        : theme.colors.gray[0]

    const borderColor = isSubsidiary
        ? theme.colors.blue[3]
        : theme.colors.gray[3]

    const iconColor = isSubsidiary ? 'blue' : 'gray'

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
                <Tooltip label={node.type === 'subsidiary' ? 'Filial' : 'Área'}>
                    <Box>
                        {isSubsidiary ? (
                            <IconBuilding size={18} color={theme.colors.blue[6]} />
                        ) : (
                            <IconUsers size={18} color={theme.colors.gray[6]} />
                        )}
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
