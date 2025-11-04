/* ===============================
    MESSAGES SERVICES
================================= */

// utils
import * as helpers from "@utils/helpers";

// requests
import { POST, GET, PATCH } from "@services/request";

export async function getUserChatroomsService() {
  return GET(`/messages/`);
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
