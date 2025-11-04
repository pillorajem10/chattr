/* ===================================================
   Register Page Logic Hook
   ---------------------------------------------------
   Handles:
   - Registration form input management
   - Account creation via API
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
    user_fname: "",
    user_lname: "",
    user_email: "",
    user_password: "",
  });

  /* ----------------------------------------
   * Handle Input Changes
   * Updates form state dynamically
   * ---------------------------------------- */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /* ----------------------------------------
   * Handle Registration Submission
   * Sends form data to the API and redirects on success
   * ---------------------------------------- */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        const response = await actions.auth.registerAction(formValues);

        if (!response.success)
          throw new Error(response.msg || "Registration failed.");

        // Redirect to homepage after successful registration
        window.location.href = "/";
      } catch (error) {
        console.error("Register Error:", error);

        setSnackbar({
          open: true,
          message: error || "An unexpected error occurred.",
          severity: "error",
        });
      } finally {
        setLoading(false);
        loadingRef.current = false;
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
