import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useUserProfile } from '@/hooks/data/useGettingStarted';
import { useAuth } from '@/auth';

dayjs.extend(duration);

interface CCIContextType {
    timeLeft: string;
    secondsLeft: number;
    formatTime: (seconds: number) => string;
}

const CCIContext = createContext<CCIContextType | undefined>(undefined);

export const CCIProvider = ({ children }: { children: ReactNode }) => {
    const { authenticated } = useAuth();
    const { data: userProfile } = useUserProfile(authenticated);
    const [timeLeft, setTimeLeft] = useState<string>("00:00:00");
    const [secondsLeft, setSecondsLeft] = useState<number>(0);

    const cciStartDate = userProfile?.cci_start_date;

    useEffect(() => {
        if (!cciStartDate) return;

        const targetDate = dayjs(cciStartDate).add(2, 'day');

        const updateTimer = () => {
            const now = dayjs();
            const diff = targetDate.diff(now);

            if (diff <= 0) {
                setTimeLeft("00:00:00");
                setSecondsLeft(0);
            } else {
                const dur = dayjs.duration(diff);
                const hours = Math.floor(dur.asHours());
                const minutes = dur.minutes();
                const seconds = dur.seconds();

                setTimeLeft(
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                );
                setSecondsLeft(Math.floor(diff / 1000));
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);

        return () => clearInterval(timer);
    }, [cciStartDate]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    return (
        <CCIContext.Provider value={{ timeLeft, secondsLeft, formatTime }}>
            {children}
        </CCIContext.Provider>
    );
};

export const useCCITimer = () => {
    const context = useContext(CCIContext);
    if (context === undefined) {
        throw new Error('useCCITimer must be used within a CCIProvider');
    }
    return context;
};
