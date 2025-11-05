// services api
import {
  fetchPostsService,
  createPostService,
  fetchPostDetailService,
  deletePostService,
} from "@services/api/posts";

/*===============================
          POSTS ACTIONS
================================*/

/**
 * Fetch posts
 */
export const fetchPostsAction = async (payload) => {
  try {
    const res = await fetchPostsService(payload);
    return res;
  } catch (error) {
    throw error;
  }
};

/**
 * Create post
 */
export const createPostAction = async (payload) => {
  try {
    const res = await createPostService(payload);
    return res;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch post detail
 */
export const fetchPostDetailAction = async (postId) => {
  try {
    const res = await fetchPostDetailService(postId);
    return res;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete post
 */
export const deletePostAction = async (postId) => {
  try {
    const res = await deletePostService(postId);
    return res;
  } catch (error) {
    throw error;
  }
};
