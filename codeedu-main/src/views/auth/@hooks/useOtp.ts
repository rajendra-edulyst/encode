import { useEffect, useRef, useState, useCallback } from "react";

const OTP_LENGTH = 4;
const RESEND_SECONDS = 180;
const OTP_EMAIL_LENGTH = OTP_LENGTH;

const SESSION_KEY = "otp-countdown-time";


export function useOtpTimer(initial: number = 60) {

  const initialCountdown = Number(sessionStorage.getItem(SESSION_KEY)) || initial;
  const [countdown, setCountdown] = useState(initialCountdown);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {

    if (countdown <= 0) {
      sessionStorage.setItem(SESSION_KEY, "0");
      return;
    }

    intervalRef.current = setInterval(() => {
      setCountdown((c) => {
        const next = c - 1;
        if (next <= 0) {
          clearInterval(intervalRef.current!);
          sessionStorage.setItem(SESSION_KEY, "0");
          return 0;
        }
        sessionStorage.setItem(SESSION_KEY, String(next));
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

  }, [countdown]);

  const resetTimer = useCallback(() => {
    setCountdown(RESEND_SECONDS);
    sessionStorage.setItem(SESSION_KEY, String(RESEND_SECONDS));
  }, []);

  return { countdown, resetTimer };
}

export const OTP_CONFIG = { OTP_LENGTH, OTP_EMAIL_LENGTH, TEST_OTP: "3615" };