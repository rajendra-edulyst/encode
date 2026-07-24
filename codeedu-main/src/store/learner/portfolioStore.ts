import { UserPortfolio } from '@/@types/learner/portfolio';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PortfolioState = {
    portfolio: UserPortfolio;
    setPortfolio: (portfolio: UserPortfolio) => void;
    error: string | null;
    setError: (error: string | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    reset: () => void;
};

export const usePortfolioStore = create<PortfolioState>()(
    persist(
        (set) => ({
            portfolio: {} as UserPortfolio,
            setPortfolio: (portfolio: UserPortfolio) => set({ portfolio, error: null }),
            error: null,
            setError: (error: string | null) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            reset: () => set({
                portfolio: {} as UserPortfolio,
                error: null,
                loading: false
            }),
        }),
        {
            name: 'portfolio',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);

