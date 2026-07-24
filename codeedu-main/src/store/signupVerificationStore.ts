import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
    getVerificationTypeFromApi,
    isSignupApiSuccess,
    type SignupVerificationType,
} from '@/utils/signupVerificationApi'

const LEGACY_MOBILE_KEY = 'signupVerifiedMobile'

function national10(digits: string): string {
    const d = digits.replace(/\D/g, '')
    if (d.length === 0) return ''
    return d.length <= 10 ? d : d.slice(-10)
}

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase()
}

function migrateLegacyMobileStorage(): string | null {
    if (typeof sessionStorage === 'undefined') return null
    try {
        const legacy = sessionStorage.getItem(LEGACY_MOBILE_KEY)
        if (!legacy) return null
        const ten = national10(legacy)
        sessionStorage.removeItem(LEGACY_MOBILE_KEY)
        return ten.length === 10 ? ten : null
    } catch {
        return null
    }
}

type SignupVerificationState = {
    verifiedMobile: string | null
    verifiedEmail: string | null
    lastVerificationType: SignupVerificationType | null
    setMobileVerified: (mobile: string) => void
    setEmailVerified: (email: string) => void
    /**
     * On successful OTP verify (or lead sync), persist channel from `data.verification_type`
     * and optional fallback when the endpoint implies mobile vs email.
     */
    markVerifiedFromApiResponse: (
        payload: unknown,
        context?: {
            mobile?: string
            email?: string
            fallbackType?: SignupVerificationType
        },
    ) => boolean
    isMobileVerified: (phoneFieldDigits?: string) => boolean
    matchesVerifiedMobile: (phoneFieldDigits: string) => boolean
    clear: () => void
}

export const useSignupVerificationStore = create<SignupVerificationState>()(
    persist(
        (set, get) => ({
            verifiedMobile: null,
            verifiedEmail: null,
            lastVerificationType: null,

            setMobileVerified: (mobile) => {
                const ten = national10(mobile)
                if (ten.length !== 10) return
                set({ verifiedMobile: ten, lastVerificationType: 'mobile' })
                try {
                    sessionStorage.setItem(LEGACY_MOBILE_KEY, ten)
                } catch {
                    /* ignore */
                }
            },

            setEmailVerified: (email) => {
                const normalized = normalizeEmail(email)
                if (!normalized) return
                set({ verifiedEmail: normalized, lastVerificationType: 'email' })
            },

            markVerifiedFromApiResponse: (payload, context) => {
                if (!isSignupApiSuccess(payload)) return false

                const apiType = getVerificationTypeFromApi(payload)
                const type = apiType ?? context?.fallbackType
                if (!type) return false

                if (type === 'mobile' && context?.mobile) {
                    get().setMobileVerified(context.mobile)
                    return true
                }
                if (type === 'email' && context?.email) {
                    get().setEmailVerified(context.email)
                    return true
                }
                return false
            },

            isMobileVerified: (phoneFieldDigits) => {
                const stored = get().verifiedMobile
                if (!stored || stored.length !== 10) return false
                if (phoneFieldDigits == null || phoneFieldDigits === '') return true
                const d = phoneFieldDigits.replace(/\D/g, '')
                return d === stored || d.slice(-10) === stored
            },

            matchesVerifiedMobile: (phoneFieldDigits) => get().isMobileVerified(phoneFieldDigits),

            clear: () => {
                set({
                    verifiedMobile: null,
                    verifiedEmail: null,
                    lastVerificationType: null,
                })
                try {
                    sessionStorage.removeItem(LEGACY_MOBILE_KEY)
                } catch {
                    /* ignore */
                }
            },
        }),
        {
            name: 'signup-verification',
            storage: createJSONStorage(() => sessionStorage),
            onRehydrateStorage: () => (state) => {
                const legacy = migrateLegacyMobileStorage()
                if (legacy && state && !state.verifiedMobile) {
                    state.setMobileVerified(legacy)
                }
            },
        },
    ),
)

/** Non-hook access for mutations / utils */
export function getSignupVerificationState() {
    return useSignupVerificationStore.getState()
}
