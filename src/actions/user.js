// services api
import {
    fetchUsersService,
} from "@services/api/users";

/*===============================
        USERS ACTIONS
================================*/

export const fetchUsersAction = async (payload) => {
  try {
    const res = await fetchUsersService(payload);
    return res;
  } catch (error) {
    throw error;
  }
};
