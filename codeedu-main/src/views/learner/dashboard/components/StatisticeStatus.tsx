import React from 'react'

interface StatisticStatusProps {
    isEnrolled?: null | number;
}

const StatisticStatus: React.FC<StatisticStatusProps> = ({ isEnrolled }) => {

    if (!isEnrolled) {
        return (
            <div className="bg-white dark:bg-gray-900 p-3 rounded-lg col-span-12 border">
                <h1 className='capitalize text-sm font-normal'>
                    {`You've`} taken the first step—now {`let's`} unlock your full potential and grow together!
                </h1>
            </div>
        );
    }

    return (
        isEnrolled && <div className="bg-white dark:bg-gray-900 p-3 rounded-lg col-span-12 border">
            {
                isEnrolled > 0 && <h1 className='capitalize text-sm font-normal'>
                    Great job on your progress so far—keep up the hard work and continue growing to reach new heights!
                </h1>
            }
        </div>
    )
}

export default StatisticStatus