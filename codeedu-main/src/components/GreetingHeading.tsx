import React, { useEffect, useState } from 'react'

const GreetingHeading: React.FC = () => {
    const [now, setNow] = useState<Date>(new Date())

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 60 * 1000)
        return () => clearInterval(t)
    }, [])

    const hour = now.getHours()

    let greeting = 'Good Morning'
    let title = 'Creator'

    if (hour >= 6 && hour < 13) {
        greeting = 'Good Morning'
        title = 'Creator'
    } else if (hour >= 13 && hour < 18) {
        greeting = 'Midday Muse'
        title = 'Check'
    } else if (hour >= 18 && hour < 22) {
        greeting = 'Good Evening'
        title = 'Thinker'
    } else {
        greeting = "It's a pioneer night, time to create tomorrow"
        title = ''
    }

    return (
        <h1 className="font-jacques font-bold text-white flex flex-wrap items-baseline gap-x-3">
            <span className="text-3xl md:text-4xl lg:text-[40px] 2xl:text-[48px] whitespace-nowrap">
                {greeting}{title ? ',' : ''}
            </span>
            {title && (
                <span className="font-creative text-codeyellow text-[44px] md:text-6xl lg:text-[56px] 2xl:text-[64px] leading-none">
                    {title}
                </span>
            )}
        </h1>
    )
}

export default GreetingHeading
