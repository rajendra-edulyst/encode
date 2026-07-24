import React from 'react'
import { CTASectionProps } from './types'
import Button from './Button'
import { HiArrowUpRight } from 'react-icons/hi2'

const CTASection: React.FC<CTASectionProps> = ({
    heading,
    description,
    buttonText,
    buttonAction
}) => {
    return (
        <section className="w-full py-24 px-4 md:px-10 2xl:px-20 relative z-10">
<div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-start gap-12 lg:gap-24 relative z-10">                <div className="self-start flex-shrink-0">
    <Button
        text={buttonText}
        onClick={buttonAction}
        icon={<HiArrowUpRight className="w-6 h-6" />}
        className="text-lg px-14 py-5"
    />
</div>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    {heading}
                </h2>
            </div>
        </section>
    )
}

export default CTASection
