/* ===================================================
   Register Page Logic Hook
   ---------------------------------------------------
   Handles:
   - Registration form input management
   - Account creation via API
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
    user_fname: "",
    user_lname: "",
    user_email: "",
    user_password: "",
  });

  /* ----------------------------------------
   * Derived: Form Validation
   * Ensures all required fields are filled
   * ---------------------------------------- */
  const isValid = useMemo(() => {
    const { user_fname, user_lname, user_email, user_password } = formValues;
    return (
      user_fname.trim() &&
      user_lname.trim() &&
      user_email.trim() &&
      user_password.trim()
    );
  }, [formValues]);

  const isSubmitDisabled = useMemo(
    () => loading || loadingRef.current || !isValid,
    [loading, isValid]
  );

  /* ----------------------------------------
   * Handle Input Changes
   * Dynamically updates form field state
   * ---------------------------------------- */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /* ----------------------------------------
   * Utility: Normalize error messages
   * ---------------------------------------- */
  const toMessage = (err) =>
    (typeof err === "string" && err) ||
    err?.message ||
    err?.msg ||
    "An unexpected error occurred.";

  /* ----------------------------------------
   * Handle Registration Submission
   * Sends data to backend and redirects on success
   * ---------------------------------------- */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loadingRef.current || !isValid) return;

      loadingRef.current = true;
      setLoading(true);

      // Trim payload before sending
      const payload = {
        user_fname: formValues.user_fname.trim(),
        user_lname: formValues.user_lname.trim(),
        user_email: formValues.user_email.trim(),
        user_password: formValues.user_password.trim(),
      };

      try {
        const response = await actions.auth.registerAction(payload);

        if (!response?.success)
          throw new Error(response?.msg || "Registration failed.");

        // Redirect to homepage after successful registration
        window.location.href = "/";
      } catch (error) {
        console.error("Register Error:", error);
        // Clear password on error
        setFormValues((prev) => ({ ...prev, user_password: "" }));

        setSnackbar({
          open: true,
          message: toMessage(error),
          severity: "error",
        });
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [formValues, isValid]
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
    handleInputChange,
    handleSubmit,
    handleCloseSnackbar,
  };
};
