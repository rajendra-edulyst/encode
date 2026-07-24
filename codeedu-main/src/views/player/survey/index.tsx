import { CommonModuleContent } from '@/@types/learner/Courses'
import SessionFeedbackPage from '@/views/learner/my-space/clasess/feedback'
import { useSearchParams } from 'react-router-dom'
import LegacySurvey from './survey'
import { useEffect } from 'react'
import { mixpanelService } from '@/services/mixpanel/MixpanelService'

interface SurveyProps {
    content: CommonModuleContent & { id?: number }
    onSurveySubmitted?: () => void | Promise<void>
    forceLegacy?: boolean
}

const USE_LEGACY_SURVEY_UI = import.meta.env.VITE_USE_LEGACY_SURVEY_UI === 'true'

const Survey = ({ content, onSurveySubmitted, forceLegacy = false }: SurveyProps) => {
    const [searchParams] = useSearchParams()
    const userCalendarId = searchParams.get('user_calender_id') ?? searchParams.get('user_calendar_id')
    const hasCalendarContext = Boolean(userCalendarId)
    const useLegacySurvey = forceLegacy || (!hasCalendarContext && USE_LEGACY_SURVEY_UI)
    const contentId = content?.program_content_id ?? content?.id

    useEffect(() => {
        if (content) {
            mixpanelService.track('Survey Started', {
                survey_id: contentId,
                survey_title: content.title,
                course_id: content.program_id
            });
        }
    }, [content, contentId]);

    if (!hasCalendarContext || useLegacySurvey || !contentId) {
        return <LegacySurvey content={content} onSurveySubmitted={onSurveySubmitted} />
    }

    return (
        <SessionFeedbackPage
            contentId={contentId.toString()}
            formTitle={content?.title}
            showBreadcrumb
            onSubmitted={onSurveySubmitted}
        />
    )
}

export default Survey
