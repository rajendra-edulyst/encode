import { toast } from "sonner"

const NotificationBellIcon = ({ color, size = 30 }: { color: string, size?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M6.24998 23.75C5.89582 23.75 5.59894 23.6302 5.35936 23.3906C5.11977 23.151 4.99998 22.8542 4.99998 22.5C4.99998 22.1458 5.11977 21.849 5.35936 21.6094C5.59894 21.3698 5.89582 21.25 6.24998 21.25H7.49998V12.5C7.49998 10.7708 8.02082 9.23438 9.06248 7.89062C10.1041 6.54688 11.4583 5.66667 13.125 5.25V4.375C13.125 3.85417 13.3073 3.41146 13.6719 3.04688C14.0364 2.68229 14.4791 2.5 15 2.5C15.5208 2.5 15.9635 2.68229 16.3281 3.04688C16.6927 3.41146 16.875 3.85417 16.875 4.375V5.25C18.5416 5.66667 19.8958 6.54688 20.9375 7.89062C21.9792 9.23438 22.5 10.7708 22.5 12.5V21.25H23.75C24.1042 21.25 24.401 21.3698 24.6406 21.6094C24.8802 21.849 25 22.1458 25 22.5C25 22.8542 24.8802 23.151 24.6406 23.3906C24.401 23.6302 24.1042 23.75 23.75 23.75H6.24998ZM15 27.5C14.3125 27.5 13.7239 27.2552 13.2344 26.7656C12.7448 26.276 12.5 25.6875 12.5 25H17.5C17.5 25.6875 17.2552 26.276 16.7656 26.7656C16.276 27.2552 15.6875 27.5 15 27.5ZM3.74998 12.5C3.39582 12.5 3.09894 12.3646 2.85936 12.0938C2.61977 11.8229 2.52082 11.5104 2.56248 11.1562C2.72915 9.59375 3.16665 8.14062 3.87498 6.79688C4.58332 5.45312 5.48957 4.28125 6.59373 3.28125C6.86457 3.05208 7.17186 2.94792 7.51561 2.96875C7.85936 2.98958 8.1354 3.14583 8.34373 3.4375C8.55207 3.72917 8.6354 4.04167 8.59373 4.375C8.55207 4.70833 8.39582 5 8.12498 5.25C7.31248 6.02083 6.64582 6.91667 6.12498 7.9375C5.60415 8.95833 5.2604 10.0625 5.09373 11.25C5.05207 11.6042 4.90623 11.901 4.65623 12.1406C4.40623 12.3802 4.10415 12.5 3.74998 12.5ZM26.25 12.5C25.8958 12.5 25.5937 12.3802 25.3437 12.1406C25.0937 11.901 24.9479 11.6042 24.9062 11.25C24.7396 10.0625 24.3958 8.95833 23.875 7.9375C23.3542 6.91667 22.6875 6.02083 21.875 5.25C21.6042 5 21.4479 4.70833 21.4062 4.375C21.3646 4.04167 21.4479 3.72917 21.6562 3.4375C21.8646 3.14583 22.1406 2.98958 22.4844 2.96875C22.8281 2.94792 23.1354 3.05208 23.4062 3.28125C24.5104 4.28125 25.4167 5.45312 26.125 6.79688C26.8333 8.14062 27.2708 9.59375 27.4375 11.1562C27.4792 11.5104 27.3802 11.8229 27.1406 12.0938C26.901 12.3646 26.6042 12.5 26.25 12.5Z"
            fill={color}
        />
    </svg>
)

const getNotificationAccentColor = (pathname: string) => {
    const p = pathname.toLowerCase()
    if (p.includes('/create')) return '#009BD8' // blue
    if (p.includes('/connect')) return '#E60086' // pink
    if (p.includes('/collaborate')) return '#7FBC42' // green
    return '#009BD8' // default blue
}

type NotificationToastOptions = {
    duration?: number
    dateText?: string
    redirectUrl?: string
    onClick?: () => void
}

const toastQueue: Array<() => void> = []
let isProcessingQueue = false

const processQueue = () => {
    if (isProcessingQueue || toastQueue.length === 0) return
    isProcessingQueue = true

    const showNext = () => {
        if (toastQueue.length === 0) {
            isProcessingQueue = false
            return
        }
        const nextToast = toastQueue.shift()
        if (nextToast) nextToast()

        // Wait 5 seconds before showing the next toast in the queue
        setTimeout(showNext, 5000)
    }

    showNext()
}

export const showNotificationToast = (
    title: string,
    body: string,
    { duration = 5000, dateText, redirectUrl, onClick }: NotificationToastOptions = {}
) => {
    // Only trigger for recent/new notifications (ignore past notifications older than 2 mins)
    if (dateText) {
        // Replace dashes with slashes for better cross-browser Date parsing
        const parsedDate = new Date(dateText.replace(/-/g, '/'))
        if (!isNaN(parsedDate.getTime())) {
            const isPast = Date.now() - parsedDate.getTime() > 2 * 60 * 1000
            if (isPast) {
                return
            }
        }
    }

    const accent = getNotificationAccentColor(window.location.pathname)
    const isClickable = Boolean(redirectUrl || onClick)

    const handleToastClick = async () => {
        try {
            if (onClick) {
                await Promise.resolve(onClick())
            }
        } catch (error) {
            console.error('Notification click handler failed:', error)
        } finally {
            if (redirectUrl) {
                window.location.assign(redirectUrl)
            }
            toast.dismiss()
        }
    }

    const executeToast = () => {
        toast.custom(
            () => (
                <div className="pointer-events-auto flex w-full justify-end animate-in slide-in-from-right-12 fade-in duration-500 fill-mode-both">
                    <div
                        style={{ width: 280, maxWidth: 'calc(100vw - 2rem)', height: 'auto' }}
                    >
                        <div
                            className="relative rounded-[10px] border px-3 py-2.5 font-jacques antialiased"
                            role={isClickable ? 'button' : undefined}
                            tabIndex={isClickable ? 0 : undefined}
                            onClick={isClickable ? () => { void handleToastClick() } : undefined}
                            onKeyDown={
                                isClickable
                                    ? (event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault()
                                            void handleToastClick()
                                        }
                                    }
                                    : undefined
                            }
                            style={{
                                background: '#111827',
                                borderColor: accent,
                                boxShadow: `0 0 0 1px ${accent}55, 0 0 16px ${accent}66`,
                                cursor: isClickable ? 'pointer' : 'default',
                            }}
                        >
                            {/* top notch */}
                            <div
                                className="absolute right-10 h-2.5 w-2.5 rotate-45"
                                style={{
                                    top: '-6px',
                                    background: '#111827',
                                    borderLeft: `1px solid ${accent}`,
                                    borderTop: `1px solid ${accent}`,
                                    boxShadow: `-8px -8px 18px ${accent}33`,
                                }}
                            />

                            <div className="flex items-start gap-2.5">
                                <div className="mt-[3px] flex h-[20px] w-[20px] shrink-0 items-center justify-center">
                                    <NotificationBellIcon color={accent} size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <p
                                            className="text-[13px] font-semibold leading-snug tracking-tight"
                                            style={{ color: '#f9fafb' }}
                                        >
                                            {title}
                                        </p>
                                        <button
                                            type="button"
                                            className="shrink-0 text-sm font-normal leading-none"
                                            style={{ color: '#e5e7eb' }}
                                            aria-label="Close notification"
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                toast.dismiss()
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    {body ? (
                                        <p
                                            className="mt-1 text-[11px] font-normal leading-[1.4]"
                                            style={{ color: 'rgba(229,231,235,0.72)' }}
                                        >
                                            {body}
                                        </p>
                                    ) : null}

                                    {dateText ? (
                                        <div
                                            className="mt-1.5 text-right text-[10px] font-medium leading-normal"
                                            style={{ color: accent }}
                                        >
                                            {dateText}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            { duration }
        )
    }

    toastQueue.push(executeToast)
    processQueue()
}

export const showBlockedNotificationToast = () => {
    const accent = '#ef4444' // Red for blocked/error

    toast.custom(
        () => (
            <div className="pointer-events-auto flex w-full justify-end">
                <div
                    style={{ width: 400, maxWidth: 'calc(100vw - 2rem)', height: 'auto' }}
                >
                    <div
                        className="relative rounded-xl border px-5 py-4 font-jacques antialiased"
                        style={{
                            background: '#111827',
                            borderColor: accent,
                            boxShadow: `0 0 0 1px ${accent}55, 0 0 28px ${accent}66`,
                        }}
                    >
                        {/* top notch */}
                        <div
                            className="absolute right-16 h-4 w-4 rotate-45"
                            style={{
                                top: '-8px',
                                background: '#111827',
                                borderLeft: `1px solid ${accent}`,
                                borderTop: `1px solid ${accent}`,
                            }}
                        />

                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-[30px] w-[30px] items-center justify-center">
                                <NotificationBellIcon color={accent} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                    <p
                                        className="text-[15px] font-semibold leading-snug tracking-tight text-white"
                                    >
                                        Notifications Blocked
                                    </p>
                                    <button
                                        type="button"
                                        className="shrink-0 text-lg font-normal leading-none text-gray-400 hover:text-white"
                                        aria-label="Close notification"
                                        onClick={() => toast.dismiss()}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <p
                                    className="mt-2 text-[13px] font-normal leading-[1.45] text-gray-300"
                                >
                                    Web browser notifications are blocked. Please click the lock icon  next to the website URL to <b>Unblock Now</b> and get real-time updates.
                                </p>
                                <div className="mt-3 flex justify-end">
                                    <button
                                        onClick={() => {
                                            window.open('https://support.google.com/chrome/answer/3220216', '_blank')
                                            toast.dismiss()
                                        }}
                                        className="text-[12px] font-bold uppercase tracking-wider text-white hover:underline"
                                        style={{ color: '#00A8E9' }}
                                    >
                                        Help to enable →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        { duration: 15000 }
    )
}

export { getNotificationAccentColor }

