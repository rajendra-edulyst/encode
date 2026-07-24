import type { SignUpTokenData } from '@/@types/auth'
import { getVerificationTypeFromApi } from '@/utils/signupVerificationApi'

function national10(digits: string): string {
    const d = digits.replace(/\D/g, '')
    if (d.length === 0) return ''
    return d.length <= 10 ? d : d.slice(-10)
}

function isTruthyFlag(v: unknown): boolean {
    return v === 1 || v === '1' || v === true || v === 'true'
}

const FLAG_KEYS = [
    'mobile_verified',
    'is_mobile_verified',
    'mobile_otp_verified',
    'isMobileVerified',
    'signup_mobile_verified',
    'phone_verified',
    'is_phone_verified',
] as const

/**
 * True when signup-lead API indicates the mobile was verified, or when the lead's
 * stored national mobile matches the field (backend typically persists mobile on successful OTP).
 */
export function isSignupLeadMobileVerifiedByApi(
    lead: SignUpTokenData | undefined,
    phoneFieldDigits: string,
): boolean {
    if (!lead) return false
    const field10 = national10(phoneFieldDigits)
    if (field10.length !== 10) return false

    const ext = lead as SignUpTokenData & Record<string, unknown>
    const flagged = FLAG_KEYS.some((k) => isTruthyFlag(ext[k as string]))
    const verificationType = getVerificationTypeFromApi(lead) ?? lead.verification_type

    const leadMobile10 = national10(String(lead.mobile_number ?? ''))

    if (verificationType === 'mobile' && leadMobile10.length === 10) {
        return leadMobile10 === field10
    }

    if (flagged) {
        if (leadMobile10.length === 10 && leadMobile10 !== field10) return false
        return true
    }

    if (leadMobile10.length === 10 && leadMobile10 === field10) return true

    return false
}
