import ReactGA from 'react-ga4';
import type { User } from '@/@types/auth';
import { useSessionUser } from '@/store/authStore';

/**
 * 🚀 ~ Google Analytics Service
 * 
 * This service handles all Google Analytics 4 (GA4) tracking.
 * It automatically includes user information in every event.
 * 
 * Features:
 * - Automatic user identification
 * - Daily session tracking
 * - User details in every event
 * - Works for returning users (already logged in)
 */
class GoogleAnalyticsService {
  private static instance: GoogleAnalyticsService;
  private measurementId: string;
  private isInitialized: boolean = false;

  private constructor() {
    // Get GA4 Measurement ID from environment variable or use default
    this.measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-9B2708D05B';
  }

  /**
   * Get singleton instance
   */
  static getInstance(): GoogleAnalyticsService {
    if (!GoogleAnalyticsService.instance) {
      GoogleAnalyticsService.instance = new GoogleAnalyticsService();
    }
    return GoogleAnalyticsService.instance;
  }

  /**
   * Initialize Google Analytics
   * Call this once when app starts
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    if (!this.measurementId) {
      console.warn('🚀 ~ Google Analytics: Measurement ID not found');
      return;
    }

    try {
      ReactGA.initialize(this.measurementId, {
        testMode: import.meta.env.VITE_APP_DEBUG === 'true',
      });
      
      this.isInitialized = true;
      
      // If user is already logged in (from previous session), set them immediately
      this.syncUserFromStore();
      
      console.log('🚀 ~ Google Analytics: Initialized successfully');
    } catch (error) {
      console.error('🚀 ~ Google Analytics: Failed to initialize', error);
    }
  }

  /**
   * Get current user from Zustand store
   * This ensures we always have the latest user data
   */
  private getCurrentUserFromStore(): User | null {
    try {
      const state = useSessionUser.getState();
      const user = state.user;
      const signedIn = state.session.signedIn;
      
      // Check if user is actually logged in and has valid ID
      if (signedIn && user?.id) {
        return user;
      }
      return null;
    } catch (error) {
      console.error('🚀 ~ Google Analytics: Error getting user from store', error);
      return null;
    }
  }

  /**
   * Sync user from store (useful when app loads and user is already logged in)
   */
  syncUserFromStore(): void {
    const user = this.getCurrentUserFromStore();
    if (user) {
      this.setUser(user);
    }
  }

  /**
   * Set user information in Google Analytics
   * This ensures all events include user details
   */
  setUser(user: User): void {
    if (!this.isInitialized) {
      this.initialize();
    }

    // Set user properties in GA4 (these persist across all events)
    ReactGA.set({
      user_id: user.id?.toString() || '',
      user_name: user.name || user.username || '',
      user_email: user.email || user.username || '',
      user_role: user.role || '',
      organization_id: user.organization_id?.toString() || '',
      department: user.department || '',
      designation: user.designation || '',
    });

    // Track daily session for returning users
    this.trackDailySession(user);
  }

  /**
   * Clear user information when user logs out
   */
  clearUser(): void {
    ReactGA.set({ 
      user_id: null,
      user_name: null,
      user_email: null,
      user_role: null,
      organization_id: null,
    });
  }

  /**
   * Get user details to include in every event
   * Always gets fresh data from store
   */
  private getUserDetails(): Record<string, any> {
    const user = this.getCurrentUserFromStore();
    
    if (!user?.id) {
      return {};
    }

    return {
      user_id: user.id,
      user_name: user.name || user.username || '',
      user_email: user.email || user.username || '',
      user_role: user.role || '',
      organization_id: user.organization_id || '',
      department: user.department || '',
      designation: user.designation || '',
    };
  }

  /**
   * Log custom event with user context ALWAYS included
   * 
   * @param eventName - Name of the event (e.g., 'chatbot_open', 'course_viewed')
   * @param eventParams - Additional event parameters
   */
  logEvent(eventName: string, eventParams?: Record<string, any>): void {
    if (!this.isInitialized) {
      this.initialize();
    }

    // ALWAYS get current user details and include in every event
    const userDetails = this.getUserDetails();
    
    // Only log if user is authenticated
    if (!userDetails.user_id) {
      console.warn(`🚀 ~ Google Analytics: Event "${eventName}" not tracked - User not authenticated`);
      return;
    }

    // Merge user details with event params (user details take precedence)
    const params = {
      ...eventParams,
      ...userDetails, // User details always included
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0], // Daily tracking
    };

    try {
      ReactGA.event(eventName, params);
    } catch (error) {
      console.error('🚀 ~ Google Analytics: Failed to log event', error);
    }
  }

  /**
   * Track daily user session
   * Works for returning users - only tracks once per day
   */
  trackDailySession(user?: User): void {
    // Get user from parameter or store
    const currentUser = user || this.getCurrentUserFromStore();
    
    if (!currentUser?.id) {
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const storageKey = `ga_session_date_${currentUser.id}`;
    const lastSessionDate = localStorage.getItem(storageKey);

    // Track new daily session if it's a new day (or first time)
    if (lastSessionDate !== today) {
      this.logEvent('daily_session_start', {
        date: today,
        previous_session_date: lastSessionDate || 'none',
        is_returning_user: !!lastSessionDate,
      });
      
      localStorage.setItem(storageKey, today);
    }
  }

  /**
   * Track page view with user context
   */
  trackPageView(path: string, title?: string): void {
    if (!this.isInitialized) {
      this.initialize();
    }

    const userDetails = this.getUserDetails();
    
    // Only track if user is authenticated
    if (!userDetails.user_id) {
      return;
    }

    ReactGA.send({
      hitType: 'pageview',
      page: path,
      title: title || document.title,
      ...userDetails,
    });
  }
}

// Export singleton instance
export const googleAnalytics = GoogleAnalyticsService.getInstance();

