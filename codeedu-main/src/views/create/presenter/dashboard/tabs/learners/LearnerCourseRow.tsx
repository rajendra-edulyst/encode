type Props = {
    title: string
    learners: number
    avgProgress: number
    active: number
    completed: number
    avgGrade: string
}

const LearnerCourseRow = ({
    title,
    learners,
    avgProgress,
    active,
    completed,
    avgGrade,
}: Props) => {
    return (
        <div className="bg-[#1c1c1c] border border-white/5 rounded-xl p-4 hover:border-blue-400 transition-all cursor-pointer">
            {/* Top Row */}
            <div className="mb-4">
                <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
                <p className="text-xs text-gray-500">{learners} Students Enrolled</p>
            </div>

            {/* Progress */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-1 text-[10px]">
                    <span className="text-gray-400 font-medium">Avg Progress</span>
                    <span className="text-white font-medium">{avgProgress}%</span>
                </div>
                <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${avgProgress}%` }}
                    />
                </div>
            </div>

            {/* Stats Badges */}
            <div className="flex gap-2">
                <div className="flex-1 bg-cyan-500 rounded-md py-1.5 text-center">
                    <div className="text-white text-xs font-bold leading-tight">{active}</div>
                    <div className="text-[8px] text-white">Active</div>
                </div>
                <div className="flex-1 bg-green-500 rounded-md py-1.5 text-center">
                    <div className="text-white text-xs font-bold leading-tight">{completed}</div>
                    <div className="text-[8px] text-white">Completed</div>
                </div>
                <div className="flex-1 bg-pink-500 rounded-md py-1.5 text-center">
                    <div className="text-white text-xs font-bold leading-tight">{avgGrade}</div>
                    <div className="text-[8px] text-white">Avg Grade</div>
                </div>
            </div>
        </div>
    )
}

export default LearnerCourseRow
