// services api
import {
  getUserChatroomsService,
  getConversationService,
  sendMessageService,
  markConversationAsReadService,
  createChatroomService,
} from "@services/api/messages";

/*===============================
        MESSAGES ACTIONS
================================*/

/**
 * Get user chatrooms
 */
export const getUserChatroomsAction = async (payload) => {
  try {
    const res = await getUserChatroomsService(payload);
    return res;
  } catch (error) {
    throw error;
  }
};

/**
 * Get conversation messages
 */
export const getConversationAction = async (chatroomId) => {
  try {
    const res = await getConversationService(chatroomId);
    return res;
  } catch (error) {
    throw error;
  }
};

/**
 * Send message
 */
export const sendMessageAction = async (payload) => {
  try {
    const res = await sendMessageService(payload);
    return res;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark conversation as read
 */
export const markConversationAsReadAction = async (chatroomId) => {
  try {
    const res = await markConversationAsReadService(chatroomId);
    return res;
  } catch (error) {
    throw error;
  }
};

/**
 * Create new chatroom
 */
export const createChatroomAction = async (payload) => {
  try {
    const res = await createChatroomService(payload);
    return res;
  } catch (error) {
    throw error;
  }
};
