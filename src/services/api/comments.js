/* ===============================
    COMMENTS SERVICES
================================= */

// utils
import * as helpers from "@utils/helpers";

// requests
import { POST, GET, DELETE } from "@services/request";

/**
 * Comment to Post Service
 * Submits a new comment to a specific post.
 * Used in: commentToPostAction (PostDetailsModal)
 */
export async function commentToPostService(postId, payload) {
  return POST(`/comments/${postId}`, payload);
}

/**
 * Fetch Comments by Post Service
 * Retrieves all comments related to a specific post.
 * Used in: fetchCommentsByPostAction (PostDetailsModal)
 */
export async function fetchCommentsByPostService(postId, payload) {
  const params = helpers.convertQueryString(payload);
  return GET(`/comments/${postId}?${params}`);
}

/**
 * Delete Comment Service
 * Deletes a specific comment by its ID.
 * Used in: deleteCommentAction (future comment management feature)
 */
export async function deleteCommentService(commentId) {
  return DELETE(`/comments/${commentId}`);
}
