// logics 
import { useLogic } from "./useLogic";

// components
import LoadingScreen from "@components/common/LoadingScreen";
import SnackbarAlert from "@components/common/SnackbarAlert";

/**
 * Register Component
 * ------------------------------------------------------------------
 * Handles user registration and account creation.
 * Includes:
 *  - Input fields for personal details and credentials
 *  - Form submission handled by `useLogic`
 *  - Loading state and Snackbar feedback for errors or success
 *
 * Serves as the main entry point for new users joining the app.
 * ------------------------------------------------------------------
 */
const Register = () => {
  const {
    loading,
    snackbar,
    formValues,
    handleCloseSnackbar,
    handleInputChange,
    handleSubmit,
  } = useLogic();

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* ------------------------------------------------------------
           Register Card
         ------------------------------------------------------------ */}
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md p-8">
        {/* ------------------------------------------------------------
             Brand
           ------------------------------------------------------------ */}
        <h1 className="text-4xl font-semibold text-center mb-8 text-gray-800">
          Chattr
        </h1>

        {/* ------------------------------------------------------------
             Registration Form
           ------------------------------------------------------------ */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="user_fname"
            value={formValues.user_fname}
            onChange={handleInputChange}
            placeholder="First Name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            name="user_lname"
            value={formValues.user_lname}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="email"
            name="user_email"
            value={formValues.user_email}
            onChange={handleInputChange}
            placeholder="Email Address"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="password"
            name="user_password"
            value={formValues.user_password}
            onChange={handleInputChange}
            placeholder="Password"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition-colors"
          >
            Sign Up
          </button>
        </form>

        {/* ------------------------------------------------------------
             Divider
           ------------------------------------------------------------ */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-gray-400 text-sm font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* ------------------------------------------------------------
             Login Redirect
           ------------------------------------------------------------ */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Log in
          </a>
        </p>

        {/* ------------------------------------------------------------
             Snackbar Notification
           ------------------------------------------------------------ */}
        {snackbar.open && (
          <SnackbarAlert
            open={snackbar.open}
            onClose={handleCloseSnackbar}
            message={snackbar.message}
            severity={snackbar.severity}
          />
        )}
      </div>
    </div>
  );
};

export default Register;
