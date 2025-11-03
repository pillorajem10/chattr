/* ===============================
    USERS SERVICES
================================= */

// utils
import * as helpers from "@utils/helpers";

// requests
import { GET } from "@services/request";

export async function fetchUsersService(payload) {
  const params = helpers.convertQueryString(payload);
  return GET(`/users?${params}`);
}

export async function fetchUserDetailService(userId) {
  return GET(`/users/${userId}`);
}
