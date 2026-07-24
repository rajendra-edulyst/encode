import { useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { sendOtp, verifyOtp } from '@/services/auth/AccountService'

interface SendOtpProps {
    disableSubmit?: boolean
    setMessage?: (message: string) => void
    setSuccessMessage?: (message: string) => void
    setEmail: (email: string) => void
    setVerifyOtp: (verifyOtp: boolean) => void
    email: string,
    setIsSendOtp: (isSendOtp: boolean) => void
    isSendOtp: boolean
    name: string
    setName: (name: string) => void
}

type SendOtpSchema = { email: string, name: string }
type SendOtpOtpSchema = { otp: string }

const validationSchema: ZodType<SendOtpSchema> = z.object({
    name: z.string().nonempty({ message: 'Please enter your name' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
})

const validationOtpSchema: ZodType<SendOtpOtpSchema> = z.object({
    otp: z.string().min(4, { message: 'Please enter your OTP' }),
})

const SendOtp = (props: SendOtpProps) => {
    const { disableSubmit = false, setMessage, setSuccessMessage, setEmail, setVerifyOtp, email, isSendOtp, setIsSendOtp, setName } = props
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const [timer, setTimer] = useState<number>(0)
    const [isResending, setIsResending] = useState<boolean>(false)

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('otpEmail')
        const storedName = sessionStorage.getItem('otpName')
        const storedTime = sessionStorage.getItem('otpTimestamp')

        if (storedEmail) {
            setEmail(storedEmail)
            setName(storedName ?? '');
            setIsSendOtp(true)
        }

        if (storedTime) {
            const elapsedTime = Math.floor((Date.now() - parseInt(storedTime)) / 1000)
            if (elapsedTime < 60) {
                setTimer(60 - elapsedTime)
            }
        }
    }, [])

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [timer])

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SendOtpSchema>({
        resolver: zodResolver(validationSchema),
    })

    const {
        handleSubmit: handleSubmitOtp,
        formState: { errors: errorsOtp },
        control: controlOtp,
    } = useForm<SendOtpOtpSchema>({
        resolver: zodResolver(validationOtpSchema),
    })

    const onSendOtp = async (values: SendOtpSchema) => {
        const { email, name } = values
        if (!disableSubmit) {
            setSubmitting(true)
            const result = await sendOtp(email)
            if (result?.status === 0) {
                setMessage?.(result.message)
                setSubmitting(false)
                return
            }
            if (result?.status === 1) {
                setIsSendOtp(true)
                setEmail(email)
                setName(name);
                setSuccessMessage?.(`Please put the OTP sent to ${email}`)
                sessionStorage.setItem('otpEmail', email)
                sessionStorage.setItem('otpName', name)
                sessionStorage.setItem('otpTimestamp', Date.now().toString())
                setTimer(60) // Start countdown
            }
            setSubmitting(false)
        }
    }

    const onVerifyOtp = async (values: SendOtpOtpSchema) => {
        const { otp } = values
        if (!disableSubmit) {
            setSubmitting(true)
            const result = await verifyOtp(email, otp)
            if (result?.status === 0) {
                setMessage?.('OTP verification failed, Please enter a valid OTP')
                setSubmitting(false)
                return
            }
            if (result?.status === 1) {
                setVerifyOtp(true)
                setSuccessMessage?.('OTP verified successfully')
                sessionStorage.setItem('verifiedOtpEmail', email);
            }
            setSubmitting(false)
        }
    }

    const resendOtp = async () => {
        if (isResending) {
            return
        }
        setIsResending(true);
        const result = await sendOtp(email)
        if (result?.status === 0) {
            setMessage?.(result.message)
            setIsResending(false)
            return
        }
        if (result?.status === 1) {
            setSuccessMessage?.(`Please put the OTP sent to ${email}`)
            sessionStorage.setItem('otpTimestamp', Date.now().toString())
            setTimer(60)
        }
        setIsResending(false)
    }

    return (
        <div>
            {!isSendOtp && (
                <Form onSubmit={handleSubmit(onSendOtp)}>

                    <FormItem label="Name" invalid={Boolean(errors.name)} errorMessage={errors.name?.message}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input type="text" placeholder="Name" autoComplete="off" {...field} />
                            )}
                        />
                    </FormItem>

                    <FormItem label="Email" invalid={Boolean(errors.email)} errorMessage={errors.email?.message}>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input type="email" placeholder="Email" autoComplete="off" {...field} readOnly={isSendOtp} />
                            )}
                        />
                    </FormItem>
                    <Button block loading={isSubmitting} variant="solid" type="submit">
                        {isSubmitting ? 'Generating OTP...' : 'Generate OTP'}
                    </Button>
                </Form>
            )}

            {isSendOtp && (
                <>
                    <Form onSubmit={handleSubmitOtp(onVerifyOtp)}>
                        <FormItem label="OTP" invalid={Boolean(errorsOtp.otp)} errorMessage={errorsOtp.otp?.message}>
                            <Controller
                                name="otp"
                                control={controlOtp}
                                render={({ field }) => (
                                    <Input type="text" placeholder="Enter OTP" autoComplete="off" {...field} />
                                )}
                            />
                        </FormItem>
                        <Button block loading={isSubmitting} variant="solid" type="submit">
                            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                        </Button>
                    </Form>
                    <div className="mt-4 text-center">
                        {timer > 0 ? (
                            <p className="text-gray-500">Resend OTP in {timer}s</p>
                        ) : (
                            <a className="text-blue-500" href='#'
                                onClick={resendOtp}>
                                {isResending ? 'Resending...' : 'Resend OTP'}
                            </a>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default SendOtp