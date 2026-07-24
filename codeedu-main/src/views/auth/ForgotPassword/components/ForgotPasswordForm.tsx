import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { apiForgotPassword } from '@/services/AuthService'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import { AxiosError } from 'axios'

interface ForgotPasswordFormProps extends CommonProps {
    emailSent: boolean
    setEmailSent?: (compplete: boolean) => void
    setMessage?: (message: string) => void
}

type ForgotPasswordFormSchema = {
    email: string
}

const validationSchema: ZodType<ForgotPasswordFormSchema> = z.object({
    email: z.string().email().min(5),
})

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {

    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const { className, setMessage, setEmailSent, emailSent, children } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ForgotPasswordFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const onForgotPassword = async (values: ForgotPasswordFormSchema) => {
        const { email } = values
        setSubmitting(true);
        try {
            const resp = await apiForgotPassword<boolean>({ email })
            if (resp) {
                setSubmitting(false)
                setEmailSent?.(true)
            }
        } 
        // catch (errors) {
        //     setMessage?.(
        //         typeof errors === 'string' ? errors : 'Some error occured!',
        //     )
        //     setSubmitting(false)
        // }
         catch (err: unknown) {
            if (typeof err === "string") {
                setMessage?.(err);
            } else if (err instanceof AxiosError) {
                const apiError = err.response?.data?.error;
                setMessage?.(
                    Array.isArray(apiError) ? apiError.join(", ") : apiError || "Some error occurred!"
                );
            } else {
                setMessage?.("Some error occurred!");
            }
        }finally{
            setSubmitting(false)
        }
    }

//     const onForgotPassword = async (values: ForgotPasswordFormSchema) => {
//     const { email } = values;
//     setSubmitting(true);

//     try {
//         const resp = await apiForgotPassword<boolean>({ email });
//         if (resp) {
//             setEmailSent?.(true);
//         }
//     } catch (err: unknown) {
//         let message = "Some error occurred!";
        
//         if (err instanceof AxiosError) {
//             const apiError = err.response?.data?.error;
//             if (apiError) {
//                 message = Array.isArray(apiError) ? apiError.join(", ") : apiError;
//             }
//         } else if (typeof err === "string") {
//             message = err;
//         }

//         setMessage?.(message);
//     } finally {
//         setSubmitting(false);
//     }
// };

    return (
        <div className={className}>
            {!emailSent ? (
                <Form onSubmit={handleSubmit(onForgotPassword)}>
                    <FormItem
                        label="Email"
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <Button
                        block
                        loading={isSubmitting}
                        variant="solid"
                        type="submit"
                        className='bg-[#d63384] hover:bg-[#b02a5b] text-white w-full rounded-lg px-8 py-2 font-semibold'
                    >
                        {isSubmitting ? 'Submiting...' : 'Submit'}
                    </Button>
                </Form>
            ) : (
                <>{children}</>
            )}
        </div>
    )
}

export default ForgotPasswordForm
