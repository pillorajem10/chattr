/* ===============================
    REACTIONS SERVICES
================================= */

// utils
import * as helpers from "@utils/helpers";

// requests
import { POST, GET, DELETE } from "@services/request";

export async function reactToPostService(postId) {
  return POST(`/reactions/${postId}`);
}

export async function fetchAllReactsForPostService(postId, payload) {
  const params = helpers.convertQueryString(payload);
  return GET(`/reactions/post/${postId}?${params}`);
}

export async function removeReactFromPostService(reactionId) {
  return DELETE(`/reactions/${reactionId}`);
}
