/* ===================================================
   Login Page Logic Hook
   ---------------------------------------------------
   Handles:
   - Login form input management
   - Authentication submission
   - Loading state and snackbar notifications
====================================================== */

import { useState, useRef, useCallback } from "react";
import actions from "@actions";

export const useLogic = () => {
  /* ----------------------------------------
   * References
   * ---------------------------------------- */
  const loadingRef = useRef(false); // Prevents multiple submissions

  /* ----------------------------------------
   * States
   * ---------------------------------------- */
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formValues, setFormValues] = useState({
    user_email: "",
    user_password: "",
  });

  /* ----------------------------------------
   * Handle Input Changes
   * Updates state dynamically based on input field name
   * ---------------------------------------- */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /* ----------------------------------------
   * Handle Login Submission
   * Performs API request and redirects on success
   * ---------------------------------------- */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        const response = await actions.auth.loginAction(formValues);

        if (!response.success)
          throw new Error(response.msg || "Login failed.");

        // Redirect on successful login
        window.location.href = "/";
      } catch (error) {
        console.error("Login Error:", error);

        setSnackbar({
          open: true,
          message: error || "An unexpected error occurred.",
          severity: "error",
        });
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [formValues]
  );

  /* ----------------------------------------
   * Handle Snackbar Close
   * ---------------------------------------- */
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  /* ----------------------------------------
   * Expose Reactive State & Functions
   * ---------------------------------------- */
  return {
    loading,
    snackbar,
    formValues,
    handleCloseSnackbar,
    handleInputChange,
    handleSubmit,
  };
};
