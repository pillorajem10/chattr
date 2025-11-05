/* ===============================
    USERS SERVICES
================================= */

// utils
import * as helpers from "@utils/helpers";

// requests
import { GET } from "@services/request";

/**
 * Fetch Users Service
 * Retrieves a paginated list of users with optional search parameters.
 * Used in: fetchUsersAction (CreateChatroomModal)
 */
export async function fetchUsersService(payload) {
  const params = helpers.convertQueryString(payload);
  return GET(`/users?${params}`);
}
