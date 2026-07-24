import { useRef, useEffect } from 'react';
import { googleAnalytics } from '@/services/google-analytics/GoogleAnalyticsService';
import { useSessionUser } from '@/store/authStore';

/**
 * 🚀 ~ Chatbot Analytics Hook
 * 
 * Tracks all chatbot interactions:
 * - When chatbot opens/closes
 * - User questions/messages
 * - Bot responses
 * - Course/mentor selections
 * - Quick actions
 * 
 * All events automatically include user information
 */
export const useChatbotAnalytics = () => {
  const signedIn = useSessionUser((state) => state.session.signedIn);
  const user = useSessionUser((state) => state.user);
  const sessionData = useRef<{
    sessionId: string;
    messageCount: number;
    startTime: Date;
  } | null>(null);

  /**
   * Track when chatbot is opened
   */
  const trackChatbotOpen = () => {
    if (!signedIn || !user?.id) {
      console.warn('🚀 ~ Chatbot Analytics: Cannot track - User not authenticated');
      return;
    }

    // Create new session
    const sessionId = `chatbot_${user.id}_${Date.now()}`;
    sessionData.current = {
      sessionId,
      messageCount: 0,
      startTime: new Date(),
    };

    googleAnalytics.logEvent('chatbot_open', {
      session_id: sessionId,
    });
  };

  /**
   * Track when chatbot is closed
   */
  const trackChatbotClose = () => {
    if (!signedIn || !user?.id || !sessionData.current) {
      return;
    }

    const sessionDuration = Date.now() - sessionData.current.startTime.getTime();
    const durationSeconds = Math.floor(sessionDuration / 1000);

    googleAnalytics.logEvent('chatbot_close', {
      session_id: sessionData.current.sessionId,
      message_count: sessionData.current.messageCount,
      duration_seconds: durationSeconds,
    });

    // Clear session data
    sessionData.current = null;
  };

  /**
   * Track user message/question
   */
  const trackUserMessage = (message: string, messageType?: string) => {
    if (!signedIn || !user?.id) {
      return;
    }

    if (sessionData.current) {
      sessionData.current.messageCount++;
    }

    googleAnalytics.logEvent('chatbot_message_sent', {
      session_id: sessionData.current?.sessionId || 'unknown',
      message_text: message,
      message_length: message.length,
      message_type: messageType || 'text',
      message_number: sessionData.current?.messageCount || 0,
    });
  };

  /**
   * Track bot response
   */
  const trackBotResponse = (responseText: string, responseType?: string) => {
    if (!signedIn || !user?.id) {
      return;
    }

    googleAnalytics.logEvent('chatbot_message_received', {
      session_id: sessionData.current?.sessionId || 'unknown',
      response_text: responseText.substring(0, 200), // Limit length
      response_length: responseText.length,
      response_type: responseType || 'text',
    });
  };

  /**
   * Track quick action clicks
   */
  const trackQuickAction = (actionText: string, actionCategory?: string) => {
    if (!signedIn || !user?.id) {
      return;
    }

    googleAnalytics.logEvent('chatbot_quick_action_clicked', {
      session_id: sessionData.current?.sessionId || 'unknown',
      action_text: actionText,
      action_category: actionCategory || 'general',
    });
  };

  /**
   * Track course selection from chatbot
   */
  const trackCourseSelection = (courseId: number | string, courseName: string) => {
    if (!signedIn || !user?.id) {
      return;
    }

    googleAnalytics.logEvent('chatbot_course_selected', {
      session_id: sessionData.current?.sessionId || 'unknown',
      course_id: courseId,
      course_name: courseName,
    });
  };

  /**
   * Track module selection from chatbot
   */
  const trackModuleSelection = (moduleId: number | string, moduleName: string, courseId?: number | string) => {
    if (!signedIn || !user?.id) {
      return;
    }

    googleAnalytics.logEvent('chatbot_module_selected', {
      session_id: sessionData.current?.sessionId || 'unknown',
      module_id: moduleId,
      module_name: moduleName,
      course_id: courseId,
    });
  };

  /**
   * Track mentor selection from chatbot
   */
  const trackMentorSelection = (mentorId: number | string, mentorName: string) => {
    if (!signedIn || !user?.id) {
      return;
    }

    googleAnalytics.logEvent('chatbot_mentor_selected', {
      session_id: sessionData.current?.sessionId || 'unknown',
      mentor_id: mentorId,
      mentor_name: mentorName,
    });
  };

  return {
    trackChatbotOpen,
    trackChatbotClose,
    trackUserMessage,
    trackBotResponse,
    trackQuickAction,
    trackCourseSelection,
    trackModuleSelection,
    trackMentorSelection,
    sessionId: sessionData.current?.sessionId,
    messageCount: sessionData.current?.messageCount || 0,
  };
};

