import React from "react"
import { cn } from "@/lib/utils"

type StatCardProps = {
  title: string
  value: number | string
  className?: string
}

const CourseStatCard = ({ title, value, className }: StatCardProps) => {
  return (
    <div className={cn("bg-[#1c1c1c] text-white p-5 rounded-xl border border-[#2a2a2a] flex flex-col justify-between shadow-sm", className)}>
      <p className="text-[#E6E6E6] text-sm font-medium mb-2">{title}</p>

      <div className="flex justify-between items-end">
        <h2 className="text-4xl font-semibold leading-none tracking-tight">{value}</h2>
      </div>
    </div>
  )
}

export default CourseStatCard

