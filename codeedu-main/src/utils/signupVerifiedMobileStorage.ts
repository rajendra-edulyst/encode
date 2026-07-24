import { getSignupVerificationState } from '@/store/signupVerificationStore'

/** Last 10 digits (national number) verified during signup mobile OTP. */
export function getSignupVerifiedMobile(): string {
    return getSignupVerificationState().verifiedMobile ?? ''
}

export function matchesSignupVerifiedMobile(phoneFieldDigits: string): boolean {
    return getSignupVerificationState().matchesVerifiedMobile(phoneFieldDigits)
}

export function setSignupVerifiedMobile(digits: string): void {
    getSignupVerificationState().setMobileVerified(digits)
}

export function clearSignupVerifiedMobile(): void {
    getSignupVerificationState().clear()
}
