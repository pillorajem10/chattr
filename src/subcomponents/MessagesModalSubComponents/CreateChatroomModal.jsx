import { useState, useEffect, useRef } from "react";
import { X, User, Loader2 } from "lucide-react";

const CreateChatroomModal = ({
  open,
  onClose,
  onCreateChatroom,
  users,
  handleGetUsers,
  userPageDetails,
  loading,
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const loaderRef = useRef(null);

  /* ----------------------------------------
   * Auto-fetch users when modal opens
   * ---------------------------------------- */
  useEffect(() => {
    if (open && users.length === 0) {
      handleGetUsers(1, "");
    }
  }, [open]);

  /* ----------------------------------------
   * Debounced Search (syncs with backend)
   * ---------------------------------------- */
  useEffect(() => {
    if (!open) return;
    const delay = setTimeout(() => {
      handleGetUsers(1, search);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, open]);

  /* ----------------------------------------
   * Infinite Scroll (Stable Version)
   * ---------------------------------------- */
  useEffect(() => {
    if (!open) return;
    if (!loaderRef.current) return;

    const scrollContainer = loaderRef.current.closest(".overflow-y-auto");
    if (!scrollContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          !loading &&
          !search.trim() &&
          userPageDetails.pageIndex < userPageDetails.totalPages
        ) {
          handleGetUsers(userPageDetails.pageIndex + 1, "");
        }
      },
      {
        root: scrollContainer,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [
    open,
    handleGetUsers,
    loading,
    search,
    userPageDetails.pageIndex,
    userPageDetails.totalPages,
  ]);

  /* ----------------------------------------
   * Handle Submit
   * ---------------------------------------- */
  const handleSubmit = () => {
    if (!selectedUser) return;
    onCreateChatroom(selectedUser.id);
  };

  if (!open) return null;

  /* ----------------------------------------
   * Render
   * ---------------------------------------- */
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-2xl w-96 max-h-[80vh] flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-4 py-3 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">New Message</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* SEARCH */}
        <div className="p-3 border-b">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* USER LIST */}
        <div className="flex-1 overflow-y-auto">
          {loading && users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <Loader2 size={20} className="animate-spin mb-2" />
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-gray-400">No users found.</div>
          ) : (
            <>
              {users.map((user) => {
                const isSelected = selectedUser?.id === user.id;
                const fullName = `${user.user_fname || ""} ${
                  user.user_lname || ""
                }`.trim();

                return (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                      isSelected
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="text-gray-500" size={20} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {fullName || user.username || "Unnamed User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.username || user.email}
                      </p>
                    </div>

                    <div
                      className={`w-4 h-4 border-2 rounded-full flex items-center justify-center ${
                        isSelected
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-400"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                );
              })}

              <div
                ref={loaderRef}
                className="flex justify-center items-center py-3 text-gray-400 text-sm"
              >
                {loading && "Loading more users..."}
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t p-3 flex justify-end gap-2 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!selectedUser}
            className={`px-4 py-2 text-sm rounded-lg text-white transition ${
              selectedUser
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChatroomModal;
