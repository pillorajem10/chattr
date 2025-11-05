/* ===============================
    AUTH SERVICES
================================= */

// requests
import { POST } from "@services/request";

/**
 * Login Service
 * Sends user credentials to the API for authentication.
 * Used in: loginAction (Login page)
 */
export async function loginService(payload) {
  return POST("/auth/login", payload);
}

/**
 * Register Service
 * Sends user registration data to create a new account.
 * Used in: registerAction (Register page)
 */
export async function registerService(payload) {
  return POST("/auth/register", payload);
}

/**
 * Logout Service
 * Logs the current user out of the system.
 * Used in: logoutAction (Sidebar / Footer)
 */
export async function logoutService() {
  return POST("/auth/logout");
}

/**
 * Profile Service
 * Fetches the currently authenticated user’s profile data.
 * Used in: fetchProfileAction (global auth state)
 */
export async function profileService() {
  return POST("/auth/me");
}
