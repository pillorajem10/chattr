// services apis
import {
  loginService,
  registerService,
  logoutService,
  profileService,
} from "@services/api/auth";

// libraries
import Cookies from "js-cookie";
import axios from "axios";

/*===============================
         AUTH ACTIONS
=================================*/

/**
 * Set axios header and cookies
 */
export const setAuthorizationHeader = (token) => {
  const bearerToken = `Bearer ${token}`;

  Cookies.set('token', token, { expires: 365, secure: true, sameSite: 'Strict' });
  axios.defaults.headers.common.Authorization = bearerToken;
};

/**
 * Set user details in cookies and redux
 */
export const setUserDetails = (userDetails) => {
  Cookies.set("account", JSON.stringify(userDetails), {
    expires: 365,
    secure: true,
    sameSite: "Strict",
  });
  Cookies.set("authenticated", true, {
    expires: 365,
    secure: true,
    sameSite: "Strict",
  });
};

/**
 * Login Action
 */
export const loginAction = async (payload) => {
  try {
    const res = await loginService(payload);

    const { success, data } = res;

    if (success) {
      if (data) {
        const account = data.user;

        const rawToken = data.token; 
        const token = rawToken.includes('|') ? rawToken.split('|')[1] : rawToken;

        Cookies.set("token", token, {
          expires: 365,
          secure: true,
          sameSite: "Strict",
        });
        setAuthorizationHeader(token);
        setUserDetails(account);
      }
    }

    return res;
  } catch (err) {
    throw err.response?.data?.msg || "Login failed.";
  }
};

/**
 * Register Action
 */
export const registerAction = async (payload) => {
  try {
    const res = await registerService(payload);
    const { success, data } = res;

    if (success) {
      if (data) {
        const account = data.user;

        const rawToken = data.token; 
        const token = rawToken.includes('|') ? rawToken.split('|')[1] : rawToken;

        Cookies.set("token", token, {
          expires: 365,
          secure: true,
          sameSite: "Strict",
        });
        setAuthorizationHeader(token);
        setUserDetails(account);
      }
    }

    return res;
  } catch (err) {
    console.error("Register Action Error:", err);
    throw err.response?.data?.msg || "Registration error.";
  }
};

/**
 * Fetch Profile Action
 */
export const fetchProfileAction = async () => {
  try {
    const res = await profileService();
    return res;
  } catch (err) {
    throw err.response?.data?.msg || "Failed to fetch profile.";
  }
};

/**
 * Logout Action
 */
export const logoutAction = async () => {
  try {
    await logoutService();

    Cookies.remove("account");
    Cookies.remove("authenticated");
    Cookies.remove("token");

    window.location.href = "/login";
  } catch (err) {
    throw err.response?.data?.msg || "Logout failed.";
  }
};
