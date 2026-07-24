import Logo from '@/components/template/Logo';
import Alert from '@/components/ui/Alert';
import SendOtp from '@/views/auth/Register/components/SendOtp';
import ActionLink from '@/components/shared/ActionLink';
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage';
import { useThemeStore } from '@/store/themeStore';
import { useEffect, useState } from 'react';
import SignUpForm from '@/views/auth/Register/components/SignUpForm';

type SignUpProps = {
    disableSubmit?: boolean;
    signInUrl?: string;
};

export const SignUpBase = ({
    signInUrl = '/sign-in',
    disableSubmit,
}: SignUpProps) => {
    const [message, setMessage] = useTimeOutMessage();
    const [successMessage, setSuccessMessage] = useTimeOutMessage();
    const mode = useThemeStore((state) => state.mode);
    const [verifyOtp, setVerifyOtp] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isSendOtp, setIsSendOtp] = useState<boolean>(false)

    useEffect(() => {
        const verifiedOtpEmail = sessionStorage.getItem('verifiedOtpEmail');
        if (verifiedOtpEmail) {
            setEmail(verifiedOtpEmail);
            setName(sessionStorage.getItem('otpName') ?? '');
            setVerifyOtp(true);
        }
    }, []);


    const NotYou = () => {
        sessionStorage.removeItem('verifiedOtpEmail');
        sessionStorage.removeItem('otpEmail')
        sessionStorage.removeItem('otpName')
        sessionStorage.removeItem('otpTimestamp')
        setEmail('');
        setVerifyOtp(false);
        setIsSendOtp(false)
    }

    return (
        <>
            <div className="mb-0">
                <Logo type="streamline" mode={mode} imgClass="mx-auto" logoWidth={250} />
            </div>
            <div className="mb-0">

                {email && <h3 className="mb-1">
                    Welcome, {name}
                </h3>}
                {
                    !email && <h3 className="mb-1">
                        Sign Up
                    </h3>
                }
                {email && <p className="font-semibold heading-text">
                    {email}
                    {!verifyOtp && <a href='#' className='text-blue-500' onClick={NotYou}> (Not you?)</a>}
                </p>}
                <p className='mt-3'>
                    Please complete your registration by entering some details below.
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            {successMessage && (
                <Alert showIcon className="mb-4" type="success">
                    <span className="break-all">{successMessage}</span>
                </Alert>
            )}
            {!verifyOtp ? (
                <SendOtp
                    disableSubmit={disableSubmit}
                    setMessage={setMessage}
                    setSuccessMessage={setSuccessMessage}
                    setEmail={setEmail}
                    setVerifyOtp={setVerifyOtp}
                    email={email}
                    isSendOtp={isSendOtp}
                    setIsSendOtp={setIsSendOtp}
                    name={name}
                    setName={setName}
                />
            ) : (
                <SignUpForm
                    disableSubmit={disableSubmit}
                    setMessage={setMessage}
                    email={email}
                    name={name}
                />
            )}
            <div className="mt-6 text-center">
                <span>Already have an account? </span>
                <ActionLink to={signInUrl} className="heading-text font-bold" themeColor={false}>
                    Sign in
                </ActionLink>
            </div>
        </>
    );
};

const SignUp = () => {
    return <SignUpBase />;
};

export default SignUp;