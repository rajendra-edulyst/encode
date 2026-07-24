import { format, differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';

function normalizeEpochToMs(raw: number): number {
    const abs = Math.abs(raw);
    // seconds (10 digits-ish)
    if (abs < 1e11) return raw * 1000;
    // milliseconds (13 digits-ish)
    if (abs < 1e14) return raw;
    // microseconds (16 digits-ish)
    if (abs < 1e17) return raw / 1000;
    // nanoseconds (19 digits-ish)
    return raw / 1_000_000;
}

function parseDateString(input: string): Date {
    const trimmed = input.trim();

    // Numeric string epoch (supports integer/decimal).
    if (/^\d+(\.\d+)?$/.test(trimmed)) {
        return new Date(normalizeEpochToMs(Number(trimmed)));
    }

    // SQL-style datetime from API (often UTC but missing timezone):
    // "YYYY-MM-DD HH:mm:ss" or "YYYY-MM-DD HH:mm:ss.SSSSSS"
    // Treat as UTC for consistency with epoch timestamps.
    const sqlLike = trimmed.match(
        /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})(\.\d+)?$/
    );
    if (sqlLike) {
        const isoLocal = `${sqlLike[1]}T${sqlLike[2]}${sqlLike[3] ?? ''}`;
        return new Date(isoLocal);
    }

    return new Date(trimmed);
}

/**
 * Formats a date/timestamp to show relative time labels or a full date.
 * 
 * Rules:
 * - Shows "just now" for < 60 seconds
 * - Shows "Xm" for minutes (< 60 minutes)
 * - Shows "Xh" for hours (< 24 hours)
 * - Shows "X day(s)" for days (< 7 days)
 * - Shows "X week(s)" for weeks (< 4 weeks)
 * - Shows "1 month" for ~1 month (< 2 months)
 * - Shows full date (e.g., "26 July 2025") for anything older
 * 
 * @param dateInput - Can be a Unix timestamp (seconds), Date object, or ISO string
 * @returns Formatted string
 */
export function formatRelativeOrLong(dateInput: string | Date | number | null | undefined): string {
    if (!dateInput) return '';

    let date: Date;

    // Handle different input types
    if (typeof dateInput === 'number') {
        date = new Date(normalizeEpochToMs(dateInput));
    } else if (typeof dateInput === 'string') {
        date = parseDateString(dateInput);
    } else if (dateInput instanceof Date) {
        date = dateInput;
    } else {
        return '';
    }

    // Validate date
    if (isNaN(date.getTime())) return '';

    const now = new Date();

    // Calculate differences using date-fns
    const seconds = differenceInSeconds(now, date);
    const minutes = differenceInMinutes(now, date);
    const hours = differenceInHours(now, date);
    const days = differenceInDays(now, date);
    const weeks = differenceInWeeks(now, date);
    const months = differenceInMonths(now, date);

    // Return relative time labels
    if (seconds < 60) {
        return 'just now';
    }

    if (minutes < 60) {
        return `${minutes}m`;
    }

    if (hours < 24) {
        return `${hours}h`;
    }

    if (days < 7) {
        return `${days} day${days !== 1 ? 's' : ''}`;
    }

    if (weeks < 4) {
        return `${weeks} week${weeks !== 1 ? 's' : ''}`;
    }

    if (months < 2) {
        return '1 month';
    }

    // For older dates, show full date: "26 July 2025"
    return format(date, 'dd MMMM yyyy');
}

export default formatRelativeOrLong;
