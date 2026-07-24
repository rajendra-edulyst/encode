import React, { useEffect, useRef } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useOpinionPolls } from "@/hooks/data/create/useCourses"
import { cn } from "@/lib/utils"

interface OpinionPollProgressProps {
    className?: string;
    onClick?: () => void;
    timeFilter?: string;
}

const CHART_COLORS = {
    accessed: '#E60086',
    available: '#7FBC42',
    total: '#374151',
}

interface ChartSegment {
    label: string
    value: number
    color: string
}

export function OpinionPollProgress({ className, onClick, timeFilter = 'yearly' }: OpinionPollProgressProps) {
    const { data: opinionPolls, isLoading } = useOpinionPolls(timeFilter);
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const accessed = opinionPolls?.accessed_opinion_polls || 0;
    const available = opinionPolls?.available_opinion_polls || 0;
    const total = opinionPolls?.total_opinion_polls || 0;

    // Calculate percentage for radial chart (0-100)
    const accessedPercentage = total > 0 ? (accessed / total) * 100 : 0;
    const availablePercentage = total > 0 ? (available / total) * 100 : 0;

    const chartData: ChartSegment[] = [
        { label: 'Accessed', value: accessed, color: CHART_COLORS.accessed },
        { label: 'Available', value: available, color: CHART_COLORS.available },
    ]

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const size = 280
        canvas.width = size
        canvas.height = size

        const centerX = size / 2
        const centerY = size / 2
        const radius = 90
        const innerRadius = 65
        const lineWidth = radius - innerRadius

        ctx.clearRect(0, 0, size, size)

        // If there's no data, draw empty state
        if (total === 0) {
            // Draw gray background circle
            ctx.strokeStyle = CHART_COLORS.total
            ctx.lineWidth = lineWidth
            ctx.lineCap = 'round'
            ctx.beginPath()
            ctx.arc(centerX, centerY, (radius + innerRadius) / 2, 0, Math.PI * 2, false)
            ctx.stroke()

            // Inner dark circle
            ctx.beginPath()
            ctx.fillStyle = '#111827'
            ctx.arc(centerX, centerY, innerRadius - 3, 0, Math.PI * 2)
            ctx.fill()

            // Center value
            ctx.fillStyle = '#ffffff'
            ctx.font = 'bold 28px system-ui, -apple-system, sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText('0', centerX, centerY - 6)

            ctx.fillStyle = '#9CA3AF'
            ctx.font = '11px system-ui, -apple-system, sans-serif'
            ctx.fillText('Total Opinion Polls', centerX, centerY + 16)
            return
        }

        let currentAngle = -Math.PI / 2

        // Draw accessed segment
        if (accessed > 0) {
            const sliceAngle = (accessedPercentage / 100) * Math.PI * 2
            const startAngle = currentAngle
            const endAngle = currentAngle + sliceAngle

            ctx.strokeStyle = CHART_COLORS.accessed
            ctx.lineWidth = lineWidth
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'

            const arcRadius = (radius + innerRadius) / 2
            ctx.beginPath()
            ctx.arc(centerX, centerY, arcRadius, startAngle, endAngle, false)
            ctx.stroke()

            // Draw accessed value at end of segment
            const labelDistance = 125
            const endX = centerX + Math.cos(endAngle) * labelDistance
            const endY = centerY + Math.sin(endAngle) * labelDistance

            // Add dark background for better visibility
            ctx.fillStyle = '#111827'
            ctx.beginPath()
            ctx.arc(endX, endY, 10, 0, Math.PI * 2)
            ctx.fill()

            ctx.fillStyle = '#ffffff'
            ctx.font = 'bold 10px system-ui, -apple-system, sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(accessed.toString(), endX, endY)

            currentAngle = endAngle
        }

        // Draw available segment
        if (available > 0) {
            const sliceAngle = (availablePercentage / 100) * Math.PI * 2
            const startAngle = currentAngle
            const endAngle = currentAngle + sliceAngle

            ctx.strokeStyle = CHART_COLORS.available
            ctx.lineWidth = lineWidth
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'

            const arcRadius = (radius + innerRadius) / 2
            ctx.beginPath()
            ctx.arc(centerX, centerY, arcRadius, startAngle, endAngle, false)
            ctx.stroke()

            // Draw available value at end of segment
            const labelDistance = 125
            const endX = centerX + Math.cos(endAngle) * labelDistance
            const endY = centerY + Math.sin(endAngle) * labelDistance

            // Add dark background for better visibility
            ctx.fillStyle = '#111827'
            ctx.beginPath()
            ctx.arc(endX, endY, 10, 0, Math.PI * 2)
            ctx.fill()

            ctx.fillStyle = '#ffffff'
            ctx.font = 'bold 10px system-ui, -apple-system, sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(available.toString(), endX, endY)
        }

        // Draw remaining segment (if any)
        const remainingPercentage = 100 - accessedPercentage - availablePercentage
        if (remainingPercentage > 0) {
            const sliceAngle = (remainingPercentage / 100) * Math.PI * 2
            const startAngle = currentAngle + (available > 0 ? (availablePercentage / 100) * Math.PI * 2 : 0)
            const endAngle = startAngle + sliceAngle

            ctx.strokeStyle = CHART_COLORS.total
            ctx.lineWidth = lineWidth
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'

            const arcRadius = (radius + innerRadius) / 2
            ctx.beginPath()
            ctx.arc(centerX, centerY, arcRadius, startAngle, endAngle, false)
            ctx.stroke()
        }

        // Inner dark circle
        ctx.beginPath()
        ctx.fillStyle = '#111827'
        ctx.arc(centerX, centerY, innerRadius - 3, 0, Math.PI * 2)
        ctx.fill()

        // Center value
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 28px system-ui, -apple-system, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(total.toString(), centerX, centerY - 6)

        ctx.fillStyle = '#9CA3AF'
        ctx.font = '11px system-ui, -apple-system, sans-serif'
        ctx.fillText('Total Opinion Polls', centerX, centerY + 16)
    }, [accessed, available, total, accessedPercentage, availablePercentage])

    if (isLoading) {
        return (
            <Card className={cn(
                "bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700",
                className
            )}>
                <CardHeader className="items-start pb-0">
                    <div className="flex items-center gap-3 mb-4">
                        <div>
                            <CardTitle className="dark:text-white text-lg font-bold">Opinion Polls</CardTitle>
                            <CardDescription className="text-gray-400 text-sm">
                                Loading...
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[280px]">
                    <div className="text-gray-400">Loading chart...</div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card
            className={cn(
                "bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 hover:border-purple-400 transition-all cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            <CardHeader className="items-start pb-0">
                <div className="flex items-center gap-3 mb-4">
                    <div>
                        <CardTitle className="dark:text-white text-lg font-bold">
                            Opinion Polls
                        </CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                            Accessed: {accessed} | Available: {available}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                <div className="flex justify-center">
                    <canvas ref={canvasRef} className="w-[280px] h-[280px]" />
                </div>
            </CardContent>

            <CardFooter className="pt-0">
                <div className="flex justify-center gap-8 w-full">
                    {chartData.map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-gray-300 text-sm whitespace-nowrap">{item.label}</span>
                        </div>
                    ))}
                </div>
            </CardFooter>
        </Card>
    )
}