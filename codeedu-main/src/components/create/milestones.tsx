import { CheckCircle } from 'lucide-react'
import { useMilestones } from '@/hooks/data/create/useCourses'

interface MilestonesProps {
    timeFilter?: string;
}

const Milestones = ({ timeFilter = 'yearly' }: MilestonesProps) => {
    const { data: milestonesData, isLoading } = useMilestones(timeFilter)

    const milestones = milestonesData?.milestones || []

    return (
        <div className="xl:col-span-1">
            <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-6 border border-gray-300 dark:border-gray-800">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-black dark:text-white">
                        Milestones
                    </h3>
                </div>

                {isLoading ? (
                    <div className="h-48 flex items-center justify-center text-gray-400">
                        Loading...
                    </div>
                ) : milestones.length === 0 ? (
                    <div className="h-48 flex items-center justify-center text-gray-400">
                        No milestones found for the selected time period
                    </div>
                ) : (
                    <div className="space-y-4">
                        {milestones.map((milestone, index) => {
                            const isLast = index === milestones.length - 1

                            return (
                                <div key={index} className="relative">
                                    {!isLast && (
                                        <div className="absolute left-5 top-16 w-0.5 h-16 bg-gray-300 dark:bg-gray-700" />
                                    )}

                                    <div className="flex gap-4">
                                        <div className="relative z-10 w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-gray-300 dark:border-gray-900 bg-lime-500">
                                            <CheckCircle size={20} className="text-white dark:text-gray-900" />
                                        </div>

                                        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between border border-gray-300 dark:border-gray-800">
                                            <div>
                                                <h4 className="font-semibold text-gray-800 dark:text-white text-base mb-1">
                                                    {milestone.title}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {milestone.description}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {milestone.date}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Milestones