import axios from "axios";
import Cookies from "js-cookie";

const storedToken = Cookies.get("token");
const bearerToken = `Bearer ${storedToken}`;

// request header configuration
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Authorization"] = storedToken
  ? bearerToken
  : null;

const baseUrl = "http://127.0.0.1:8000/api";

/**
 * handle check request method
 * based on method, use axios to handle request
 * @param url
 * @param options
 * @returns {Promise<AxiosResponse<T>>}
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
    default:
      return axios.get(baseUrl + url, option);
  }
};

/**
 * Check the response status
 * @param res
 * @returns {*}
 */
const checkApiStatus = (res) => {
  const { data, status } = res;
  const { msg } = data;

  if (status >= 200 && status < 300) return res;

  const err = { message: msg };

  return Promise.reject(err);
};

/**
 * handle response data format
 * @param res
 * @returns {Promise<{data: *, message: *, status: *}>}
 */
const handleResponseData = (res) => {
  const { data } = res;
  return Promise.resolve(data);
};

const handleThrowError = (err) => {
  return Promise.reject(err);
};
/**
 * Overall fetch method
 * @param url
 * @param options
 * @returns {Promise<{data: *, status: *} | never>}
 */
const fetch = (url, options) => {
  return requestMethod(url, options)
    .then(checkApiStatus)
    .then(handleResponseData)
    .catch(handleThrowError);
};

/**
 * handle GET request
 * @param url
 * @param options
 * @constructor
 */
export const GET = (url, options) => fetch(url, { ...options, method: "GET" });

/**
 * handle POST request
 * @param url
 * @param options
 * @constructor
 */
export const POST = (url, options) =>
  fetch(url, { ...options, method: "POST" });

/**
 * handle PUT request
 * @param url
 * @param options
 * @constructor
 */
export const PUT = (url, options) => fetch(url, { ...options, method: "PUT" });

/**
 * handle delete request
 * @param url
 * @param options
 * @constructor
 */
export const DELETE = (url, options) =>
  fetch(url, { ...options, method: "DELETE" });
