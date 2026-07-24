import { ReactNode } from 'react'

export interface ButtonProps {
    text: string
    onClick?: () => void
    icon?: ReactNode
    variant?: 'primary' | 'secondary'
    className?: string
}

export interface HeroSectionProps {
    title: string | ReactNode
    subtitle: string | ReactNode
    buttonText: string
    buttonAction?: () => void
    image: string
}

export interface GrowthSectionProps {
    text: string | ReactNode
    highlightText: string
    subText: string
}

export interface EvaluationCardProps {
    title: string
    description: string
    icon: ReactNode
    colorTheme?: 'purple' | 'orange' | 'cyan' | 'pink' | 'green'
}

export interface EvaluationSectionProps {
    title: string
    subtitle: string
    cards: EvaluationCardProps[]
}

export interface AudienceCardProps {
    title: string
    description: string
    icon: ReactNode
    colorTheme?: 'yellow' | 'orange' | 'green' | 'blue' | 'purple'
    position?: 'top-left' | 'top-right' | 'middle-right' | 'bottom-right' | 'bottom-left'
}

export interface AudienceSectionProps {
    title: string
    subtitle: string
    audiences: AudienceCardProps[]
    centerImage?: string
}

export interface CTASectionProps {
    heading: string | ReactNode
    description: string
    buttonText: string
    buttonAction?: () => void
}
