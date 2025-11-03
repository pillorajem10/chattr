// services api
import {
  reactToPostService,
  fetchAllReactsForPostService,
  removeReactFromPostService,
} from "@services/api/reactions";

/*===============================
        REACTIONS ACTIONS
================================*/

export const reactToPostAction = async (postId) => {
  try {
    const res = await reactToPostService(postId);
    return res;
  } catch (error) {
    throw error;
  }
};

export const fetchAllReactsForPostAction = async (postId, payload) => {
  try {
    const res = await fetchAllReactsForPostService(postId, payload);
    return res;
  } catch (error) {
    throw error;
  }
}

export const removeReactFromPostAction = async (reactionId) => {
  try {
    const res = await removeReactFromPostService(reactionId);
    return res;
  } catch (error) {
    throw error;
  }
};