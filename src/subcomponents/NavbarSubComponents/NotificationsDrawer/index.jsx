import { X, CheckCheck, Check } from "lucide-react";
import { useLogic } from "./useLogic";

/**
 * NotificationsDrawer Component
 * ------------------------------------------------------------------
 * Parent Component: Navbar
 *
 * Displays a slide-in drawer for viewing, filtering, and marking
 * notifications as read. Includes:
 *  - Infinite scroll for notification pagination
 *  - "All" and "Unread" filter tabs
 *  - Real-time unread count updates synced with Navbar badge
 *  - Smooth open/close transitions with backdrop overlay
 * ------------------------------------------------------------------
 */
const NotificationsDrawer = ({
  open,
  onClose,
  leftOffsetPx = 80,
  onUnreadCountChange,
}) => {
  const {
    notifications,
    loading,
    loaderRef,
    filter,
    handleFilterChange,
    markAllAsRead,
    markAsRead,
    allRead,
  } = useLogic(onUnreadCountChange);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] transition-opacity duration-300
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 h-screen bg-white shadow-2xl border-l border-gray-200 z-50 w-[380px]
          transition-all duration-300 ease-in-out
          ${open ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0 pointer-events-none"}
        `}
        style={{ left: open ? `${leftOffsetPx}px` : `${leftOffsetPx - 20}px` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Notifications
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllAsRead}
              disabled={loading || allRead}
              className={`flex items-center gap-1 text-sm font-medium transition-all
                ${
                  loading || allRead
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              title="Mark all as read"
            >
              <CheckCheck size={18} />
              <span>Mark all</span>
            </button>
            <button onClick={onClose} aria-label="Close notifications">
              <X size={22} className="text-gray-500 hover:text-red-500" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-4 py-2 border-b bg-white">
          <button
            onClick={() => handleFilterChange("all")}
            className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${
              filter === "all"
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange("unread")}
            className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${
              filter === "unread"
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Unread
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100vh-100px)] px-4 py-3">
          {!loading && notifications.length === 0 && (
            <p className="text-gray-400 text-center mt-10">
              {filter === "unread"
                ? "No unread notifications."
                : "No notifications yet."}
            </p>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              className={`border-b py-3 flex items-start justify-between gap-2 transition-colors duration-300 ${
                n.notification_read
                  ? "text-gray-500"
                  : "text-gray-800 font-medium"
              }`}
            >
              <span className="flex-1">{n.notification_message}</span>
              {!n.notification_read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  title="Mark as Read"
                  className="text-gray-400 hover:text-green-600 transition-colors"
                >
                  <Check size={18} />
                </button>
              )}
            </div>
          ))}

          <div ref={loaderRef} className="text-center py-3 text-gray-400">
            {loading && "Loading more notifications..."}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsDrawer;
