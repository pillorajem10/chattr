/* ===============================
    AUTH SERVICES
================================= */

// requests
import { POST } from "@services/request";

export async function loginService(payload) {
  return POST("/auth/login", payload);
}

export async function registerService(payload) {
  return POST("/auth/register", payload);
}

export async function logoutService() {
  return POST("/auth/logout");
}

export async function profileService() {
  return POST("/auth/me");
}
