/* ===============================
    NOTIFICATIONS SERVICES
================================= */

// utils
import * as helpers from "@utils/helpers";

// requests
import { POST, GET } from "@services/request";

export async function fetchNotificationsService(payload) {
  const params = helpers.convertQueryString(payload);
  return GET(`/notifications?${params}`);
}

export async function markNotificationAsReadService(notificationId) {
  return POST(`/notifications/${notificationId}/read`);
}

export async function markAllNotificationsAsReadService() {
  return POST(`/notifications/read-all`);
}
