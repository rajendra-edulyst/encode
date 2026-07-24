import { useEffect, useRef, useMemo } from 'react'
import { BsJournalBookmarkFill } from 'react-icons/bs'
import { useInstituteLicensesPlan } from '@/hooks/data/collaborate/useJobs'

interface ChartSegment {
  label: string
  value: number
  color: string
}

interface LicensesChartProps {
  filter?: string
}

export function LicensesChart({ filter = 'yearly' }: LicensesChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { data: licenseStats } = useInstituteLicensesPlan(filter)

  const chartData: ChartSegment[] = useMemo(() => [
    { label: 'Explorer', value: licenseStats?.explorer ?? 0, color: '#00A8E9' },
    { label: 'Builder', value: licenseStats?.builder ?? 0, color: '#E60086' },
    { label: 'Navigator', value: licenseStats?.navigator ?? 0, color: '#7FBC42' },
  ], [licenseStats])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 🔹 Match canvas resolution with CSS size
    const size = 260
    canvas.width = size
    canvas.height = size

    const centerX = size / 2
    const centerY = size / 2
    const radius = 90
    const innerRadius = 55

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Calculate total
    const total = chartData.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = -Math.PI / 2

    // Draw segments
    chartData.forEach((segment) => {
      const sliceAngle = (segment.value / total) * Math.PI * 2

      ctx.beginPath()
      ctx.fillStyle = segment.color
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.arc(
        centerX,
        centerY,
        innerRadius,
        currentAngle + sliceAngle,
        currentAngle,
        true
      )
      ctx.closePath()
      ctx.fill()

      // Draw value labels
      const labelAngle = currentAngle + sliceAngle / 2
      const labelRadius = radius + 24

      const labelX = centerX + Math.cos(labelAngle) * labelRadius
      const labelY = centerY + Math.sin(labelAngle) * labelRadius

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 16px system-ui, -apple-system'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(segment.value.toString(), labelX, labelY)

      currentAngle += sliceAngle
    })

    // Inner circle background
    ctx.beginPath()
    ctx.fillStyle = '#111827'
    ctx.arc(centerX, centerY, innerRadius - 2, 0, Math.PI * 2)
    ctx.fill()
  }, [chartData])

  return (
    <div className="">
      <h2 className="mb-6 text-lg font-semibold text-white">
        Licenses Per Plan
      </h2>

      {/* Chart Container */}
      <div className="flex items-center justify-center mb-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="block"
            style={{ width: 260, height: 260 }}
          />

          {/* Center Icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-lg bg-gray-900 p-3 shadow-lg">
              {/* <BookMarked className="h-7 w-7 text-white" /> */}
              <BsJournalBookmarkFill className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex justify-center gap-6">
        {chartData.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-300">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}