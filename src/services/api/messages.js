/* ===============================
    MESSAGES SERVICES
================================= */

// utils
import * as helpers from "@utils/helpers";

// requests
import { POST, GET } from "@services/request";

export async function fetchConversationService(receiverId, payload) {
  const params = helpers.convertQueryString(payload);
  return GET(`/messages/conversation/${receiverId}?${params}`);
}

export async function sendMessageService(payload) {
  return POST(`/messages`, payload);
}

export async function markConversationAsReadService(senderId) {
  return POST(`/messages/mark-read/${senderId}`);
}
