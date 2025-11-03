// services api
import { sharePostService } from "@services/api/shares";

/*===============================
        SHARES ACTIONS
================================*/

export const sharePostAction = async (payload) => {
  try {
    const res = await sharePostService(payload);
    return res;
  } catch (error) {
    throw error;
  }
};
