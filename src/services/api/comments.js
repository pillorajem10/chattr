/* ===============================
    COMMENTS SERVICES
================================= */

// utils
import * as helpers from "@utils/helpers";

// requests
import { POST, GET, DELETE } from "@services/request";

export async function commentToPostService(postId, payload) {
  return POST(`/comments/${postId}`, payload);
}

export async function fetchCommentsByPostService(postId, payload) {
  const params = helpers.convertQueryString(payload);
  return GET(`/comments/${postId}?${params}`);
}

export async function deleteCommentService(commentId) {
  return DELETE(`/comments/${commentId}`);
}
