import { useEffect, useMemo, useState } from 'react'
import { PiCalendar, PiCheck } from 'react-icons/pi'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Question } from '@/@types/create/courses'
import Loading from '@/components/shared/Loading'
import { Alert } from '@/components/ui'
import { Button } from '@/components/ui/ShadcnButton'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { useAssessmentDetailsWithQuestions } from '@/hooks/data/create/useCourses'
import { saveSurveyAnswers } from '@/services/create/AssessmentService'
import { formatDate } from '@/utils/commonDateFormat'
import submitDoneIcon from '@/assets/icons/download_done.png'

type NumericOption = { optionId: number; value: number }

const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, ' ').trim()
const nonEmpty = (value?: string | null) => (value && value.trim() ? value.trim() : null)

const extractQuestionLabel = (questionText: string) => {
    const normalized = normalize(questionText)
    if (normalized.includes('overall effectiveness') && normalized.includes('interaction')) {
        return 'Overall usefulness'
    }

    const [firstLine] = questionText.split('\n')
    return firstLine
        .replace(/\r/g, '')
        .replace(/^[A-Z]\.\s*/, '')
        .replace(/\(rating scale\).*/i, '')
        .trim()
}

const getNumericOptions = (question: Question): NumericOption[] => {
    const list = question.options
        .map((opt) => {
            const n = Number(opt.option_statement.trim())
            if (Number.isNaN(n)) return null
            return { optionId: opt.option_id, value: n }
        })
        .filter((v): v is NumericOption => v !== null)
        .sort((a, b) => a.value - b.value)
    return list
}

const isRatingQuestion = (question: Question) => {
    if (question.options.length < 3) return false
    const q = normalize(question.question)
    if (q.includes('rating scale') || q.includes('overall effectiveness') || q.includes('overall usefulness')) {
        return true
    }
    return getNumericOptions(question).length >= 3
}

const RatingSliderField = ({
    question,
    selectedOptionId,
    onSelect,
}: {
    question: Question
    selectedOptionId?: number
    onSelect: (questionId: number, optionId: number) => void
}) => {
    const options = useMemo(() => getNumericOptions(question), [question])
    const selectedIndex = Math.max(
        0,
        options.findIndex((o) => o.optionId === selectedOptionId),
    )
    const resolvedIndex = selectedIndex >= 0 ? selectedIndex : 0
    const total = Math.max(1, options.length - 1)
    const pct = (resolvedIndex / total) * 100
    const bubbleValue = options[resolvedIndex]?.value ?? options[0]?.value ?? 1

    return (
        <div className="min-w-0 rounded-2xl bg-[#323232] p-5">
            <p className="mb-5 text-sm text-[#E7E7E7]">{extractQuestionLabel(question.question)}</p>
            <div className="relative px-4">
                <span
                    className="pointer-events-none absolute z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/90 bg-[#05B8FF] text-xs font-bold text-white transition-all duration-200 ease-out"
                    style={{ top: '50%', left: `clamp(16px, ${pct}%, calc(100% - 16px))` }}
                >
                    {bubbleValue}
                </span>
                <Slider
                    min={0}
                    max={Math.max(0, options.length - 1)}
                    step={1}
                    value={[resolvedIndex]}
                    onValueChange={(value) => {
                        const next = options[value[0]]
                        if (next) onSelect(question.question_id, next.optionId)
                    }}
                    className="
                        [&>span:first-child]:h-[6px]
                        [&>span:first-child]:bg-[#5A5A5A]
                        [&>span:first-child>span]:!bg-[#05B8FF]
                        [&>span:first-child>span]:transition-all
                        [&>span:first-child>span]:duration-200
                        [&>span:first-child>span]:ease-out
                        [&_[role='slider']]:!hidden
                        [&_[role='slider']]:!h-0
                        [&_[role='slider']]:!w-0
                        [&_[role='slider']]:!min-h-0
                        [&_[role='slider']]:!min-w-0
                        [&_[role='slider']]:!border-0
                        [&_[role='slider']]:!bg-transparent
                        [&_[role='slider']]:!shadow-none
                        [&_[role='slider']]:!opacity-0
                        [&_[role='slider']]:!p-0
                        [&_[role='slider']]:!ring-0
                        [&_[role='slider']]:!outline-none
                        [&_[role='slider']]:focus-visible:!ring-0
                    "
                />
            </div>
        </div>
    )
}

interface SessionFeedbackPageProps {
    contentId?: string
    userCalendarId?: string | null
    formTitle?: string
    showBreadcrumb?: boolean
    onSubmitted?: () => void | Promise<void>
}

const SessionFeedbackPage = ({ contentId, userCalendarId: userCalendarIdProp, formTitle, showBreadcrumb = true, onSubmitted }: SessionFeedbackPageProps) => {
    const navigate = useNavigate()
    const { sessionId } = useParams<{ sessionId: string }>()
    const [searchParams] = useSearchParams()
    const resolvedContentId = contentId || sessionId
    const userCalendarIdFromUrl = searchParams.get('user_calender_id') ?? searchParams.get('user_calendar_id')
    const userCalendarIdRaw = userCalendarIdProp ?? userCalendarIdFromUrl
    const parsedUserCalendarId = Number(userCalendarIdRaw ?? 0)
    const userCalendarId = Number.isFinite(parsedUserCalendarId) ? parsedUserCalendarId : 0

    const { data, isLoading, error } = useAssessmentDetailsWithQuestions(resolvedContentId, undefined, userCalendarId)
    const assessment = data?.assessment_details
    const responseMeta = data as (
        typeof data & {
            mentor_name?: string
            mentee_name?: string
            start_date?: number
            end_date?: number
            session_start_date?: number
            session_end_date?: number
        }
    ) | undefined
    const questions = assessment?.questions || []
    const mentorStartDate = responseMeta?.session_start_date ?? responseMeta?.start_date ?? assessment?.start_date
    const mentorEndDate = responseMeta?.session_end_date ?? responseMeta?.end_date ?? assessment?.end_date
    const surveyTitle =
        nonEmpty(formTitle) ||
        nonEmpty((responseMeta as { session_name?: string } | undefined)?.session_name) ||
        nonEmpty((responseMeta as { assessment_name?: string } | undefined)?.assessment_name) ||
        nonEmpty((responseMeta as { title?: string } | undefined)?.title) ||
        nonEmpty(assessment?.title) ||
        'Feedback Form'

    const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({})
    const [textAnswers, setTextAnswers] = useState<Record<number, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

    useEffect(() => {
        if (!questions.length) return
        const prefilled: Record<number, number> = {}
        questions.forEach((q) => {
            const selected = q.options.find((o) => o.attempted === 1)
            if (selected) prefilled[q.question_id] = selected.option_id
        })
        setMcqAnswers(prefilled)
    }, [questions])

    const grouped = useMemo(() => {
        // Deterministic sequence as requested:
        // 1) first 5 rating questions -> ratings
        // 2) next 2 questions -> learning
        // 3) next 2 questions (first prefers text) -> insights
        // 4) next 2 questions -> overall
        const ratings: Question[] = []
        const learning: Question[] = []
        const insights: Question[] = []
        const overall: Question[] = []

        const remaining = [...questions]

        for (const q of questions) {
            if (ratings.length >= 5) break
            if (isRatingQuestion(q)) {
                ratings.push(q)
            }
        }
        const ratingIds = new Set(ratings.map((q) => q.question_id))
        const afterRatings = remaining.filter((q) => !ratingIds.has(q.question_id))

        learning.push(...afterRatings.slice(0, 2))
        const afterLearning = afterRatings.slice(2)

        const firstTextIndex = afterLearning.findIndex((q) => q.options.length === 0)
        if (firstTextIndex >= 0) {
            insights.push(afterLearning[firstTextIndex])
            afterLearning.splice(firstTextIndex, 1)
        } else if (afterLearning.length > 0) {
            insights.push(afterLearning.shift()!)
        }
        if (afterLearning.length > 0) {
            insights.push(afterLearning.shift()!)
        }

        // Keep only 2 in "Overall Experience" as requested.
        overall.push(...afterLearning.slice(0, 2))

        return { ratings, learning, insights, overall }
    }, [questions])

    const displayedQuestions = useMemo(
        () => [...grouped.ratings, ...grouped.learning, ...grouped.insights, ...grouped.overall],
        [grouped],
    )

    const handleMcqSelect = (questionId: number, optionId: number, checked: boolean | 'indeterminate') => {
        setMcqAnswers((prev) => {
            if (checked !== true && prev[questionId] === optionId) {
                const { [questionId]: _, ...rest } = prev
                return rest
            }
            return { ...prev, [questionId]: optionId }
        })
    }

    const validate = () => {
        const missing: string[] = []
        for (const q of displayedQuestions) {
            if (q.options.length > 0) {
                if (!mcqAnswers[q.question_id]) missing.push(extractQuestionLabel(q.question))
            } else {
                if (!textAnswers[q.question_id]?.trim()) missing.push(extractQuestionLabel(q.question))
            }
        }
        return missing
    }

    const handleSubmit = async () => {
        if (!resolvedContentId) return
        const missing = validate()
        if (missing.length > 0) {
            toast.error(`Please complete all questions (${missing.length} pending).`)
            return
        }

        const answers = displayedQuestions.map((q) => {
            if (q.options.length > 0) {
                return {
                    question_id: q.question_id,
                    option_id: [mcqAnswers[q.question_id]],
                }
            }
            return {
                question_id: q.question_id,
                answer_statement: textAnswers[q.question_id] || '',
            }
        })

        try {
            setIsSubmitting(true)
            const message = await saveSurveyAnswers({
                content_id: resolvedContentId,
                user_calender_id: userCalendarId,
                answers,
            })
            toast.success(message || 'Feedback submitted successfully.')
            setIsSuccessModalOpen(true)
        } catch (e) {
            console.error(e)
            toast.error('Unable to submit feedback. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) return <Loading loading={isLoading} />
    if (error || !assessment) return <Alert title="Failed to load feedback form." type="danger" />

    return (
        <section className="w-full min-w-0 overflow-x-hidden pb-8 text-white">
            <div className={`w-full min-w-0 ${showBreadcrumb ? 'pt-0' : 'pt-5'}`}>
                {showBreadcrumb && (
                    <div className="mb-6 text-base leading-none">
                        <span className="text-white font-medium">Session</span>
                        <span className="mx-2 text-[#6a6a6a]">{'>'}</span>
                        <span className="font-semibold text-[#00b7ff]">{surveyTitle}</span>
                    </div>
                )}

                <div className="mb-6 flex min-w-0 items-end justify-between gap-6">
                    <Card className="w-full min-w-0 max-w-[700px] rounded-3xl border-none bg-[#1D1D1D]">
                        <CardContent className="p-4">
                            <div className="mb-5 flex items-start justify-between">
                                <div className="pr-4">
                                    {/* <h3 className="text-2xl font-bold leading-none">{surveyTitle}</h3> */}
                                    <h3 className="text-2xl text-[#d4d4d4]">Session Details</h3>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[#d4d4d4]">
                                    <PiCalendar className="text-base" />
                                    <span>{mentorStartDate ? formatDate(mentorStartDate, 'DD MMM, YYYY') : '-'}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm leading-snug">
                                <div className="space-y-3">
                                    <p><span className="font-semibold">Mentor:</span> <span className="font-normal text-[#F2F2F2]">{responseMeta?.mentor_name || '-'}</span></p>
                                    <p><span className="font-semibold">Mentee:</span> <span className="font-normal text-[#F2F2F2]">{responseMeta?.mentee_name || '-'}</span></p>
                                </div>
                                <div className="space-y-3 text-right">
                                    <p><span className="font-semibold">Mentor Starts:</span> <span className="font-normal text-[#F2F2F2]">{mentorStartDate ? formatDate(mentorStartDate, 'hh:mm A') : '-'}</span></p>
                                    <p><span className="font-semibold">Mentor Ends:</span> <span className="font-normal text-[#F2F2F2]">{mentorEndDate ? formatDate(mentorEndDate, 'hh:mm A') : '-'}</span></p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="h-auto w-[108px] shrink-0 rounded-xl bg-[#05b8ff] px-3 py-4 text-sm font-semibold text-black hover:bg-[#03a5e5] disabled:opacity-50"
                    >
                        <span className="flex flex-col items-center gap-1 leading-snug">
                            <img src={submitDoneIcon} alt="Submit" className="h-5 w-5 object-contain" />
                            <span>{isSubmitting ? 'Saving' : 'Submit'}</span>
                            <span>Details</span>
                        </span>
                    </Button>
                </div>

                <Card className="mb-6 min-w-0 rounded-3xl border-none bg-[#1D1D1D]">
                    <CardContent className="p-6">
                        <h2 className="mb-5 text-2xl font-bold">Session Ratings</h2>
                        <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {grouped.ratings.map((q) => (
                                <RatingSliderField
                                    key={q.question_id}
                                    question={q}
                                    selectedOptionId={mcqAnswers[q.question_id]}
                                    onSelect={(questionId, optionId) => handleMcqSelect(questionId, optionId, true)}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="mb-6 grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2">
                    <Card className="min-w-0 rounded-3xl border-none bg-[#1D1D1D]">
                        <CardContent className="p-6">
                            <h2 className="mb-4 text-2xl font-bold">Learning & Outcomes</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {grouped.learning.map((q, index) => (
                                    <div key={q.question_id}>
                                        <p className="mb-3 text-sm">
                                            {index + 1}. {extractQuestionLabel(q.question)} <span className="text-red-500">*</span>
                                        </p>
                                        <div className="space-y-3">
                                            {q.options.map((option) => (
                                                <label key={option.option_id} className="flex cursor-pointer items-center gap-2.5 text-sm">
                                                    <Checkbox
                                                        checked={mcqAnswers[q.question_id] === option.option_id}
                                                        onCheckedChange={(checked) => handleMcqSelect(q.question_id, option.option_id, checked)}
                                                        className="h-4 w-4 rounded-[3px] border-[#6f6f6f] data-[state=checked]:bg-[#05b8ff] data-[state=checked]:text-black"
                                                    />
                                                    {option.option_statement}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="min-w-0 rounded-3xl border-none bg-[#1D1D1D]">``
                        <CardContent className="p-6">
                            <h2 className="mb-4 text-2xl font-bold">Insights</h2>
                            {(() => {
                                const insightsMcq = grouped.insights.find((q) => q.options.length > 0)
                                const insightsText = grouped.insights.find((q) => q.options.length === 0)
                                const firstInsight = insightsMcq || grouped.insights[0]
                                const secondInsight = insightsText || grouped.insights.find((q) => q.question_id !== firstInsight?.question_id)

                                return (
                                    <>
                                        {firstInsight && (
                                            <div className="mb-4">
                                                <p className="mb-3 text-sm">
                                                    {extractQuestionLabel(firstInsight.question)} <span className="text-red-500">*</span>
                                                </p>
                                                {firstInsight.options.length > 0 ? (
                                                    <div className="mb-2 flex flex-wrap gap-x-6 gap-y-3">
                                                        {firstInsight.options.map((option) => (
                                                            <label key={option.option_id} className="flex cursor-pointer items-center gap-2.5 text-sm">
                                                                <Checkbox
                                                                    checked={mcqAnswers[firstInsight.question_id] === option.option_id}
                                                                    onCheckedChange={(checked) => handleMcqSelect(firstInsight.question_id, option.option_id, checked)}
                                                                    className="h-5 w-5 rounded-[3px] border-[#6f6f6f] data-[state=checked]:bg-[#05b8ff] data-[state=checked]:text-black"
                                                                />
                                                                {option.option_statement}
                                                            </label>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <textarea
                                                        value={textAnswers[firstInsight.question_id] || ''}
                                                        onChange={(e) => setTextAnswers((prev) => ({ ...prev, [firstInsight.question_id]: e.target.value }))}
                                                        placeholder="Write your response..."
                                                        className="h-12 w-full rounded-xl border-none bg-[#323232] px-4 py-3 text-sm text-white placeholder:text-[#A6A6A6] focus:outline-none"
                                                        rows={1}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {secondInsight && (
                                            <div>
                                                {secondInsight.options.length > 0 ? (
                                                    <>
                                                        <p className="mb-3 text-sm">{extractQuestionLabel(secondInsight.question)}</p>
                                                        <div className="flex flex-wrap gap-x-6 gap-y-3">
                                                            {secondInsight.options.map((option) => (
                                                                <label key={option.option_id} className="flex cursor-pointer items-center gap-2.5 text-sm">
                                                                    <Checkbox
                                                                        checked={mcqAnswers[secondInsight.question_id] === option.option_id}
                                                                        onCheckedChange={(checked) => handleMcqSelect(secondInsight.question_id, option.option_id, checked)}
                                                                        className="h-5 w-5 rounded-[3px] border-[#6f6f6f] data-[state=checked]:bg-[#05b8ff] data-[state=checked]:text-black"
                                                                    />
                                                                    {option.option_statement}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <textarea
                                                        value={textAnswers[secondInsight.question_id] || ''}
                                                        onChange={(e) => setTextAnswers((prev) => ({ ...prev, [secondInsight.question_id]: e.target.value }))}
                                                        placeholder="Any Suggestion for Mentor(Optional)"
                                                        className="h-12 w-full rounded-xl border-none bg-[#323232] px-4 py-3 text-sm text-white placeholder:text-[#A6A6A6] focus:outline-none"
                                                        rows={1}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </>
                                )
                            })()}
                        </CardContent>
                    </Card>
                </div>

                <Card className="w-full min-w-0 rounded-3xl border-none bg-[#1D1D1D] xl:max-w-[980px]">
                    <CardContent className="p-6">
                        <h2 className="mb-4 text-2xl font-bold">Overall Experience</h2>
                        {grouped.overall.map((q) => (
                            <div key={q.question_id} className="mb-5 last:mb-0">
                                <p className="mb-3 text-sm">
                                    {extractQuestionLabel(q.question)}<span className="text-red-500">*</span>
                                </p>
                                {q.options.length > 0 ? (
                                    <div className="flex flex-wrap gap-x-5 gap-y-3">
                                        {q.options.map((option) => (
                                            <label key={option.option_id} className="flex cursor-pointer items-center gap-2.5 text-sm">
                                                <Checkbox
                                                    checked={mcqAnswers[q.question_id] === option.option_id}
                                                    onCheckedChange={(checked) => handleMcqSelect(q.question_id, option.option_id, checked)}
                                                    className="h-4 w-4 rounded-[3px] border-[#6f6f6f] data-[state=checked]:bg-[#05b8ff] data-[state=checked]:text-black"
                                                />
                                                {option.option_statement}
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <textarea
                                        value={textAnswers[q.question_id] || ''}
                                        onChange={(e) => setTextAnswers((prev) => ({ ...prev, [q.question_id]: e.target.value }))}
                                        placeholder="Write your response..."
                                        className="h-10 w-full rounded-xl border-none bg-[#323232] px-4 py-2 text-sm text-white placeholder:text-[#b0b0b0] focus:outline-none"
                                        rows={4}
                                    />
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
                <DialogContent className="w-[calc(100vw-24px)] max-w-3xl border-none bg-[#5F5F5F] px-5 py-7 text-white max-h-[90dvh] overflow-y-auto sm:w-full sm:px-10 sm:py-10 sm:rounded-[26px]">
                    <DialogTitle className="text-center text-[56px] font-bold leading-[0.95] tracking-tight text-4xl sm:text-5xl">
                        <span role="img" aria-label="sparkles">✨</span> You&apos;re all set!
                    </DialogTitle>
                    <DialogDescription className="mx-auto mt-5 max-w-2xl text-center text-xl leading-relaxed text-[#F3F3F3] sm:mt-6 sm:text-2xl">
                        Your feedback has been submitted successfully. Keep building your journey with us.
                    </DialogDescription>
                    <div className="mt-7 flex justify-center sm:mt-8">
                        <Button
                            onClick={async () => {
                                setIsSuccessModalOpen(false)
                                await onSubmitted?.()
                                navigate('/connect/encode')
                            }}
                            className="h-auto w-full max-w-[320px] rounded-xl bg-[#80C342] px-6 py-4 text-2xl font-semibold leading-tight text-black hover:bg-[#74b43c] sm:w-auto sm:px-10 sm:py-5 sm:text-3xl"
                        >
                            Continue..
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    )
}

export default SessionFeedbackPage