/* ===============================
    MESSAGES SERVICES
================================= */

// requests
import { POST, GET, PATCH } from "@services/request";

// utils
import * as helpers from "@utils/helpers";

/**
 * Get User Chatrooms Service
 * Retrieves all chatrooms that belong to the current user.
 * Used in: getUserChatroomsAction (MessagesModal)
 */
export async function getUserChatroomsService(payload) {
  const params = helpers.convertQueryString(payload);
  return GET(`/messages?${params}`);
}

/**
 * Get Conversation Service
 * Fetches the message history within a specific chatroom.
 * Used in: getConversationAction (MessagesModal)
 */
export async function getConversationService(chatroomId) {
  return GET(`/messages/${chatroomId}`);
}

/**
 * Send Message Service
 * Sends a new message to a chatroom.
 * Used in: sendMessageAction (MessagesModal)
 */
export async function sendMessageService(payload) {
  return POST(`/messages/`, payload);
}

/**
 * Mark Conversation as Read Service
 * Marks all messages in a chatroom as read by the user.
 * Used in: markConversationAsReadAction (MessagesModal)
 */
export async function markConversationAsReadService(chatroomId) {
  return PATCH(`/messages/${chatroomId}/mark-read`);
}

/**
 * Create Chatroom Service
 * Creates a new chatroom between two users.
 * Used in: createChatroomAction (CreateChatroomModal)
 */
export async function createChatroomService(payload) {
  return POST(`/messages/create-chatroom`, payload);
}
