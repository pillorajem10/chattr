// services api
import {
  fetchPostsService,
  createPostService,
  fetchPostDetailService,
  deletePostService,
} from "@services/api/posts";

/*===============================
         POSTS ACTIONS
=================================*/

export const fetchPostsAction = async (payload) => {
  try {
    const res = await fetchPostsService(payload);
    return res;
  } catch (error) {
    throw error;
  }
};

export const createPostAction = async (payload) => {
  try {
    const res = await createPostService(payload);
    return res;
  } catch (error) {
    throw error;
  }
};

export const fetchPostDetailAction = async (postId) => {
  try {
    const res = await fetchPostDetailService(postId);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deletePostAction = async (postId) => {
  try {
    const res = await deletePostService(postId);
    return res;
  } catch (error) {
    throw error;
  }
};