import Cookies from "js-cookie";
import {
  X,
  Send,
  ArrowLeft,
  MessageCircle,
  User,
  PenSquare,
} from "lucide-react";
import { useState } from "react";
import { useLogic } from "./useLogic";

// sub-components
import CreateChatroomModal from "@subcomponents/MessagesModalSubComponents/CreateChatroomModal";

const MessageModal = () => {
  const {
    isOpen,
    view,
    selectedChatroom,
    chatrooms,
    messages,
    messageText,
    loading,
    sending,
    snackbar,
    userPageDetails,
    users,
    setMessageText,
    handleToggleDrawer,
    handleCloseChat,
    handleOpenChatroom,
    handleSendMessage,
    handleGetUsers,
    handleCreateChatroom,
    handleCloseSnackbar,
  } = useLogic();

  const account = Cookies.get("account");
  const currentUserId = account ? JSON.parse(account)?.id : null;

  const [showCreateModal, setShowCreateModal] = useState(false);

  /* ----------------------------------------
   * Floating Button (Open Drawer)
   * ---------------------------------------- */
  if (!isOpen)
    return (
      <button
        onClick={handleToggleDrawer}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all z-50 flex items-center justify-center"
        title="Messages"
      >
        <MessageCircle size={24} />
      </button>
    );

  /* ----------------------------------------
   * Modal Container
   * ---------------------------------------- */
  return (
    <div className="fixed bottom-6 right-6 w-96 h-[550px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-gray-200 z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        {view === "chat" ? (
          <>
            <button
              onClick={handleCloseChat}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <ArrowLeft size={20} />
            </button>

            <h2 className="text-lg font-semibold text-gray-800 truncate flex-1 text-center">
              {selectedChatroom &&
                (() => {
                  const userId = Number(currentUserId);
                  const userOne =
                    selectedChatroom.user_one || selectedChatroom.userOne;
                  const userTwo =
                    selectedChatroom.user_two || selectedChatroom.userTwo;
                  const receiver =
                    userId === selectedChatroom.cr_user_one_id
                      ? userTwo
                      : userOne;
                  return receiver
                    ? `${receiver.user_fname} ${receiver.user_lname}`
                    : "User";
                })()}
            </h2>

            <button
              onClick={handleToggleDrawer}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X size={20} />
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
            <button
              onClick={handleToggleDrawer}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X size={20} />
            </button>
          </>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-gray-50 relative">
        {view === "list" ? (
          <>
            {loading && (
              <p className="text-center text-gray-500 py-4">
                Loading conversations...
              </p>
            )}

            {!loading && chatrooms.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No conversations yet.
              </p>
            )}

            {!loading &&
              chatrooms.map((chatroom) => {
                const userId = Number(currentUserId);
                const receiver =
                  userId === chatroom.cr_user_one_id
                    ? chatroom.user_two || chatroom.userTwo
                    : chatroom.user_one || chatroom.userOne;

                const latest = chatroom.messages?.[0];

                return (
                  <div
                    key={chatroom.id}
                    onClick={() => handleOpenChatroom(chatroom)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition relative"
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-600" />
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <p className="font-medium text-gray-800 truncate">
                        {receiver?.user_fname} {receiver?.user_lname}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {latest ? latest.message_content : "No messages yet"}
                      </p>
                    </div>

                    {chatroom.unread_count > 0 && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {chatroom.unread_count}
                      </span>
                    )}
                  </div>
                );
              })}

            {/* Compose (New Message) Floating Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-md transition"
              title="New Message"
            >
              <PenSquare size={20} />
            </button>
          </>
        ) : (
          <>
            {loading ? (
              <p className="text-center text-gray-500 py-4">
                Loading messages...
              </p>
            ) : (
              <div className="chat-messages-container flex flex-col-reverse gap-3 px-4 py-3 overflow-y-auto h-full">
                {messages.length === 0 && (
                  <p className="text-center text-gray-400 mt-10">No messages yet.</p>
                )}

                {messages.map((msg) => {
                  if (!msg) return null;
                  const isMine = Number(msg.message_sender_id) === Number(currentUserId);
                  return (
                    <div
                      key={msg.id || Math.random()}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm max-w-[70%] ${
                          isMine
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        {msg.message_content || ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      {view === "chat" && (
        <div className="border-t p-3 flex items-center gap-2 bg-white">
          <input
            type="text"
            placeholder="Message..."
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />

          <button
            onClick={handleSendMessage}
            disabled={sending || !messageText.trim()}
            className={`p-2 rounded-full transition ${
              sending || !messageText.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            title="Send"
          >
            <Send size={18} />
          </button>
        </div>
      )}

      {/* Create Chatroom Modal */}
      {showCreateModal && (
        <CreateChatroomModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateChatroom={(userId) => {
            handleCreateChatroom(userId);
            setShowCreateModal(false);
          }}
          users={users}
          handleGetUsers={handleGetUsers}
          userPageDetails={userPageDetails}
          loading={loading}
        />
      )}

      {/* Snackbar Notification */}
      {snackbar.open && (
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 bg-${
            snackbar.severity === "error" ? "red" : "blue"
          }-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg transition-opacity duration-300`}
        >
          {snackbar.message}
          <button
            onClick={handleCloseSnackbar}
            className="ml-3 text-white/80 hover:text-white font-semibold"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageModal;
