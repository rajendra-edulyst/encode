import React from 'react'
import { EvaluationSectionProps } from './types'
import EvaluationCard from './EvaluationCard'
import BackgroundRibbon from './BackgroundRibbon'

const EvaluationSection: React.FC<EvaluationSectionProps> = ({
    title,
    subtitle,
    cards
}) => {
    return (
        <section className="w-full bg-black py-24 px-4 md:px-10 2xl:px-20 relative overflow-hidden">
            <BackgroundRibbon className="absolute -top-[25%] -left-[60%] w-[150%] h-[100%] -rotate-[50deg] z-0 opacity-80" />
            <div className="w-full flex flex-col items-start relative z-10">
                <div className="text-left mb-16 max-w-3xl">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                        {title}
                    </h2>
                    <p className="text-gray-300 text-xl sm:text-2xl font-light mt-6">
                        {subtitle}
                    </p>
                </div>
                
                <div className="w-full flex flex-wrap justify-center gap-x-8 gap-y-12 lg:gap-x-12 lg:gap-y-16">
                    {cards.map((card, index) => (
                        <div key={index} className="w-full sm:w-[calc(50%-1rem)] xl:w-[calc(33.333%-2rem)] flex justify-center">
                            <EvaluationCard {...card} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default EvaluationSection
