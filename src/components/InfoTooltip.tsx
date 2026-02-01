import { Tooltip, ActionIcon } from '@mantine/core'
import { IconInfoCircle, IconQuestionMark, IconHelp } from '@tabler/icons-react'

interface InfoTooltipProps {
    label: string
    variant?: 'info' | 'question' | 'help'
    multiline?: boolean
    maxWidth?: number
    position?: 'top' | 'left' | 'right' | 'bottom'
}

/**
 * InfoTooltip: Un componente reutilizable para mostrar tooltips de ayuda
 * Sigue las mejores prácticas de accesibilidad y diseño web
 */
export function InfoTooltip({
    label,
    variant = 'info',
    multiline = false,
    maxWidth = 220,
    position = 'top'
}: InfoTooltipProps) {
    const icons = {
        info: IconInfoCircle,
        question: IconQuestionMark,
        help: IconHelp
    }

    const Icon = icons[variant]

    return (
        <Tooltip
            label={label}
            multiline={multiline}
            w={multiline ? maxWidth : undefined}
            withArrow
            position={position}
            transitionProps={{ duration: 200 }}
        >
            <ActionIcon
                variant="subtle"
                color="gray"
                size="xs"
                aria-label="Más información"
                style={{ cursor: 'help' }}
            >
                <Icon size={14} />
            </ActionIcon>
        </Tooltip>
    )
}
