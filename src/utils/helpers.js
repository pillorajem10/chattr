/* ===============================
    HELPERS
================================= */

/**
 * Convert object params to query string
 * @param {Object} params
 * @returns {string}
 */
export const convertQueryString = (params) => {
  if (!params || typeof params !== "object") return "";
  return Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
    )
    .join("&");
};
