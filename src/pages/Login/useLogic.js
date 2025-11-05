import { useState, useCallback } from "react";
import actions from "@actions";

/**
 * useLogic Hook
 * ------------------------------------------------------------
 * Handles all login logic, including:
 *  - Form state management
 *  - Show/hide password toggle
 *  - API submission via `actions.auth.loginAction`
 *  - Snackbar feedback and loading states
 * ------------------------------------------------------------
 */
export const useLogic = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formValues, setFormValues] = useState({
    user_email: "",
    user_password: "",
  });

  /** ----------------------------------------------------------
   * Toggle password visibility
   * ---------------------------------------------------------- */
  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  /** ----------------------------------------------------------
   * Handle input change
   * ---------------------------------------------------------- */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  /** ----------------------------------------------------------
   * Submit form
   * ---------------------------------------------------------- */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await actions.auth.loginAction(formValues);
        setSnackbar({
          open: true,
          message: "Login successful!",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: error?.response?.data?.message || "Login failed.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [formValues]
  );

  /** ----------------------------------------------------------
   * Close Snackbar
   * ---------------------------------------------------------- */
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    loading,
    snackbar,
    formValues,
    showPassword,
    handleInputChange,
    handleTogglePassword,
    handleSubmit,
    handleCloseSnackbar,
  };
};
