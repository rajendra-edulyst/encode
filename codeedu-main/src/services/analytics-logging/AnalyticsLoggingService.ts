import { User } from "@/@types/auth";
import { AnalyticsEventType } from "@/@types/analytics-logging";

export class AnalyticsLoggingService {
  private static instance: AnalyticsLoggingService;
  private apiKey: string = "qfNIQgnMTDCtWNrs7gWSjNroUcaVwdX12IFTfYu2WQflNIEmUZUJN+2S0KIYD0x9pPffszg7WruGeIVENaJ6zg==";
  private user: User;

  private constructor(user: User) {
    this.user = user;
  }

  static init(user: User) {
    if (!this.instance) {
      this.instance = new AnalyticsLoggingService(user);
    }
    return this.instance;
  }

  logEvent({ event, meta }: { event: AnalyticsEventType; meta?: Record<string, any> }) {
    const payload = {
      user_id: this.user.id,
      email: this.user.username,
      organization_id: this.user.organization_id,
      activity_type: event,
      meta
    };

    fetch("https://activity.edulystventures.com/api/activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey
      },
      body: JSON.stringify(payload)
    });
  }
}
