import type { LiveClass } from '@/@types/learner/MyClasses'

/** Ignore API endtime_ts when it implies a session longer than this (bad data often spans days). */
const MAX_SESSION_SPAN_SEC = 24 * 3600
const DEFAULT_DURATION_MIN = 120

/**
 * Parse displayed end time on the same calendar day as starttime_ts (local).
 * If end is not after start on that day, treat end as the next day (e.g. 2:58 PM → 1:38 PM next day).
 */
function parseEndTimeOnSessionDay(
    starttimeTs: number,
    endTimeStr: string,
): number | null {
    const trimmed = endTimeStr?.trim()
    if (!trimmed) return null
    const base = new Date(starttimeTs * 1000)
    const localeDate = base.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
    const normalized = trimmed.replace(/\s+/g, ' ')
    const endMs = new Date(`${localeDate} ${normalized}`).getTime()
    if (Number.isNaN(endMs)) return null
    const startMs = starttimeTs * 1000
    let result = endMs
    if (result <= startMs) {
        result += 86400000
    }
    return result
}

function getSessionEndMs(session: LiveClass): number {
    const startSec = session.starttime_ts
    const startMs = startSec * 1000
    const endSec = session.endtime_ts
    const spanSec = endSec > startSec ? endSec - startSec : 0

    if (spanSec > 0 && spanSec <= MAX_SESSION_SPAN_SEC) {
        return endSec * 1000
    }

    const parsedEnd = parseEndTimeOnSessionDay(
        session.starttime_ts,
        session.end_time,
    )
    if (parsedEnd !== null && parsedEnd > startMs) {
        return parsedEnd
    }

    const durMin =
        session.duration &&
        session.duration > 0 &&
        session.duration <= 12 * 60
            ? session.duration
            : DEFAULT_DURATION_MIN
    return startMs + durMin * 60 * 1000
}

/**
 * Live only while current time is within the resolved session window.
 * Does not treat "same calendar day" or backend liveclass_status alone as Live.
 */
export function getLiveSessionDisplayStatus(
    session: LiveClass,
    nowMs: number,
): string {
    if (session.liveclass_status === 'Completed') return 'Completed'

    const startMs = session.starttime_ts * 1000
    const endMs = getSessionEndMs(session)

    if (nowMs > endMs) return 'Completed'
    if (nowMs >= startMs && nowMs <= endMs) return 'Live'
    return 'Upcoming'
}
