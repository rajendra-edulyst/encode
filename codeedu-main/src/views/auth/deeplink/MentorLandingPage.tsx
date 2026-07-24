import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useSessionUser } from '@/store/authStore';
import { logEventUrlAccess } from '@/services/collaborate/UrlTrackingService';
import { getMentorshipStatus } from '@/services/mentorship/mentorship';

const MentorLandingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { session, user } = useSessionUser();
    const authenticated = session.signedIn;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const processMentorLink = async () => {
            try {
                const utmSource = searchParams.get('utm');

                if (utmSource) {
                    sessionStorage.setItem('utm_source', utmSource);
                    logEventUrlAccess({
                        reference_id: 0,
                        type: 'mentor',
                        url: window.location.href,
                        utm_source: utmSource,
                    }).catch(console.error);
                }

                await new Promise((resolve) => setTimeout(resolve, 1000));

                if (!authenticated) {
                    const currentPath = location.pathname;
                    const currentSearch = location.search;
                    const fullPathForRedirect = `${currentPath}${currentSearch}`;

                    const signInParams = new URLSearchParams();
                    signInParams.set('redirectUrl', fullPathForRedirect);

                    console.log('Redirecting to Sign-In. Return URL will be:', fullPathForRedirect);
                    navigate(`/sign-in?${signInParams.toString()}`, { replace: true });
                    return;
                }


                try {


                    const res = await getMentorshipStatus();
                    const status = res?.data?.status;

                    if (status === 'approved') {
                        // User is already approved.
                        navigate('/apply-mentor', { replace: true });
                        return;
                    } else if (status === 'pending') {
                        // User is pending.
                        navigate('/apply-mentor', { replace: true });
                        return;
                    }

                    // Otherwise user has not applied or incomplete.
                    navigate('/apply-mentor', { replace: true });

                } catch (statusErr) {
                    console.error('Failed to fetch mentorship status:', statusErr);
                    navigate('/apply-mentor', { replace: true });
                }

            } catch (err) {
                console.error('Error processing mentor link:', err);
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                setError(errorMessage);
                setLoading(false);
            }
        };

        processMentorLink();
    }, [navigate, location, searchParams, authenticated, user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center max-w-md mx-4 text-black dark:text-white">
                    <div className="relative mb-8 flex justify-center">
                        <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
                        <div className="absolute top-0 w-20 h-20 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Validating...</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Please wait while we route you...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full mx-4 text-center border-t-4 border-red-500">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Routing Failed</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default MentorLandingPage;
