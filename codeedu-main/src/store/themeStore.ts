import { themeConfig } from '@/configs/theme.config'
import { create } from 'zustand'
import type { Theme, LayoutType, Direction } from '@/@types/theme'
import { persist, createJSONStorage } from 'zustand/middleware'

type ThemeState = Theme

type ThemeAction = {
    setSchema: (payload: string) => void
    setMode: (payload: ThemeState['mode']) => void
    setSideNavCollapse: (payload: boolean) => void
    setDirection: (payload: Direction) => void
    setPanelExpand: (payload: boolean) => void
    setLayout: (payload: LayoutType) => void
    setPreviousLayout: (payload: LayoutType | '') => void
    setGroup: (payload: string) => void
    setLoginProfile: (payload: string) => void
    toggleMode: () => void
}

const inititialThemeState = themeConfig

export const useThemeStore = create<ThemeState & ThemeAction>()(
    persist((set) => ({
        ...inititialThemeState,
        setSchema: (payload) => set(() => ({ themeSchema: payload })),
        setMode: (payload) => set(() => ({ mode: payload })),
        setSideNavCollapse: (payload) =>
            set((state) => ({
                layout: { ...state.layout, sideNavCollapse: payload },
            })),
        setDirection: (payload) => set(() => ({ direction: payload })),
        setPanelExpand: (payload) => set(() => ({ panelExpand: payload })),
        setLayout: (payload) =>
            set((state) => ({
                layout: { ...state.layout, type: payload },
            })),
        setPreviousLayout: (payload) =>
            set((state) => ({
                layout: { ...state.layout, previousType: payload },
            })),
        setGroup: (payload) => set(() => ({ group: payload })),
        setLoginProfile: (payload) => set(() => ({ loginProfile: payload })),
        toggleMode: () => set((state) => ({
            mode: state.mode === 'light' ? 'dark' : 'light',
        })),
    }), { name: 'themeStore', storage: createJSONStorage(() => localStorage) },
    )
)