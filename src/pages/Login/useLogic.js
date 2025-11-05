/* ===================================================
   Login Page Logic Hook
   ---------------------------------------------------
   Handles:
   - Login form input management
   - Authentication submission
   - Loading state and snackbar notifications
====================================================== */

import { useState, useRef, useCallback, useMemo } from "react";
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
   * Derived: simple form validation
   * ---------------------------------------- */
  const isValid = useMemo(() => {
    const email = formValues.user_email?.trim();
    const pwd = formValues.user_password?.trim();
    return Boolean(email && pwd);
  }, [formValues.user_email, formValues.user_password]);

  const isSubmitDisabled = useMemo(
    () => loading || loadingRef.current || !isValid,
    [loading, isValid]
  );

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
   * Normalize error to a readable string
   * ---------------------------------------- */
  const toMessage = (err) =>
    (typeof err === "string" && err) ||
    err?.message ||
    err?.msg ||
    "An unexpected error occurred.";

  /* ----------------------------------------
   * Handle Login Submission
   * Performs API request and redirects on success
   * ---------------------------------------- */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loadingRef.current || !isValid) return;

      loadingRef.current = true;
      setLoading(true);

      // Trim payload right before send
      const payload = {
        user_email: formValues.user_email.trim(),
        user_password: formValues.user_password.trim(),
      };

      try {
        const response = await actions.auth.loginAction(payload);

        if (!response?.success) {
          throw new Error(response?.msg || "Login failed.");
        }

        // Redirect on successful login
        window.location.href = "/";
      } catch (error) {
        console.error("Login Error:", error);
        // Clear only the password field on error (UX nicety)
        setFormValues((prev) => ({ ...prev, user_password: "" }));

        setSnackbar({
          open: true,
          message: toMessage(error),
          severity: "error",
        });
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [formValues.user_email, formValues.user_password, isValid]
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
    isSubmitDisabled,
    handleCloseSnackbar,
    handleInputChange,
    handleSubmit,
  };
};
