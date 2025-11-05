// services api
import { sharePostService } from "@services/api/shares";

/*===============================
         SHARES ACTIONS
================================*/

/**
 * Share post
 */
export const sharePostAction = async (postId, payload) => {
  try {
    const res = await sharePostService(postId, payload);
    return res;
  } catch (error) {
    throw error;
  }
};
