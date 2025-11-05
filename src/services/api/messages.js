/* ===============================
    MESSAGES SERVICES
================================= */

// requests
import { POST, GET, PATCH } from "@services/request";

// utils
import * as helpers from "@utils/helpers";

export async function getUserChatroomsService(payload) {
  const params = helpers.convertQueryString(payload);
  return GET(`/messages?${params}`);
};

export async function getConversationService(chatroomId) {
  return GET(`/messages/${chatroomId}`);
};

export async function sendMessageService(payload) {
  return POST(`/messages/`, payload);
}; 

export async function markConversationAsReadService(chatroomId) {
  return PATCH(`/messages/${chatroomId}/mark-read`);
};

export async function createChatroomService(payload) {
  return POST(`/messages/create-chatroom`, payload);
};