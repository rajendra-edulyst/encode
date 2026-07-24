import React, { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCertificationSummary } from "@/hooks/data/create/useCourses"
import { cn } from "@/lib/utils"
import certificateBadge from "@/assets/icons/svg/certificate_badge.svg"
import { Skeleton } from "@/components/ui/skeleton"

interface CertificateProgressProps {
    className?: string;
    onClick?: () => void;
    timeFilter?: string;
}

const CHART_COLORS = {
    earned: '#00A8E9',
    pending: '#FFEC00',
    total: '#374151',
}

interface ChartSegment {
    label: string
    value: number
    color: string
}

export function CertificateProgress({ className, onClick, timeFilter = 'yearly' }: CertificateProgressProps) {
    const { data: certificateProgress, isLoading } = useCertificationSummary(timeFilter);
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const navigate = useNavigate()

    const earned = certificateProgress?.earned_certifications || 0;
    const pending = certificateProgress?.pending_certifications || 0;
    const total = certificateProgress?.total_certifications || 0;

    // Calculate percentage for radial chart (0-100)
    const earnedPercentage = total > 0 ? (earned / total) * 100 : 0;
    const pendingPercentage = total > 0 ? (pending / total) * 100 : 0;

    const chartData: ChartSegment[] = [
        { label: 'Earned', value: earned, color: CHART_COLORS.earned },
        { label: 'Pending', value: pending, color: CHART_COLORS.pending },
    ]

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate('/dashboard/learner?tab=certifications');
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const size = 320
        canvas.width = size
        canvas.height = size

        const centerX = size / 2
        const centerY = size / 2
        const radius = 100
        const innerRadius = 70
        const lineWidth = radius - innerRadius

        ctx.clearRect(0, 0, size, size)

        // If there's no data, draw empty state
        if (total === 0) {
            ctx.strokeStyle = CHART_COLORS.total
            ctx.lineWidth = lineWidth
            ctx.lineCap = 'round'
            ctx.beginPath()
            ctx.arc(centerX, centerY, (radius + innerRadius) / 2, 0, Math.PI * 2, false)
            ctx.stroke()
            return
        }

        let currentAngle = -Math.PI / 2

        // Draw pending segment (yellow) FIRST so it starts from top
        if (pending > 0) {
            const sliceAngle = (pendingPercentage / 100) * Math.PI * 2
            const startAngle = currentAngle
            const endAngle = currentAngle + sliceAngle

            ctx.strokeStyle = CHART_COLORS.pending
            ctx.lineWidth = lineWidth
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'

            const arcRadius = (radius + innerRadius) / 2
            ctx.beginPath()
            ctx.arc(centerX, centerY, arcRadius, startAngle, endAngle, false)
            ctx.stroke()

            // Draw pending value at the middle of its arc
            const midAngle = startAngle + sliceAngle / 2
            const textRadius = radius + 35
            const textX = centerX + Math.cos(midAngle) * textRadius
            const textY = centerY + Math.sin(midAngle) * textRadius

            // Add dark background for better visibility
            ctx.fillStyle = '#111827'
            ctx.beginPath()
            ctx.arc(textX, textY, 10, 0, Math.PI * 2)
            ctx.fill()

            ctx.fillStyle = '#ffffff'
            ctx.font = '20px "Jacques Pro", system-ui, sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(pending.toString(), textX, textY)

            currentAngle = endAngle
        }

        // Draw earned segment (blue) SECOND
        if (earned > 0) {
            const sliceAngle = (earnedPercentage / 100) * Math.PI * 2
            const startAngle = currentAngle
            const endAngle = currentAngle + sliceAngle

            ctx.strokeStyle = CHART_COLORS.earned
            ctx.lineWidth = lineWidth
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'

            const arcRadius = (radius + innerRadius) / 2
            ctx.beginPath()
            ctx.arc(centerX, centerY, arcRadius, startAngle, endAngle, false)
            ctx.stroke()

            // Draw earned value at the middle of its arc
            const midAngle = startAngle + sliceAngle / 2
            const textRadius = radius + 35
            const textX = centerX + Math.cos(midAngle) * textRadius
            const textY = centerY + Math.sin(midAngle) * textRadius

            ctx.fillStyle = '#ffffff'
            ctx.font = '20px "Jacques Pro", system-ui, sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(earned.toString(), textX, textY)
        }

    }, [earned, pending, total, earnedPercentage, pendingPercentage])

    if (isLoading) {
        return (
            <Card className={cn(
                "bg-[#1D1D1D] rounded-3xl border-none",
                className
            )}>
                <CardHeader className="items-start pb-0 px-6 pt-5">
                    <div className="flex flex-col gap-1 mb-0">
                        <Skeleton className="h-8 w-40 bg-gray-700/50" />
                        <Skeleton className="h-4 w-32 bg-gray-700/50" />
                    </div>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[320px] relative">
                    <Skeleton className="w-[280px] h-[280px] rounded-full bg-gray-700/50" />
                </CardContent>
                <CardFooter className="pt-0 pb-6 px-6">
                    <div className="flex justify-end gap-6 w-full">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-3 w-3 rounded-full bg-gray-700/50" />
                            <Skeleton className="h-5 w-16 bg-gray-700/50" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-3 w-3 rounded-full bg-gray-700/50" />
                            <Skeleton className="h-5 w-16 bg-gray-700/50" />
                        </div>
                    </div>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card
            className={cn(
                "bg-[#1D1D1D] rounded-3xl border-none hover:ring-1 hover:ring-lime-400 transition-all cursor-pointer",
                className
            )}
            onClick={handleClick}
        >
            <CardHeader className="items-start pb-0 px-6 pt-5">
                <div className="flex flex-col gap-1 mb-0">
                    <CardTitle className="text-white text-[22px] font-['Jacques_Pro'] font-bold">
                        Certifications
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm font-['Jacques_Pro']">
                        Total Certification: {total}
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="flex-1 pb-0 relative">
                <div className="flex justify-center">
                    <canvas ref={canvasRef} className="w-[320px] h-[320px]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-2">
                    <img src={certificateBadge} alt="Badge" className="w-12 h-12" />
                </div>
            </CardContent>

            <CardFooter className="pt-0 pb-6 px-6">
                <div className="flex justify-end gap-6 w-full">
                    {chartData.map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-white text-base font-['Jacques_Pro'] font-medium whitespace-nowrap">{item.label}</span>
                        </div>
                    ))}
                </div>
            </CardFooter>
        </Card>
    )
}