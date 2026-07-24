import React from 'react'
import { GrowthSectionProps } from './types'

const GrowthSection: React.FC<GrowthSectionProps> = ({
    text,
    highlightText,
    subText
}) => {
    // Generate a background pattern of "CCI" text
    const patternItems = Array.from({ length: 40 })

    return (
        <section className="w-full bg-[#1c1c1c] py-8 px-4 border-y-2 border-gray-900 relative overflow-hidden z-10 shadow-2xl">
            {/* Background pattern */}
            <div className="absolute inset-0 flex flex-wrap items-center justify-around gap-12 opacity-[0.03] pointer-events-none select-none scale-150 rotate-[-5deg]">
                {patternItems.map((_, i) => (
                    <span key={i} className="text-4xl sm:text-4xl font-serif text-white whitespace-nowrap">
                        CCIQ
                    </span>
                ))}
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-20 flex flex-col items-center gap-4">
                <p className="text-3xl sm:text-4xl lg:text-5xl text-white font-light tracking-wide">
                    {text}
                </p>
                <p className="text-xl sm:text-4xl text-gray-200 font-light mt-2">
                    {subText.split(highlightText)[0]}
                    <span className="text-[#FFDE00] font-medium">{highlightText}</span>
                    {subText.split(highlightText)[1]}
                </p>
            </div>
        </section>
    )
}

export default GrowthSection
