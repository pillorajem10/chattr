// logics 
import { useLogic } from "./useLogic";

// components
import LoadingScreen from "@components/common/LoadingScreen";
import SnackbarAlert from "@components/common/SnackbarAlert";

/**
 * Login Component
 * ------------------------------------------------------------------
 * Renders the login interface for user authentication.
 * Handles:
 *  - Email/username and password input
 *  - Submission via `useLogic` for API handling
 *  - Loading state and error feedback through Snackbar
 *
 * Acts as the main entry point for existing users.
 * ------------------------------------------------------------------
 */
const Login = () => {
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
           Login Card
         ------------------------------------------------------------ */}
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md p-8">
        {/* ------------------------------------------------------------
             Brand
           ------------------------------------------------------------ */}
        <h1 className="text-4xl font-semibold text-center mb-8 text-gray-800">
          Chattr
        </h1>

        {/* ------------------------------------------------------------
             Login Form
           ------------------------------------------------------------ */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="user_email"
            value={formValues.user_email}
            onChange={handleInputChange}
            placeholder="Email or Username"
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
            Log In
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
             Registration Link
           ------------------------------------------------------------ */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
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

export default Login;
