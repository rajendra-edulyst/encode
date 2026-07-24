import { useState } from 'react'
import { z } from 'zod'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import ActionLink from '@/components/shared/ActionLink'
import { useThemeStore } from '@/store/themeStore'
import { useNavigate } from 'react-router-dom'
import { verifynewpasswordOtp, ResetPassword } from '@/services/auth/AccountService'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

type SetNewPasswordProps = {
    signInUrl?: string
}

const otpSchema = z.string().min(1, 'OTP is required')
const passwordSchema = z
    .object({
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })
  
const REGEXP_ONLY_ALPHANUMERIC = "^[a-zA-Z0-9]*$"

export const SetNewPasswordBase = ({ signInUrl = '/sign-in' }: SetNewPasswordProps) => {
    const [otp, setOtp] = useState('')
    const [otpVerified, setOtpVerified] = useState(false)
    const [otpError, setOtpError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' })
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()
    const mode = useThemeStore((state) => state.mode)

    const handleOtpVerify = async () => {
        setOtpError(null)
        const result = otpSchema.safeParse(otp)
        if (!result.success) {
            setOtpError(result.error.errors[0].message)
            return
        }

        setLoading(true)
        try {
            const res = await verifynewpasswordOtp(otp)
            if (res.status === 1) {
                setOtpVerified(true)
                setMessage(null)
            } else {
                setMessage(res.error?.[0] || 'Invalid OTP')
            }
        } catch (e) {
            setMessage('Network error, Please try again')
            console.log(e)
        }
        setLoading(false)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value })
        setPasswordError(null)
    }

    const handleSetPassword = async () => {
        setPasswordError(null)
        const result = passwordSchema.safeParse(passwords)
        if (!result.success) {
            setPasswordError(result.error.errors[0].message)
            return
        }

        setLoading(true)
        try {
            const res = await ResetPassword(otp, result.data.password, result.data.confirmPassword)
            if (res.status === 1) {
                setSuccess(true)
                setTimeout(() => navigate(signInUrl), 2000)
            } else {
                setMessage(res.error?.[0] || 'Password reset failed')
            }
        } catch (e) {
            setMessage('Network error')
            console.log(e)
        }
        setLoading(false)
    }

    return (
        <div>
            <div className="mb-6 mt-0">
                <h3 className="mb-2">Set New Password</h3>
                <p className="font-semibold heading-text">
                    Enter the OTP sent to your email and set a new password.
                </p>
            </div>

            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}

            {!otpVerified && <div className="mb-4">
                <label className="block mb-1 font-semibold">OTP</label>
                {/* <input
                    type="text"
                    value={otp}
                    disabled={otpVerified}
                    className={`input p-3 bg-gray-100 focus:bg-gray-50 focus:border-primary focus:ring-0 w-full ${otpVerified ? 'cursor-not-allowed disabled:opacity-50' : ''}`}
                    placeholder="Enter OTP"
                    onChange={(e) => setOtp(e.target.value)}
                /> */}
                <InputOTP maxLength={6} value={otp} className="mb-4" onChange={(value) => setOtp(value)}
                 pattern={REGEXP_ONLY_ALPHANUMERIC}
                 inputMode="text"
                >
                    <InputOTPGroup className='flex justify-between gap-2'>
                        <InputOTPSlot index={0} 
                        className='md:w-16 border-gray-500 text-gray-500 bg-gray-700 focus-visible:ring-0 ring-[#b02a5b] rounded-lg border' />
                        <InputOTPSlot index={1} className='md:w-16 border-gray-500 text-gray-500 bg-gray-700 focus-visible:ring-0 ring-[#b02a5b] rounded-lg border' />
                        <InputOTPSlot index={2} className='md:w-16 border-gray-500 text-gray-500 bg-gray-700 focus-visible:ring-0 ring-[#b02a5b] rounded-lg border' />
                        <InputOTPSlot index={3} className='md:w-16 border-gray-500 text-gray-500 bg-gray-700 focus-visible:ring-0 ring-[#b02a5b] rounded-lg border' />
                        <InputOTPSlot index={4} className='md:w-16 border-gray-500 text-gray-500 bg-gray-700 focus-visible:ring-0 ring-[#b02a5b] rounded-lg border' />
                        <InputOTPSlot index={5} className='md:w-16 border-gray-500 text-gray-500 bg-gray-700 focus-visible:ring-0 ring-[#b02a5b] rounded-lg border' />
                    </InputOTPGroup>
                </InputOTP>
                {otpError && <div className="text-red-500 text-sm mt-1">{otpError}</div>}
                {!otpVerified && (
                    <Button
                        block
                        variant="solid"
                        type="button"
                        loading={loading}
                        className='bg-[#d63384] hover:bg-[#b02a5b] text-white w-full rounded-lg px-8 py-2 font-semibold mt-6'
                        onClick={handleOtpVerify}
                    >
                        Verify OTP
                    </Button>
                )}
            </div>}

            {otpVerified && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSetPassword()
                    }}
                >
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={passwords.password}
                                className="input p-3 bg-gray-100 focus:bg-gray-50 focus:border-primary focus:ring-0 w-full pr-10"
                                placeholder="Enter new password"
                                onChange={handlePasswordChange}
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? (
                                    // Eye open icon
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    // Eye closed icon
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.7 6.7A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.043 5.197M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            className="input p-3 bg-gray-100 focus:bg-gray-50 focus:border-primary focus:ring-0 w-full"
                            placeholder="Confirm new password"
                            onChange={handlePasswordChange}
                        />
                    </div>
                    {passwordError && <div className="text-red-500 text-sm mb-2">{passwordError}</div>}
                    <Button block variant="solid" type="submit" loading={loading} className='bg-[#d63384] hover:bg-[#b02a5b] text-white w-full rounded-lg px-8 py-2 font-semibold'>
                        Set New Password
                    </Button>
                    {success && (
                        <Alert showIcon className="mt-4" type="success">
                            Password set successfully! Redirecting...
                        </Alert>
                    )}
                </form>
            )}

            <div className="mt-4 text-center">
                <span>Back to </span>
                <ActionLink to={signInUrl} className="heading-text font-bold text-[#d63384]" themeColor={false}>
                    Sign in
                </ActionLink>
            </div>
        </div>
    )
}

const SetNewPassword = () => {
    return <SetNewPasswordBase />
}

export default SetNewPassword