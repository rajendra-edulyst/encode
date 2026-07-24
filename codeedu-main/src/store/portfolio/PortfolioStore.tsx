import { Portfolio } from "@/@types/portfolio";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createExpiringStorage } from '@store/createExpiringStorage';
import { fetchPortfolio } from "@/services/portfolio/PortfolioService";


type PortfolioDetailsState = {
    portfolio: Portfolio | null;
    setPortfolio: (portfolio: Portfolio | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchPortfolioDetails: (userId: string) => Promise<void>;
};

export const usePortfolioDetailsStore = create<PortfolioDetailsState>()(
    persist(
        (set) => ({
            portfolio: null,
            setPortfolio: (portfolio: Portfolio | null) => set({ portfolio }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            fetchPortfolioDetails: async (userId: string) => {
                set({ loading: true, error: null, portfolio: null });
                try {
                    const response = await fetchPortfolio(userId);
                    set({ portfolio: response || null });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    if (error instanceof Error) {
                        console.error('Error fetching portfolio details:', error.message);
                    } else {
                        console.error('Unknown error fetching portfolio details:', error);
                    }
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'user-portfolio-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);