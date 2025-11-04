/* ===============================
    NOTIFICATIONS SERVICES
================================= */

// utils
import * as helpers from "@utils/helpers";

// requests
import { GET, PATCH } from "@services/request";

export async function fetchNotificationsService(payload) {
  const params = helpers.convertQueryString(payload);
  return GET(`/notifications?${params}`);
}

export async function markNotificationAsReadService(notificationId) {
  return PATCH(`/notifications/read/${notificationId}`);
}

export async function markAllNotificationsAsReadService() {
  return PATCH(`/notifications/read-all`);
}
