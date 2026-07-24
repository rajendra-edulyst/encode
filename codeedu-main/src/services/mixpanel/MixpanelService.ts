import mixpanel from "mixpanel-browser";
import type { User } from '@/@types/auth';

class MixpanelService {
  private static instance: MixpanelService;
  private isInitialized = false;
  private token: string;

  private constructor() {
    this.token = import.meta.env.VITE_MIXPANEL_TOKEN;
  }

  static getInstance(): MixpanelService {
    if (!MixpanelService.instance) {
      MixpanelService.instance = new MixpanelService();
    }

    return MixpanelService.instance;
  }

  initialize(): void {
    // Prevent multiple initializations
    if (this.isInitialized) {
      return;
    }

    // Check if token exists
    if (!this.token) {
      console.warn("🚀 Mixpanel: Token not found");
      return;
    }

    try {
      mixpanel.init(this.token, {
        debug: import.meta.env.DEV,
        track_pageview: true,
        persistence: "localStorage",
        api_host: "https://api-eu.mixpanel.com",
      });

      this.isInitialized = true;

      console.log("🚀 Mixpanel: Initialized successfully");
    } catch (error) {
      console.error("🚀 Mixpanel: Initialization failed", error);
    }
    console.log("Token:", mixpanel.get_config("token"));
    console.log("Distinct ID:", mixpanel.get_distinct_id());
  }

  identify(user: User): void {
    if (!this.isInitialized) {
      this.initialize();
      if (!this.isInitialized) return;
    }

    if (!user?.id) {
      return;
    }
    // Identify user
    mixpanel.identify(user.id.toString());
    // Set unique user ID
    mixpanel.people.set({
      $name: user.name || user.username || "",
      $email: user.email || user.username || "",
      role: user.role || "",
      organization_id: user.organization_id?.toString() || "",
      department: user.department || "",
      designation: user.designation || "",
    });
    mixpanel.register({
      user_id: user.id,
      user_name: user.name || user.username,
      email: user.email,
      role: user.role,
    });


    mixpanel.track("User Login", {
      name: user.name || user.username,
      email: user.email || user.username,
    });

    console.log("🚀 Mixpanel: User identified");
  }
  track(eventName: string, properties?: Record<string, any>): void {
    if (!this.isInitialized) {
      this.initialize();
      if (!this.isInitialized) return;
    }

    try {
      const trackProperties = {
        timestamp: new Date().toISOString(),
        ...(properties || {})
      };

      mixpanel.track(eventName, trackProperties);

      console.log(`🚀 Mixpanel Event: ${eventName}`, trackProperties);
    } catch (error) {
      console.error("🚀 Mixpanel: Failed to track event", error);
    }
  }
  reset(): void {
    if (this.isInitialized) {
      mixpanel.reset();
    }
  }

}

export const mixpanelService = MixpanelService.getInstance();