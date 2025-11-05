// services api
import {
    fetchUsersService,
    fetchUserDetailService,
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

export const fetchUserDetailAction = async (userId) => {
  try {
    const res = await fetchUserDetailService(userId);
    return res;
  } catch (error) {
    throw error;
  }
};
