import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/auth';
import { logEventUrlAccess, decryptEventId } from '@/services/collaborate/UrlTrackingService';
import { fetchEventById, fetchEventCategories } from '@/services/collaborate/EventService';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.codeedu.encode';
const APP_STORE_URL = 'https://apps.apple.com/';
const isAndroid = /Android/i.test(navigator.userAgent);
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
const isMobile = isAndroid || isIOS;

const EventLandingPage = () => {
  const { encryptedId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { authenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('Choose how you want to continue.');
  const [redirectInfo, setRedirectInfo] = useState<{
    targetPath: string;
    eventId: string;
    eventPath: string;
  } | null>(null);
  const attemptedAppOpen = useRef(false);

  useEffect(() => {
    const processEventLink = async () => {
      try {
        let eventId: string | null = null;

        if (encryptedId) {
          const decrypted = await decryptEventId(encryptedId);
          if (decrypted) {
            eventId = decrypted;
          } else {
            eventId = encryptedId;
          }
        } else {
          const utmId = searchParams.get('utm');
          if (utmId) eventId = utmId;
        }

        if (!eventId) {
          throw new Error('No event ID provided.');
        }

        await new Promise(resolve => setTimeout(resolve, 800));

        let groupName = 'Must Attend';
        let categoryName = 'Career Drive';

        try {
          const res: any = await fetchEventById(eventId);
          const eventDetails = res?.competitions_details?.program?.event_details;
          const prog = res?.competitions_details?.program;

          if (eventDetails?.event_category_name || prog?.event_category_name) {
            categoryName = eventDetails?.event_category_name || prog?.event_category_name;
            if (prog?.event_group_name || eventDetails?.event_group_name) {
              groupName = prog?.event_group_name || eventDetails?.event_group_name;
            } else {
              const categories = await fetchEventCategories();
              const category = categories.find((c: any) => c.name === categoryName);
              if (category?.group_name) groupName = category.group_name;
            }
          }
        } catch (fetchErr) {
          console.error('Failed to fetch event details:', fetchErr);
        }

        const targetParams = new URLSearchParams(searchParams);
        targetParams.set('category', categoryName);
        const basePath = groupName === 'Must Attend'
          ? `/must-attend/details/${eventId}`
          : `/agenda/details/${eventId}`;
        const targetPath = `${basePath}?${targetParams.toString()}`;
        setLoading(false);

        const currentPath = window.location.pathname;
        const currentSearch = window.location.search || '';
        const eventPath = `${currentPath}${currentSearch}`;
        setRedirectInfo({ targetPath, eventId, eventPath });

        // On desktop browsers, auto-redirect without showing the choice dialog
        if (!isMobile) {
          if (authenticated) {
            logEventUrlAccess({
              reference_id: eventId,
              type: 'event',
              url: window.location.href,
              utm_source: searchParams.get('utm') || undefined,
            }).catch(console.error);
            navigate(targetPath, { replace: true, state: { fromEventParticipation: true, eventId } });
          } else {
            const fullPath = `/event-participation/${encryptedId || eventId}${currentSearch}`;
            navigate(`/sign-in?redirectUrl=${encodeURIComponent(fullPath)}`, { replace: true });
          }
          return;
        }

        // On mobile, show the choice dialog
        setAlertMessage('Choose how you want to continue.');
        setShowAlert(true);
      } catch (err) {
        console.error('Error processing event ID:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    processEventLink();
  }, [encryptedId, searchParams, authenticated, navigate]);

  const handleOpenInWebsite = () => {
    setShowAlert(false);
    if (!redirectInfo) return;
    const { targetPath, eventId } = redirectInfo;
    if (authenticated) {
      logEventUrlAccess({
        reference_id: eventId,
        type: 'event',
        url: window.location.href,
        utm_source: searchParams.get('utm'),
      }).catch(console.error);
      navigate(targetPath, { replace: true, state: { fromEventParticipation: true, eventId } });
    } else {
      const fullPath = `/event-participation/${encryptedId || eventId}${window.location.search}`;
      navigate(`/sign-in?redirectUrl=${encodeURIComponent(fullPath)}`, { replace: true });
    }
  };

  const handleOpenInApp = () => {
    if (!redirectInfo) return;
    const { eventId, eventPath } = redirectInfo;
    const currentSearch = window.location.search || '';
    const referrer = encodeURIComponent(eventPath);

    if (!isMobile) {
      setAlertMessage('Redirecting to enCODE app on Play Store...');
      setShowAlert(true);
      window.location.href = `${PLAY_STORE_URL}&referrer=${referrer}`;
      return;
    }

    const deepLink = `appencode://event-participation/${encryptedId || eventId}${currentSearch}`;
    const fallbackUrl = encodeURIComponent(window.location.origin + eventPath);
    const androidIntent = `intent://event-participation/${encryptedId || eventId}${currentSearch}#Intent;scheme=appencode;package=com.codeedu.encode;S.browser_fallback_url=${fallbackUrl};end`;

    const redirectToStore = () => {
      setAlertMessage('App not installed. Redirecting to Play Store...');
      setShowAlert(true);
      const storeUrl = isAndroid
        ? `${PLAY_STORE_URL}&referrer=${referrer}`
        : APP_STORE_URL;
      window.location.href = storeUrl;
    };

    attemptedAppOpen.current = true;
    setAlertMessage('Opening enCODE app...');
    setShowAlert(true);

    if (isAndroid) {
      window.location.href = androidIntent;
    } else {
      window.location.href = deepLink;
    }

    setTimeout(() => {
      if (document.visibilityState !== 'hidden' && attemptedAppOpen.current) {
        redirectToStore();
      }
    }, 1400);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-900 dark:to-red-900/20 p-4">
        {showAlert && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-black px-4 py-3 text-center font-medium shadow-lg">
            {alertMessage}
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/50 rounded-full mb-6">
            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Redirect Error</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="space-y-4">
            <button
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
              onClick={() => window.location.href = '/collaborate/must-attend?category=Career%20Drive'}
            >
              Go to Career Drive Page
            </button>
            <button
              className="w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => window.location.href = '/'}
            >
              Back to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {showAlert && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-black px-4 py-3 text-center font-medium shadow-lg">
          {alertMessage}
        </div>
      )}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md mx-4">
          <div className="relative mb-6 flex justify-center">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 rounded-full" />
            <div className="absolute top-0 w-16 h-16 border-4 border-blue-600 rounded-full animate-spin border-t-transparent" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Open enCODE Event
          </h2>
          {isMobile && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Choose how you want to continue.
            </p>
          )}
          {isMobile && redirectInfo && (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleOpenInApp}
                className="px-5 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Open in app
              </button>
              <button
                type="button"
                onClick={handleOpenInWebsite}
                className="px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Continue in the browser
              </button>
            </div>
          )}
          {!loading && !redirectInfo && (
            <button
              type="button"
              onClick={handleOpenInWebsite}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Continue in the browser
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventLandingPage;
