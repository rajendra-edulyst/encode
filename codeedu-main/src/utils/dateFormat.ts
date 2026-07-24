export interface DateFormatOptions {
    year?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    day?: 'numeric' | '2-digit';
    [key: string]: string | undefined;
}

export interface DateObject {
    [key: string]: string | number | undefined;
}

export const formatApiDate = (
    dateValue: string | number | DateObject | Date,
    dateKey?: string,
    formatOptions: DateFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }
): string | null => {
    try {
        let date: Date;

        if (typeof dateValue === 'undefined' || dateValue === null) {
            return '';
        }

        const value =
            dateKey && typeof dateValue === 'object'
                ? (dateValue as DateObject)[dateKey]
                : dateValue;

        if (typeof value === 'number') {
            date = new Date(value * 1000); // timestamp to ms
        } else if (typeof value === 'string') {
            date = new Date(value);
        } else if (value instanceof Date) {
            date = value;
        } else {
            return 'N/A';
        }

        if (isNaN(date.getTime())) return 'N/A';

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        // Format as "x mins ago"
        if (diffMins < 60) {
            return diffMins <= 1 ? '1 minute ago' : `${diffMins} minutes ago`;
        }

        // Format as "x hours ago"
        if (diffHours < 24) {
            return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
        }

        // Fallback to date string
        return date.toLocaleDateString('en-IN', formatOptions);
    } catch (error) {
        console.error('Date formatting error:', error);
        return null;
    }
};


// React hook for formatted date
export const useFormattedDate = (
    dateValue: string | number | DateObject,
    dateKey?: string,
    formatOptions: DateFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }
): string | null => {
    return formatApiDate(dateValue, dateKey, formatOptions);
};

export const formatedApiDate = (
    dateValue: string,
    formatOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short', 
        day: 'numeric'  
    }
): string => {
    if (!dateValue) return '';

    const isoString = dateValue.replace(' ', 'T');

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'N/A';

    return date.toLocaleDateString('en-US', formatOptions);
};
