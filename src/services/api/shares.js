/* ===============================
    SHARES SERVICES
================================= */

// requests
import { POST } from "@services/request";

export async function sharePostService(postId, payload) {
  return POST(`/shares/${postId}`, payload);
}
