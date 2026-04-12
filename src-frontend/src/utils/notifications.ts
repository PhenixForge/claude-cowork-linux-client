/**
 * Desktop Notifications Utility
 * Handles both Web Notifications API and Tauri native notifications
 */

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  // Check if Notifications API is supported
  if (!('Notification' in window)) {
    console.log('Notifications not supported in this browser');
    return false;
  }

  // If permission already granted/denied, return the status
  if (Notification.permission !== 'default') {
    return Notification.permission === 'granted';
  }

  // Request permission
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

/**
 * Send a notification
 */
export function sendNotification(options: NotificationOptions): void {
  // Check if permission is granted
  if (Notification.permission !== 'granted') {
    console.log('Notification permission not granted');
    return;
  }

  try {
    new Notification(options.title, {
      body: options.body,
      icon: options.icon || '✨',
      tag: options.tag,
      requireInteraction: false,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

/**
 * Send task completion notification
 */
export function notifyTaskCompleted(taskDescription: string): void {
  sendNotification({
    title: '✓ Task Completed',
    body: taskDescription.substring(0, 100),
    tag: 'task-completed',
  });
}

/**
 * Send task error notification
 */
export function notifyTaskError(taskDescription: string, error: string): void {
  sendNotification({
    title: '✕ Task Failed',
    body: error.substring(0, 100),
    tag: 'task-error',
  });
}
