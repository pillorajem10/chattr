/* ===============================
    REACTIONS SERVICES
================================= */

// utils
import * as helpers from "@utils/helpers";

// requests
import { POST, GET, DELETE } from "@services/request";

/**
 * React to Post Service
 * Adds a like (or similar reaction) to a specific post.
 * Used in: reactToPostAction (PostCard)
 */
export async function reactToPostService(postId) {
  return POST(`/reactions/${postId}`);
}

/**
 * Fetch All Reactions for Post Service
 * Retrieves all reactions related to a specific post.
 * Used in: fetchAllReactsForPostAction (PostDetailsModal)
 */
export async function fetchAllReactsForPostService(postId, payload) {
  const params = helpers.convertQueryString(payload);
  return GET(`/reactions/post/${postId}?${params}`);
}

/**
 * Remove Reaction from Post Service
 * Removes the user’s reaction from a specific post.
 * Used in: removeReactFromPostAction (PostCard)
 */
export async function removeReactFromPostService(reactionId) {
  return DELETE(`/reactions/${reactionId}`);
}
