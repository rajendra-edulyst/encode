import { useEvents } from '@/hooks/data/collaborate/useEvents'
import { useMentorUpcomingSessions } from '@/hooks/data/create/useMentor'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export const GlobalEventNotifier = () => {
    // Only fetch assigned events
    const params = new URLSearchParams()
    params.append('is_assigned', '1')
    const { data: events } = useEvents(params)

    // Fetch upcoming mentoring sessions
    const { data: mentoringSessions } = useMentorUpcomingSessions()

    const navigate = useNavigate()

    const lastNotifiedMinute = useRef<Record<string, number>>({})
    const lastNotifiedSessionMinute = useRef<Record<string, number>>({})

    useEffect(() => {
        if (!events || events.length === 0) return

        const interval = setInterval(() => {
            const now = new Date().getTime()

            events.forEach((event) => {
                const startDatetime = event.event_details?.event_datetime || event.event_datetime || event.start_date
                if (!startDatetime) return
                const targetTime = new Date(startDatetime).getTime()

                const difference = targetTime - now

                if (difference > 0) {
                    const remainingMinutes = Math.ceil(difference / (1000 * 60))

                    if (remainingMinutes <= 10 && remainingMinutes > 0) {
                        const eventId = String(event.id)
                        if (lastNotifiedMinute.current[eventId] !== remainingMinutes) {
                            if (remainingMinutes === 10 || remainingMinutes === 5 || remainingMinutes === 2) {
                                toast.success(`We're going live in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} for ${event.name}!`, {
                                    position: 'top-right',
                                    style: {
                                        backgroundColor: '#323232',
                                        color: '#ffffff',
                                        borderColor: '#009bd8',
                                        borderWidth: '1px',
                                        fontWeight: 'bold',
                                    },
                                    action: {
                                        label: 'Join',
                                        onClick: () => {
                                            toast.dismiss()
                                            navigate(`/collaborate/agenda/details/${event.id}`)
                                        }
                                    }
                                })
                            }
                            lastNotifiedMinute.current[eventId] = remainingMinutes
                        }
                    }
                }
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [events, navigate])

    useEffect(() => {
        if (!mentoringSessions || mentoringSessions.length === 0) return

        const interval = setInterval(() => {
            const now = new Date().getTime()

            mentoringSessions.forEach((session) => {
                // Ensure we handle the start date similarly to SessionCard parsing
                let startDatetime = session.start_date
                if (!startDatetime) return

                // If it has a range, grab the start part and replace space with T
                const match = startDatetime.match(/(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})/)
                if (match) {
                    startDatetime = match[1].replace(' ', 'T')
                } else {
                    startDatetime = startDatetime.replace(' ', 'T')
                }

                const targetTime = new Date(startDatetime).getTime()
                if (isNaN(targetTime)) return

                const difference = targetTime - now

                if (difference > 0) {
                    const remainingMinutes = Math.ceil(difference / (1000 * 60))

                    if (remainingMinutes <= 10 && remainingMinutes > 0) {
                        const sessionId = String(session.id)
                        if (lastNotifiedSessionMinute.current[sessionId] !== remainingMinutes) {
                            if (remainingMinutes === 10 || remainingMinutes === 5 || remainingMinutes === 2) {
                                toast.success(`Mentoring session '${session.topic}' with ${session.name} starts in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}!`, {
                                    position: 'top-right',
                                    style: {
                                        backgroundColor: '#323232',
                                        color: '#ffffff',
                                        borderColor: '#9810FA', // Using purple to match mentoring theme
                                        borderWidth: '1px',
                                        fontWeight: 'bold',
                                    },
                                    action: {
                                        label: 'View',
                                        onClick: () => {
                                            toast.dismiss()
                                            navigate(`/dashboard/mentor?tab=upcoming_sessions`)
                                        }
                                    }
                                })
                            }
                            lastNotifiedSessionMinute.current[sessionId] = remainingMinutes
                        }
                    }
                }
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [mentoringSessions, navigate])

    return null
}
