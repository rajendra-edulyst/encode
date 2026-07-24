import React from 'react'
import { AudienceCardProps } from './types'

const AudienceCard: React.FC<AudienceCardProps> = ({
    title,
    description,
    icon,
    colorTheme = 'yellow',
    position = 'top-right'
}) => {
    // Map themes to tailwind colors for text and backgrounds
    const themes = {
        yellow: {
            iconBg: 'bg-[#FFDE00]',
            iconColor: 'text-black',
            titleColor: 'text-[#FFDE00]'
        },
        orange: {
            iconBg: 'bg-[#FFA500]',
            iconColor: 'text-white',
            titleColor: 'text-[#FFA500]'
        },
        green: {
            iconBg: 'bg-[#39FF14]',
            iconColor: 'text-black',
            titleColor: 'text-[#39FF14]'
        },
        blue: {
            iconBg: 'bg-[#00BFFF]',
            iconColor: 'text-black',
            titleColor: 'text-[#00BFFF]'
        },
        purple: {
            iconBg: 'bg-[#8A2BE2]',
            iconColor: 'text-white',
            titleColor: 'text-[#8A2BE2]'
        }
    }

    const theme = themes[colorTheme]

    // Simplified layout for the list view inside the AudienceSection
    return (
        <div className="flex flex-col sm:flex-row items-center gap-6 max-w-lg w-full relative">
            <div className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(0,0,0,0.4)] ${theme.iconBg}`}>
                <div className={`w-10 h-10 ${theme.iconColor}`}>
                    {icon}
                </div>
                {/* Speech bubble tail pointing left */}
                <div className={`absolute top-1/2 -translate-y-1/2 -left-2 w-6 h-6 rotate-45 rounded-sm z-0 ${theme.iconBg}`} />
            </div>
            
            <div className="flex flex-col gap-2">
                <h3 className={`text-2xl font-bold ${theme.titleColor}`}>
                    {title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default AudienceCard
