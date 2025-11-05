// services api
import {
  reactToPostService,
  fetchAllReactsForPostService,
  removeReactFromPostService,
} from "@services/api/reactions";

/*===============================
        REACTIONS ACTIONS
================================*/

/**
 * React to post
 */
export const reactToPostAction = async (postId) => {
  try {
    const res = await reactToPostService(postId);
    return res;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch all reactions for post
 */
export const fetchAllReactsForPostAction = async (postId, payload) => {
  try {
    const res = await fetchAllReactsForPostService(postId, payload);
    return res;
  } catch (error) {
    throw error;
  }
};

/**
 * Remove reaction from post
 */
export const removeReactFromPostAction = async (reactionId) => {
  try {
    const res = await removeReactFromPostService(reactionId);
    return res;
  } catch (error) {
    throw error;
  }
};
