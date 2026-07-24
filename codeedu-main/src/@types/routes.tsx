import { LayoutType, Theme } from './theme'
import type { LazyExoticComponent, ReactNode, ComponentType } from 'react'

export type PageHeaderProps = {
    title?: string | ReactNode | LazyExoticComponent<() => JSX.Element>
    description?: string | ReactNode
    contained?: boolean
    extraHeader?: string | ReactNode | LazyExoticComponent<() => JSX.Element>
}

export interface Meta {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    pageBackgroundType?: 'default' | 'plain'
    header?: PageHeaderProps
    footer?: boolean
    layout?: LayoutType
}

export type Route = {
    key: string
    path: string
    component: LazyExoticComponent<ComponentType<any>>
    authority: string[]
    meta?: Meta
    groups?: Theme['groups']
    sideNavCollapse?: boolean
}

export type Routes = Route[]
