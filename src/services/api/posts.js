/* ===============================
    POSTS SERVICES
================================= */

// utils
import * as helpers from "@utils/helpers";

// requests
import { GET, POST, DELETE } from "@services/request";

export async function fetchPostsService(payload) {
  const params = helpers.convertQueryString(payload);
  return GET(`/posts?${params}`);
}

export async function createPostService(payload) {
  return POST(`/posts`, payload);
}

export async function fetchPostDetailService(postId) {
  return GET(`/posts/${postId}`);
}

export async function deletePostService(postId) {
  return DELETE(`/posts/${postId}`);
}
