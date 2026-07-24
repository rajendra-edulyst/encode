import React, { memo, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '@/hooks/data/useSettings';

const AnimatedStats: React.FC = () => {
    const [index, setIndex] = useState(0);


    const { data: settings } = useSettings();
    const { organization_partner_count } = settings?.configuration || {};

    const stats = organization_partner_count?.map((item) => ({
        value: item.count,
        title: item.title,
        subtitle: ''
    })) || [];

    useEffect(() => {
        const t = setInterval(() => setIndex((i) => (i + 1) % stats.length), 3500)
        return () => clearInterval(t)
    }, [stats?.length])

    return (
        <div className="relative w-full min-h-[400px] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{
                        duration: 0.8,
                        ease: [0.43, 0.13, 0.23, 0.96]
                    }}
                    className="w-full flex flex-col items-center justify-center space-y-10"
                >
                    <div className='flex items-center gap-5'>
                        <div className="text-4xl md:text-4xl font-bold text-white">{stats[index]?.value}</div>
                        <div className="text-lg text-[#868686]">{stats[index]?.title} <br /> {stats[index]?.subtitle}</div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default memo(AnimatedStats);
