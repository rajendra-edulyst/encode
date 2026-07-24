export type SignupVerificationType = 'mobile' | 'email'

export function isSignupApiSuccess(payload: unknown): boolean {
    if (payload == null || typeof payload !== 'object') return false
    const status = (payload as Record<string, unknown>).status
    return status === 1 || status === '1'
}

/** Reads `data.verification_type` (or top-level) from send/verify OTP responses. */
export function getVerificationTypeFromApi(payload: unknown): SignupVerificationType | null {
    if (payload == null || typeof payload !== 'object') return null
    const root = payload as Record<string, unknown>
    const data = root.data
    let raw: unknown
    if (data && typeof data === 'object') {
        raw = (data as Record<string, unknown>).verification_type
    } else {
        raw = root.verification_type
    }
    if (raw === 'mobile' || raw === 'email') return raw
    return null
}
