/* ===============================
    NOTIFICATIONS SERVICES
================================= */

// utils
import * as helpers from "@utils/helpers";

// requests
import { GET, PATCH } from "@services/request";

/**
 * Fetch Notifications Service
 * Retrieves a list of notifications for the current user.
 * Used in: fetchNotificationsAction (NotificationsDrawer)
 */
export async function fetchNotificationsService(payload) {
  const params = helpers.convertQueryString(payload);
  return GET(`/notifications?${params}`);
}

/**
 * Mark Notification as Read Service
 * Marks a specific notification as read.
 * Used in: markNotificationAsReadAction (NotificationsDrawer)
 */
export async function markNotificationAsReadService(notificationId) {
  return PATCH(`/notifications/read/${notificationId}`);
}

/**
 * Mark All Notifications as Read Service
 * Marks all user notifications as read.
 * Used in: markAllNotificationsAsReadAction (NotificationsDrawer)
 */
export async function markAllNotificationsAsReadService() {
  return PATCH(`/notifications/read-all`);
}
