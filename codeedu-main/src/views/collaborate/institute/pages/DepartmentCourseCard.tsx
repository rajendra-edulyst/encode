

import React, { useEffect, useRef } from "react"

/* eslint-disable react-hooks/exhaustive-deps */

import { BsJournalBookmarkFill } from 'react-icons/bs'

interface DepartmentCourseProps {
    name: string
    hod: string
    totalCourses: number
    distribution: {
        selfPaced: number
        liveOnline: number
        inClass: number
        // certifications: number
    }
    onClick?: () => void
}

const CHART_COLORS = {
    selfPaced: '#00A8E9',
    liveOnline: '#E60086',
    inClass: '#7FBC42',
    // certifications: '#FFEC00',
}

interface ChartSegment {
    label: string
    value: number
    color: string
}

const DepartmentCourseCard: React.FC<DepartmentCourseProps> = ({
    name,
    hod,
    totalCourses,
    distribution,
    onClick,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const chartData: ChartSegment[] = [
        { label: 'Self-Paced', value: distribution.selfPaced, color: CHART_COLORS.selfPaced },
        { label: 'Live Online', value: distribution.liveOnline, color: CHART_COLORS.liveOnline },
        { label: 'In Class', value: distribution.inClass, color: CHART_COLORS.inClass },
        // { label: 'Others', value: distribution.certifications, color: CHART_COLORS.certifications },
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

        const total = distribution.selfPaced + distribution.liveOnline + distribution.inClass
        // + distribution.certifications
        let currentAngle = -Math.PI / 2

        // Draw segments with rounded caps
        chartData.forEach((segment) => {
            if (!segment.value) return

            const sliceAngle = (segment.value / total) * Math.PI * 2
            const startAngle = currentAngle
            const endAngle = currentAngle + sliceAngle

            // Draw the donut slice with line cap for rounded ends
            ctx.strokeStyle = segment.color
            ctx.fillStyle = segment.color
            ctx.lineWidth = lineWidth
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'

            // Draw arc stroke (creates the donut segment with rounded caps)
            const arcRadius = (radius + innerRadius) / 2
            ctx.beginPath()
            ctx.arc(centerX, centerY, arcRadius, startAngle, endAngle, false)
            ctx.stroke()

            // Draw start and end position numbers
            const labelDistance = 125

            // Start position number
            const startX = centerX + Math.cos(startAngle) * labelDistance
            const startY = centerY + Math.sin(startAngle) * labelDistance

            ctx.fillStyle = '#ffffff'
            ctx.font = 'bold 11px system-ui, -apple-system, sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(segment.value.toString(), startX, startY)

            currentAngle = endAngle
        })

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
        ctx.fillText('Total Courses', centerX, centerY + 16)
    }, [distribution])

    return (
        <div
            className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-lime-400 transition-all cursor-pointer flex flex-col"
            onClick={onClick}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    <BsJournalBookmarkFill className="w-6 h-6 text-white" />

                </div>
                <div className="flex-1 min-h-[4.5rem] flex flex-col justify-center">
                    <h3 className="text-lg font-bold line-clamp-2 text-white leading-tight">{name}</h3>
                    <p className="text-sm text-gray-400">HOD- {hod}</p>
                </div>
            </div>

            {/* Chart */}
            <div className="flex justify-center mb-6 mt-auto">
                <canvas ref={canvasRef} className="w-[280px] h-[280px]" />
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-y-2 text-sm">
                {chartData.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-300">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DepartmentCourseCard

