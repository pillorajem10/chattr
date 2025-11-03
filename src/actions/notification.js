// services api
import { 
    fetchNotificationsService, 
    markNotificationAsReadService, 
    markAllNotificationsAsReadService 
} from "@services/api/notifications";

/*===============================
        NOTIFICATIONS ACTIONS
================================*/

export const fetchNotificationsAction = async (userId) => {
  try {
    const res = await fetchNotificationsService(userId);
    return res;
  } catch (error) {
    throw error;
  }
};

export const markNotificationAsReadAction = async (notificationId) => {
  try {
    const res = await markNotificationAsReadService(notificationId);
    return res;
  } catch (error) {
    throw error;
  }
};

export const markAllNotificationsAsReadAction = async () => {
  try {
    const res = await markAllNotificationsAsReadService();
    return res;
  } catch (error) {
    throw error;
  }
};