import { useEffect } from 'react';

interface NotificationOptions {
  enabled: boolean;
  title: string;
  body: string;
  triggerAt: string;
}

export function useDailyNotification({ enabled, title, body, triggerAt }: NotificationOptions) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'default') {
      void Notification.requestPermission();
    }

    if (Notification.permission !== 'granted') {
      return;
    }

    const target = new Date(triggerAt).getTime();
    const delay = Math.max(0, target - Date.now());

    const timer = window.setTimeout(() => {
      new Notification(title, { body });
    }, delay);

    return () => window.clearTimeout(timer);
  }, [enabled, title, body, triggerAt]);
}
