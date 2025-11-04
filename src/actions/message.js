// services api
import {
  getUserChatroomsService,
  getConversationService,
  sendMessageService,
  markConversationAsReadService,
} from "@services/api/messages";

/*===============================
        MESSAGES ACTIONS
================================*/

export const getUserChatroomsAction = async () => {
  try {
    const res = await getUserChatroomsService();
    return res;
  } catch (error) {
    throw error;
  }
};

export const getConversationAction = async (chatroomId) => {
  try {
    const res = await getConversationService(chatroomId);
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

export const markConversationAsReadAction = async (chatroomId) => {
  try {
    const res = await markConversationAsReadService(chatroomId);
    return res;
  } catch (error) {
    throw error;
  }
};