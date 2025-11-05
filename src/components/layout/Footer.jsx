import { Home, PlusSquare, User, LogOut } from "lucide-react";
import actions from "@actions";
import { usePostModal } from "@contexts/PostModalContext";

/**
 * Footer
 * ------------------------------------------------------------------
 * Mobile navigation footer with quick access to:
 * Home, Create Post, Profile, and Logout.
 * ------------------------------------------------------------------
 */
const Footer = () => {
  const { openCreatePostModal } = usePostModal();

  const handleLogout = async () => {
    try {
      await actions.auth.logoutAction();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <footer className="flex justify-around items-center py-3 border-t border-gray-200 bg-white fixed bottom-0 left-0 right-0 z-50">
      {/* ------------------------------------------------------------
         * Home Button
         * ------------------------------------------------------------ */}
      <button
        className="hover:text-blue-600 transition-colors"
        aria-label="Home"
      >
        <Home size={22} />
      </button>

      {/* ------------------------------------------------------------
         * Create Post Button
         * ------------------------------------------------------------ */}
      <button
        onClick={openCreatePostModal}
        className="hover:text-blue-600 transition-colors"
        aria-label="Create Post"
      >
        <PlusSquare size={22} />
      </button>

      {/* ------------------------------------------------------------
         * Profile Button
         * ------------------------------------------------------------ */}
      <button
        className="hover:text-blue-600 transition-colors"
        aria-label="Profile"
      >
        <User size={22} />
      </button>

      {/* ------------------------------------------------------------
         * Logout Button
         * ------------------------------------------------------------ */}
      <button
        onClick={handleLogout}
        className="hover:text-red-600 transition-colors"
        aria-label="Logout"
      >
        <LogOut size={22} />
      </button>
    </footer>
  );
};

export default Footer;
