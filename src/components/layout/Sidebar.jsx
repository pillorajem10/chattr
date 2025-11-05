import { Home, LogOut, PlusSquare, User } from "lucide-react";
import actions from "@actions";
import { usePostModal } from "@contexts/PostModalContext";

/**
 * Sidebar
 * ------------------------------------------------------------------
 * Left-side navigation with main app links and logout.
 * Includes Create Post integration via PostModalContext.
 * ------------------------------------------------------------------
 */
const Sidebar = () => {
  const { openCreatePostModal } = usePostModal();

  const handleLogout = async () => {
    try {
      await actions.auth.logoutAction();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 z-[60] bg-white flex flex-col justify-between py-8 px-6 border-r border-gray-200">
      {/* ------------------------------------------------------------
         * Top Section — App Title and Navigation
         * ------------------------------------------------------------ */}
      <div>
        <h1 className="text-3xl font-extrabold mb-6 tracking-tight text-gray-800">
          Chattr
        </h1>

        <nav className="flex flex-col gap-6">
          <SidebarButton icon={<Home size={24} />} label="Home" />
          <SidebarButton
            icon={<PlusSquare size={24} />}
            label="Create"
            onClick={openCreatePostModal}
          />
          <SidebarButton icon={<User size={24} />} label="Profile" />
        </nav>
      </div>

      {/* ------------------------------------------------------------
         * Bottom Section — Logout
         * ------------------------------------------------------------ */}
      <SidebarButton
        icon={<LogOut size={24} />}
        label="Logout"
        onClick={handleLogout}
      />
    </aside>
  );
};

/**
 * SidebarButton
 * ------------------------------------------------------------------
 * Simple reusable button for sidebar navigation.
 * Accepts icon, label, optional onClick, and active state.
 * ------------------------------------------------------------------
 */
const SidebarButton = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 text-gray-700 text-lg transition-colors hover:text-blue-600 ${
      active ? "text-blue-600 font-semibold" : ""
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default Sidebar;
