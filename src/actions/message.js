// services api
import {
  fetchConversationService,
  sendMessageService,
  markConversationAsReadService,
} from "@services/api/messages";

/*===============================
        MESSAGES ACTIONS
================================*/

export const fetchConversationAction = async (receiverId, payload) => {
  try {
    const res = await fetchConversationService(receiverId, payload);
    return res;
  } catch (error) {
    throw error;
  }
};

export const sendMessageAction = async (payload) => {
  try {
    const res = await sendMessageService(payload);
    return res;
  } catch (error) {
    throw error;
  }
};

export const markConversationAsReadAction = async (senderId) => {
  try {
    const res = await markConversationAsReadService(senderId);
    return res;
  } catch (error) {
    throw error;
  }
};
