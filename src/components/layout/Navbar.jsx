import { Bell } from "lucide-react";
import { useState } from "react";
import NotificationsDrawer from "@subcomponents/NavbarSubComponents/NotificationsDrawer";

/**
 * Navbar
 * ------------------------------------------------------------------
 * Fixed top navigation bar with brand label and notifications.
 * The bell icon toggles a notifications drawer with unread count.
 * ------------------------------------------------------------------
 */
const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  return (
    <>
      {/* ------------------------------------------------------------
         * Navbar Header
         * ------------------------------------------------------------ */}
      <header className="flex items-center justify-between z-40 px-6 py-3 bg-white border-b border-gray-200 fixed top-0 left-0 lg:left-64 right-0 h-14">
        {/* ------------------------------------------------------------
           * Brand — visible only when sidebar is hidden
           * ------------------------------------------------------------ */}
        <h1 className="text-lg font-bold text-gray-800 select-none lg:hidden">
          Chattr
        </h1>

        {/* ------------------------------------------------------------
           * Notifications Button
           * ------------------------------------------------------------ */}
        <button
          onClick={toggleDrawer}
          className="relative text-gray-600 hover:text-blue-600 transition-colors ml-auto"
          title="View notifications"
        >
          <Bell size={22} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-semibold rounded-full px-1.5 py-[1px] shadow-md">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </header>

      {/* ------------------------------------------------------------
         * Notifications Drawer
         * ------------------------------------------------------------ */}
      <NotificationsDrawer
        open={drawerOpen}
        onClose={toggleDrawer}
        leftOffsetPx={window.innerWidth >= 1024 ? 256 : 0}
        onUnreadCountChange={setUnreadCount}
      />
    </>
  );
};

export default Navbar;
