import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star } from "lucide-react"

type Props = {
  title: string
  learners: number
  rating: number
  completion: number
}

const CourseProgressRow = ({
  title,
  learners,
  rating,
  completion,
}: Props) => {
  return (
    <Card className="bg-[#2c2c30] border border-[#3f3f46] shadow-none rounded-xl p-4 py-4 flex flex-col gap-0">
      {/* Top Row */}
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-white font-semibold text-lg leading-snug tracking-tight">{title}</h3>
        <span className="text-[#00e676] font-semibold text-xl leading-none tabular-nums">
          {completion}%
        </span>
      </div>

      {/* Subtitle */}
      <div className="flex items-center gap-3 text-xs text-zinc-500 mb-2.5">
        <span>{learners} learners</span>
        <div className="flex items-center gap-1 text-[#ffb300]">
          <Star className="w-3 h-3 fill-current" />
          <span className="font-medium">{rating}</span>
        </div>
      </div>

      {/* Progress Bar — thin track (reference ~4–6px) */}
      <Progress
        value={completion}
        className="h-1 bg-[#45454d] rounded-full"
        indicatorClassName="bg-[#00e676] rounded-full"
      />
    </Card>
  )
}

export default CourseProgressRow
