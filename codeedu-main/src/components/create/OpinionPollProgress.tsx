import React, { useEffect, useRef, useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useOpinionPolls } from "@/hooks/data/create/useCourses"
import { usePollAttemptedSurvey } from "@/views/common/____community/@hooks/usePost"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2, Calendar, History } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SurveyItem } from "@/views/common/____community/types/survey"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

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
    const [activeFilter, setActiveFilter] = useState(timeFilter);
    const { data: opinionPolls, isLoading } = useOpinionPolls(activeFilter);
    const { data: pollHistory, isLoading: isLoadingHistory } = usePollAttemptedSurvey(activeFilter);
    useEffect(() => {
        setActiveFilter(timeFilter);
    }, [timeFilter]);
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

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
            // Draw gray background circle
            ctx.strokeStyle = CHART_COLORS.total
            ctx.lineWidth = lineWidth
            ctx.lineCap = 'round'
            ctx.beginPath()
            ctx.arc(centerX, centerY, (radius + innerRadius) / 2, 0, Math.PI * 2, false)
            ctx.stroke()

            // Center value
            ctx.fillStyle = '#ffffff'
            ctx.font = 'bold 36px "Jacques Pro", system-ui, sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText('0', centerX, centerY - 10)

            ctx.font = '16px "Jacques Pro", system-ui, sans-serif'
            ctx.fillText('Opinion Polls', centerX, centerY + 20)
            return
        }

        let currentAngle = -Math.PI / 2

        // Draw accessed segment (pink)
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

            currentAngle = endAngle
        }

        // Draw available segment (green)
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
        }

        // Center total value
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 36px "Jacques Pro", system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(total.toString(), centerX, centerY - 10)

        // Center subtitle
        ctx.font = 'normal 18px "Jacques Pro", system-ui, sans-serif'
        ctx.fillText('Opinion Polls', centerX, centerY + 25)

        // Left and Right Values
        ctx.fillStyle = '#ffffff'
        ctx.font = '20px "Jacques Pro", system-ui, sans-serif'

        // Left side text (available)
        ctx.fillText(available.toString(), centerX - radius - 35, centerY)

        // Right side text (accessed)
        ctx.fillText(accessed.toString(), centerX + radius + 35, centerY)

    }, [accessed, available, total, accessedPercentage, availablePercentage])

    const handleCardClick = () => {
        setIsDialogOpen(true)
        onClick?.()
    }

    if (isLoading) {
        return (
            <Card className={cn(
                "bg-[#1D1D1D] rounded-3xl border-none",
                className
            )}>
                <CardHeader className="items-start pb-0 px-6 pt-5">
                    <div className="flex items-center justify-between w-full mb-0">
                        <Skeleton className="h-8 w-40 bg-gray-700/50" />
                        <Skeleton className="h-6 w-6 rounded-full bg-gray-700/50" />
                    </div>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[320px]">
                    <Skeleton className="w-[280px] h-[280px] rounded-full bg-gray-700/50" />
                </CardContent>
                <CardFooter className="pt-0 pb-6 px-6">
                    <div className="flex justify-end gap-6 w-full">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-3 w-3 rounded-full bg-gray-700/50" />
                            <Skeleton className="h-5 w-20 bg-gray-700/50" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-3 w-3 rounded-full bg-gray-700/50" />
                            <Skeleton className="h-5 w-20 bg-gray-700/50" />
                        </div>
                    </div>
                </CardFooter>
            </Card>
        )
    }

    return (
        <>
            <Card
                className={cn(
                    "bg-[#1D1D1D] rounded-3xl border-none hover:ring-1 hover:ring-purple-400 transition-all cursor-pointer",
                    className
                )}
                onClick={handleCardClick}
            >
                <CardHeader className="items-start pb-0 px-6 pt-5">
                    <div className="flex items-center justify-between w-full mb-0">
                        <CardTitle className="text-white text-[22px] font-['Jacques_Pro'] font-bold">
                            Opinion Polls
                        </CardTitle>
                        <History className="text-white w-6 h-6" />
                    </div>
                </CardHeader>

                <CardContent className="flex-1 pb-0">
                    <div className="flex justify-center">
                        <canvas ref={canvasRef} className="w-[320px] h-[320px]" />
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-[1000px] bg-[#1F1F1F] border-gray-800 p-8 rounded-[32px] overflow-hidden">
                    <DialogHeader className="flex flex-row items-center justify-between mb-8 space-y-0">
                        <DialogTitle className="text-2xl font-bold text-white">
                            Opinion Polls History
                        </DialogTitle>
                        <div className="flex items-center gap-4">
                            <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-[360px]">
                                <TabsList className="bg-gray-700/50 border-none p-0.5 rounded-lg h-9 w-full">
                                    {['weekly', 'monthly', 'yearly'].map((f) => (
                                        <TabsTrigger
                                            key={f}
                                            value={f}
                                            className="rounded-md data-[state=active]:bg-sky-500 data-[state=active]:text-white text-xs h-8 flex-1 capitalize"
                                        >
                                            {f}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>
                    </DialogHeader>

                    <div className="overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
                        {(() => {
                            if (isLoadingHistory) {
                                return (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                        {[1, 2, 3].map((i) => (
                                            <Card key={i} className="bg-[#2D2D2D] border-none rounded-2xl p-5 flex flex-col h-[200px]">
                                                <Skeleton className="h-4 w-24 bg-gray-700/50 mb-4" />
                                                <Skeleton className="h-12 w-full bg-gray-700/50 mb-6" />
                                                <div className="space-y-3 mt-auto">
                                                    <Skeleton className="h-10 w-full bg-gray-700/50 rounded-xl" />
                                                    <Skeleton className="h-10 w-full bg-gray-700/50 rounded-xl" />
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                );
                            }

                            if (!pollHistory || pollHistory.length === 0) {
                                return (
                                    <div className="h-40 flex items-center justify-center text-gray-400">
                                        No poll history available.
                                    </div>
                                );
                            }

                            const sortedHistory = [...pollHistory].sort((a, b) => {
                                const dateA = a.attempt_on ? new Date(a.attempt_on).getTime() : 0;
                                const dateB = b.attempt_on ? new Date(b.attempt_on).getTime() : 0;
                                return dateB - dateA;
                            });

                            const renderCard = (survey: SurveyItem, question: any, idx: number) => (
                                <Card key={question.question_id || idx} className="bg-[#2D2D2D] border-none rounded-2xl p-5 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{survey.attempt_on ? format(new Date(survey.attempt_on), 'MMM dd, yyyy') : 'No date'}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-6 leading-relaxed line-clamp-3">
                                        {question.que_statement}
                                    </p>
                                    <div className="space-y-3 mt-auto">
                                        {question.question_options?.map((option: any, optIdx: number) => (
                                            <div
                                                key={option.option_id || optIdx}
                                                className={cn(
                                                    "p-2.5 rounded-xl transition-all",
                                                    option.is_selected ? "bg-[#E60086]/10 border border-[#E60086]/20" : ""
                                                )}
                                            >
                                                <div className="flex justify-between items-center text-xs mb-1.5">
                                                    <div className="flex items-center gap-2">
                                                        {!!option.is_selected && (
                                                            <CheckCircle2 className="w-4 h-4 text-[#E60086]" />
                                                        )}
                                                        <span className={cn(
                                                            "line-clamp-1",
                                                            option.is_selected ? "text-white font-semibold" : "text-gray-400"
                                                        )}>
                                                            {option.option_statement}
                                                        </span>
                                                    </div>
                                                    <span className={cn(
                                                        option.is_selected ? "text-[#E60086] font-medium" : "text-gray-400 font-medium"
                                                    )}>
                                                        {Math.round(option.percentage)}%
                                                    </span>
                                                </div>
                                                <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full transition-all duration-500",
                                                            option.is_selected ? "bg-[#E60086]" : "bg-[#7FBC42]"
                                                        )}
                                                        style={{ width: `${option.percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            );

                            const groups: { label: string; surveys: SurveyItem[] }[] = [];
                            const showGroupLabel = activeFilter !== 'all'; // Logic depends on how you want "all" to look

                            sortedHistory.forEach(survey => {
                                let groupLabel = "History";
                                if (activeFilter === 'monthly') {
                                    groupLabel = survey.attempt_on ? format(new Date(survey.attempt_on), 'MMMM yyyy') : 'No date';
                                } else if (activeFilter === 'weekly') {
                                    if (!survey.attempt_on) {
                                        groupLabel = 'No date';
                                    } else {
                                        const d = new Date(survey.attempt_on);
                                        const day = d.getDay() || 7;
                                        d.setDate(d.getDate() - day + 1);
                                        const end = new Date(d);
                                        end.setDate(end.getDate() + 6);
                                        groupLabel = `${format(d, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`;
                                    }
                                } else if (activeFilter === 'yearly') {
                                    groupLabel = survey.attempt_on ? format(new Date(survey.attempt_on), 'yyyy') : 'No date';
                                }

                                const existingGroup = groups.find(g => g.label === groupLabel);
                                if (existingGroup) {
                                    existingGroup.surveys.push(survey);
                                } else {
                                    groups.push({ label: groupLabel, surveys: [survey] });
                                }
                            });

                            return (
                                <div className="flex flex-col gap-8 w-full">
                                    {groups.map(({ label, surveys }) => (
                                        <div key={label} className="w-full">
                                            {activeFilter !== 'all' && (
                                                <div className="py-1.5 px-4 mb-4">
                                                    <h3 className="text-white text-lg font-semibold border-l-4 border-sky-500 pl-3">{label}</h3>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {surveys.map((survey) =>
                                                    survey.questions?.map((q: any, idx: number) => renderCard(survey, q, idx))
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>
                </DialogContent>
            </Dialog>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #374151;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #4B5563;
                }
            `}</style>
        </>
    )
}