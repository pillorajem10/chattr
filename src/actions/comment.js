// services api
import {
  commentToPostService,
  fetchCommentsByPostService,
  deleteCommentService,
} from "@services/api/comments";

/*===============================
        COMMENTS ACTIONS
================================*/

export const commentToPostAction = async (postId, comment) => {
  try {
    const res = await commentToPostService(postId, comment);
    return res;
  } catch (error) {
    throw error;
  }
};

export const fetchCommentsByPostAction = async (postId) => {
  try {
    const res = await fetchCommentsByPostService(postId);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteCommentAction = async (commentId) => {
  try {
    const res = await deleteCommentService(commentId);
    return res;
  } catch (error) {
    throw error;
  }
};
