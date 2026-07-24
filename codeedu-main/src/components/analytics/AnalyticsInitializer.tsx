import { useEffect } from 'react';
import { useSessionUser } from '@/store/authStore';
import { googleAnalytics } from '@/services/google-analytics/GoogleAnalyticsService';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';



export const AnalyticsInitializer = () => {
  const signedIn = useSessionUser((state) => state.session.signedIn);
  const user = useSessionUser((state) => state.user);

  // Initialize GA on mount
  useEffect(() => {
    googleAnalytics.initialize();
    mixpanelService.initialize();
  }, []);

  // Sync user whenever user state changes
  useEffect(() => {
    if (signedIn && user?.id) {
      // Small delay to ensure state is stable
      const timer = setTimeout(() => {
        googleAnalytics.setUser(user);
        mixpanelService.identify(user);
      }, 100);

      return () => clearTimeout(timer);
    } else if (!signedIn) {
      googleAnalytics.clearUser();
      mixpanelService.reset();
    }
  }, [signedIn, user?.id, user?.name]);

  return null;
};

