// lucide-react
import { Home } from "lucide-react";

// react-router-dom
import { Link } from "react-router-dom";

/**
 * Default Component (404 Page)
 * ------------------------------------------------------------------
 * Displays a friendly “Page Not Found” message when the user
 * navigates to a non-existent route. Provides a quick link
 * to return to the homepage.
 * ------------------------------------------------------------------
 */
const Default = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 px-6">
      {/* ------------------------------------------------------------
           Icon
         ------------------------------------------------------------ */}
      <div className="mb-6">
        <Home size={60} className="text-blue-500" />
      </div>

      {/* ------------------------------------------------------------
           Message
         ------------------------------------------------------------ */}
      <h1 className="text-5xl font-bold mb-4">Page Not Found</h1>
      <p className="text-gray-600 text-lg mb-8 text-center max-w-md">
        Oops! The page you’re looking for doesn’t exist or may have been moved.
      </p>

      {/* ------------------------------------------------------------
           Redirect Button
         ------------------------------------------------------------ */}
      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-md shadow transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Default;
