/* ===============================
    REQUEST HANDLER
================================= */

import axios from "axios";
import Cookies from "js-cookie";

const storedToken = Cookies.get("token");
const bearerToken = `Bearer ${storedToken}`;

// Default Axios header configuration
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Authorization"] = storedToken
  ? bearerToken
  : null;

const baseUrl = "http://127.0.0.1:8000/api";

/**
 * Request Method Handler
 * Determines which Axios method to call based on request type.
 * Used internally by the fetch() wrapper.
 */
const requestMethod = (url, options = {}) => {
  const { method = "GET", ...option } = options;

  switch (method) {
    case "GET":
      return axios.get(baseUrl + url, option);
    case "POST":
      return axios.post(baseUrl + url, option);
    case "PUT":
      return axios.put(baseUrl + url, option);
    case "DELETE":
      return axios.delete(baseUrl + url, { data: option });
    case "PATCH":
      return axios.patch(baseUrl + url, option);
    default:
      return axios.get(baseUrl + url, option);
  }
};

/**
 * API Status Checker
 * Ensures the response has a valid 2xx status code.
 * Rejects otherwise.
 */
const checkApiStatus = (res) => {
  const { data, status } = res;
  const { msg } = data;

  if (status >= 200 && status < 300) return res;

  const err = { message: msg };
  return Promise.reject(err);
};

/**
 * Response Formatter
 * Extracts only the response data from Axios responses.
 */
const handleResponseData = (res) => {
  const { data } = res;
  return Promise.resolve(data);
};

/**
 * Error Handler
 * Propagates any caught API errors.
 */
const handleThrowError = (err) => Promise.reject(err);

/**
 * Fetch Wrapper
 * Core handler that chains request, status validation,
 * response formatting, and error handling.
 */
const fetch = (url, options) => {
  return requestMethod(url, options)
    .then(checkApiStatus)
    .then(handleResponseData)
    .catch(handleThrowError);
};

/**
 * HTTP Method Shortcuts
 * Simplified exports for common RESTful requests.
 */
export const GET = (url, options) => fetch(url, { ...options, method: "GET" });
export const POST = (url, options) => fetch(url, { ...options, method: "POST" });
export const PUT = (url, options) => fetch(url, { ...options, method: "PUT" });
export const DELETE = (url, options) => fetch(url, { ...options, method: "DELETE" });
export const PATCH = (url, options) => fetch(url, { ...options, method: "PATCH" });
