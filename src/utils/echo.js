import Echo from "laravel-echo";
import Pusher from "pusher-js";
import cookie from "js-cookie";

window.Pusher = Pusher;

const token = cookie.get("token");

/**
 * Laravel Echo Configuration
 * ------------------------------------------------------------------
 * File: utils/echo.js
 *
 * Sets up the global Echo instance for handling real-time
 * event broadcasting through Pusher.
 *
 * Features:
 *  - Uses Pusher as the WebSocket driver
 *  - Reads connection details from environment variables
 *  - Automatically attaches the authenticated user's Bearer token
 *    to the private channel authorization headers
 *  - Supports secure (wss) and non-secure (ws) connections
 *
 * Usage:
 *  Import and use the exported `echo` instance wherever you need to
 *  listen or broadcast to Laravel channels (e.g., in message, reaction,
 *  or notification components).
 * ------------------------------------------------------------------
 */
export const echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_CLUSTER,
  wsHost: import.meta.env.VITE_PUSHER_HOST,
  wsPort: import.meta.env.VITE_PUSHER_PORT,
  forceTLS: false,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
  authEndpoint: "http://127.0.0.1:8000/api/broadcasting/auth",
  auth: {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  },
});
