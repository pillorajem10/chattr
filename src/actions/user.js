// services api
import {
    fetchUsersService,
    fetchUserDetailService,
} from "@services/api/users";

/*===============================
        USERS ACTIONS
================================*/

export const fetchUsersAction = async () => {
  try {
    const res = await fetchUsersService();
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
