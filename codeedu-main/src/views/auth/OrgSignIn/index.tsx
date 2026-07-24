import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { orgSsoLogin } from '@/services/AuthService';
import { errorToast, successToast } from '../@lib/toastUtils';

const OrgUserSignIn: React.FC = () => {

    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const userSsoLoginMutation = useMutation({
        mutationFn: orgSsoLogin,
        onSuccess: (data) => {
            sessionStorage.setItem('token', data.email_token);
            successToast('Account Not Found', 'Please complete your profile to continue');
            navigate('/personal-info', { replace: true });
            console.log('✅ Org SSO login success:', data);
        },
        onError: (error: unknown) => {
            const axiosError = error as AxiosError<{ error?: string }>;
            const message = axiosError?.response?.data?.error ?? 'Something went wrong, please try again later';
            console.log('❌ Org SSO login error:', axiosError.response);
            errorToast('Sign In Failed', message);
        },
    });

    const hasMutated = useRef(false);

    useEffect(() => {
        if (!token || hasMutated.current) return;
        userSsoLoginMutation.mutate({ token });
        hasMutated.current = true;
    }, [token, userSsoLoginMutation]);

    return <div>Signing you in...</div>;
};

export default OrgUserSignIn;