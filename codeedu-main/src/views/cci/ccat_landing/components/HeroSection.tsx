import React from 'react'
import { HeroSectionProps } from './types'
import Button from './Button'
import { HiArrowUpRight } from 'react-icons/hi2'
import BackgroundRibbon from './BackgroundRibbon'

const HeroSection: React.FC<HeroSectionProps> = ({
    title,
    subtitle,
    buttonText,
    buttonAction,
    image
}) => {
    return (
        <section className="relative w-full min-h-[600px] flex items-center justify-center pt-20 pb-16 px-4 md:px-10 2xl:px-20 overflow-hidden bg-black">
            <BackgroundRibbon className="absolute inset-0 w-[130%] h-[130%] left-0 top-[15%] -rotate-[15deg] z-0 opacity-90" />
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-end z-10">
                <div className="flex flex-col items-start gap-6 max-w-3xl pb-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                        {title}
                    </h1>
                    <p className="text-lg text-gray-300">
                        {subtitle}
                    </p>
                    <div className="mt-8">
                        <Button 
                            text={buttonText} 
                            onClick={buttonAction} 
                            icon={<HiArrowUpRight className="w-6 h-6" />} 
                            className="px-8 py-4 text-lg lg:px-10 lg:py-5 lg:text-xl"
                        />
                    </div>
                </div>
                <div className="relative w-full flex justify-center lg:justify-start lg:-ml-8 xl:-ml-16">
                    <img 
                        src={image} 
                        alt="CCAT Hero Illustration" 
                        className="w-full max-w-[650px] lg:max-w-[750px] xl:max-w-[850px] h-auto object-contain"
                    />
                </div>
            </div>
            
            {/* Background elements if any passed or static for hero */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
                {/* Abstract ribbons or gradients can be positioned here */}
            </div>
        </section>
    )
}

export default HeroSection
