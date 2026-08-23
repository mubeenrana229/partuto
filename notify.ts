/**
 * FILE: lib/notify.ts
 * Ported from the web app's browser Notification API helper. React Native has no
 * `window.Notification` — real push would use `expo-notifications`, but that needs
 * a dev build (not Expo Go) and a project push token, so this keeps the same
 * function signatures as the original and no-ops safely. Swap the body of
 * `notifyLocal` for `Notifications.scheduleNotificationAsync(...)` once you've
 * added the `expo-notifications` config plugin to app.json.
 */

export function canNotify() {
  return false;
}

export function notificationPermission(): "granted" | "denied" | "default" | "unsupported" {
  return "unsupported";
}

export async function requestNotificationPermission() {
  return "unsupported" as const;
}

/** No-op placeholder — new messages still land in the in-app Inbox/notifications list via the store. */
export function notifyLocal(_title: string, _body: string, _href?: string) {
  // Intentionally empty in this Expo Go-compatible build.
}
