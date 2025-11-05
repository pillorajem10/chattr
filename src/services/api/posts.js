/* ===============================
    POSTS SERVICES
================================= */

// utils
import * as helpers from "@utils/helpers";

// requests
import { GET, POST, DELETE } from "@services/request";

/**
 * Fetch Posts Service
 * Retrieves all posts with optional query parameters.
 * Used in: fetchPostsAction (Home page)
 */
export async function fetchPostsService(payload) {
  const params = helpers.convertQueryString(payload);
  return GET(`/posts?${params}`);
}

/**
 * Create Post Service
 * Submits a new post to the server.
 * Used in: createPostAction (CreatePostModal)
 */
export async function createPostService(payload) {
  return POST(`/posts`, payload);
}

/**
 * Fetch Post Detail Service
 * Retrieves a single post and its details by ID.
 * Used in: fetchPostDetailAction (PostDetailsModal)
 */
export async function fetchPostDetailService(postId) {
  return GET(`/posts/${postId}`);
}

/**
 * Delete Post Service
 * Deletes a specific post by ID.
 * Used in: deletePostAction (future post management features)
 */
export async function deletePostService(postId) {
  return DELETE(`/posts/${postId}`);
}
