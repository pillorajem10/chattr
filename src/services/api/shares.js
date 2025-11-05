/* ===============================
    SHARES SERVICES
================================= */

// requests
import { POST } from "@services/request";

/**
 * Share Post Service
 * Creates a shared version of a post with an optional caption.
 * Used in: sharePostAction (ShareModal)
 */
export async function sharePostService(postId, payload) {
  return POST(`/shares/${postId}`, payload);
}
