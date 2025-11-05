// services api
import {
  commentToPostService,
  fetchCommentsByPostService,
  deleteCommentService,
} from "@services/api/comments";

/*===============================
        COMMENTS ACTIONS
================================*/

/**
 * Add a comment to a post
 */
export const commentToPostAction = async (postId, comment) => {
  try {
    const res = await commentToPostService(postId, comment);
    return res;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch comments by post
 */
export const fetchCommentsByPostAction = async (postId, payload) => {
  try {
    const res = await fetchCommentsByPostService(postId, payload);
    return res;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete comment
 */
export const deleteCommentAction = async (commentId) => {
  try {
    const res = await deleteCommentService(commentId);
    return res;
  } catch (error) {
    throw error;
  }
};
