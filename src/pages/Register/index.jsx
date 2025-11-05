import { Eye, EyeOff } from "lucide-react";
import { useLogic } from "./useLogic";
import LoadingScreen from "@components/common/LoadingScreen";
import SnackbarAlert from "@components/common/SnackbarAlert";

/**
 * Register Component
 * ------------------------------------------------------------
 * Responsive, modern Instagram-style registration design.
 * Matches the Login layout for consistent UX across devices.
 * ------------------------------------------------------------
 */
const Register = () => {
  const {
    loading,
    snackbar,
    formValues,
    showPassword,
    handleCloseSnackbar,
    handleInputChange,
    handleTogglePassword,
    handleSubmit,
  } = useLogic();

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 lg:px-8 py-10">
      {/* Registration Card */}
      <div className="w-full max-w-[90%] sm:max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 sm:p-10 md:p-12 transition-all">
        {/* Brand */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 sm:mb-10 text-gray-800 font-sans tracking-tight">
          Chattr
        </h1>

        {/* Registration Form */}
        <form className="flex flex-col gap-5 sm:gap-6" onSubmit={handleSubmit}>
          <input
            type="text"
            name="user_fname"
            value={formValues.user_fname}
            onChange={handleInputChange}
            placeholder="First Name"
            className="w-full border border-gray-300 rounded-lg px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
          />

          <input
            type="text"
            name="user_lname"
            value={formValues.user_lname}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="w-full border border-gray-300 rounded-lg px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
          />

          <input
            type="email"
            name="user_email"
            value={formValues.user_email}
            onChange={handleInputChange}
            placeholder="Email Address"
            className="w-full border border-gray-300 rounded-lg px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
          />

          {/* Password Field with Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="user_password"
              value={formValues.user_password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10 sm:pr-12 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-colors mt-3 shadow-sm"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6 sm:my-8">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 sm:px-4 text-gray-400 text-xs sm:text-sm font-medium">
            OR
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Redirect to Login */}
        <p className="text-center text-sm sm:text-base text-gray-600 leading-relaxed">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Log in
          </a>
        </p>

        {/* Snackbar */}
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
