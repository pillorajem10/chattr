import { useState, useCallback, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { echo } from "@utils/echo";
import actions from "@actions";

/**
 * useLogic Hook
 * ------------------------------------------------------------
 * Handles all state and behavior for the MessageModal component.
 * Responsibilities include:
 *  - Managing chatroom list and active conversation
 *  - Fetching users and chatrooms
 *  - Sending and receiving messages in real time
 *  - Handling WebSocket updates via Laravel Echo
 *  - Managing view state and drawer visibility
 * ------------------------------------------------------------
 */
export const useLogic = () => {
  /** ------------------------------------------------------------
   * Current User
   * ------------------------------------------------------------ */
  const accountCookie = Cookies.get("account");
  const currentUser = accountCookie ? JSON.parse(accountCookie) : null;
  const currentUserId = currentUser ? Number(currentUser.id) : null;

  /** ------------------------------------------------------------
   * UI and Data States
   * ------------------------------------------------------------ */
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("list");
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const [chatrooms, setChatrooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [users, setUsers] = useState([]);
  const [chatFilter, setChatFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [userPageDetails, setUserPageDetails] = useState({
    totalRecords: 0,
    pageIndex: 1,
    totalPages: 1,
  });

  const chatroomRef = useRef(null);

  /** ------------------------------------------------------------
   * Drawer Controls
   * ------------------------------------------------------------ */
  const handleToggleDrawer = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) handleGetChatrooms();
  }, [isOpen]);

  const handleCloseChat = useCallback(() => {
    setView("list");
    setSelectedChatroom(null);
    setMessages([]);
  }, []);

  /** ------------------------------------------------------------
   * Chatroom Management
   * ------------------------------------------------------------ */
  const handleGetChatrooms = useCallback(
    async (filter = chatFilter) => {
      try {
        setLoading(true);
        const res = await actions.message.getUserChatroomsAction({ filter });
        if (!res.success) throw new Error(res.msg || "Failed to load chatrooms.");
        setChatrooms(res.data);
        setChatFilter(filter);
      } catch (error) {
        console.error("Chatroom Load Error:", error);
      } finally {
        setLoading(false);
      }
    },
    [chatFilter]
  );

  const handleOpenChatroom = useCallback(async (chatroom) => {
    try {
      setLoading(true);
      setView("chat");
      setSelectedChatroom(chatroom);
      chatroomRef.current = chatroom.id;

      const res = await actions.message.getConversationAction(chatroom.id);
      if (!res.success) throw new Error(res.msg || "Failed to load messages.");
      setMessages(res.data.records);

      await actions.message.markConversationAsReadAction(chatroom.id);
      setChatrooms((prev) =>
        prev.map((c) =>
          c.id === chatroom.id ? { ...c, unread_count: 0 } : c
        )
      );
    } catch (error) {
      console.error("Conversation Load Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateChatroom = useCallback(
    async (receiverId) => {
      if (!receiverId || sending) return;
      setSending(true);

      try {
        const res = await actions.message.createChatroomAction({
          receiver_id: receiverId,
        });
        if (!res.success)
          throw new Error(res.msg || "Failed to create chatroom.");

        let newChatroom = res.data.chatroom;
        const isUserOne = newChatroom.cr_user_one_id === currentUserId;
        const receiver = isUserOne
          ? newChatroom.user_two || newChatroom.userTwo
          : newChatroom.user_one || newChatroom.userOne;

        newChatroom = {
          ...newChatroom,
          receiver_name: receiver
            ? `${receiver.user_fname} ${receiver.user_lname}`
            : "User",
        };

        setChatrooms((prev) => {
          const exists = prev.some((c) => c.id === newChatroom.id);
          return exists ? prev : [newChatroom, ...prev];
        });

        setSelectedChatroom(newChatroom);
        setMessages([]);
        setView("chat");
        chatroomRef.current = newChatroom.id;
      } catch (error) {
        console.error("Create Chatroom Error:", error);
      } finally {
        setSending(false);
      }
    },
    [sending, currentUserId]
  );

  /** ------------------------------------------------------------
   * Real-Time Event Listeners (Laravel Echo)
   * ------------------------------------------------------------ */
  useEffect(() => {
    if (!currentUserId) return;
    const channel = echo.private(`user.${currentUserId}`);

    /**
     * New Chatroom Created (Real-time)
     * Automatically formats receiver name so it displays correctly.
     */
    channel.listen(".chatroom.created", async (event) => {
      let newChatroom = event.chatroom;

      // If the payload doesn't include user relations, fetch them manually
      if (!newChatroom.user_one && !newChatroom.userOne) {
        try {
          const res = await actions.message.getChatroomDetailsAction(newChatroom.id);
          if (res.success) newChatroom = res.data.chatroom;
        } catch (error) {
          console.error("Failed to fetch chatroom details:", error);
        }
      }

      // Determine which side of the chatroom is the receiver
      const isUserOne = newChatroom.cr_user_one_id === currentUserId;
      const receiver = isUserOne
        ? newChatroom.user_two || newChatroom.userTwo
        : newChatroom.user_one || newChatroom.userOne;

      newChatroom = {
        ...newChatroom,
        receiver_name: receiver
          ? `${receiver.user_fname} ${receiver.user_lname}`
          : "User",
      };

      setChatrooms((prev) => {
        const exists = prev.some((c) => c.id === newChatroom.id);
        return exists ? prev : [newChatroom, ...prev];
      });
    });

    /**
     * Message Sent or Received
     * Updates chatroom metadata and message list dynamically.
     */
    channel.listen(".message.sent", (event) => {
      const message = event.message;
      const chatroomId = message.message_chatroom_id;

      // Update chatroom preview and unread count
      setChatrooms((prev) => {
        const updated = prev.map((c) =>
          c.id === chatroomId
            ? {
                ...c,
                messages: [message],
                latest_message: message.message_content,
                unread_count:
                  selectedChatroom?.id === chatroomId
                    ? 0
                    : (c.unread_count || 0) + 1,
              }
            : c
        );

        // Sort chatrooms by latest message timestamp
        updated.sort((a, b) => {
          const timeA = a.messages?.[0]?.created_at || a.updated_at;
          const timeB = b.messages?.[0]?.created_at || b.updated_at;
          return new Date(timeB) - new Date(timeA);
        });

        return chatFilter === "unread"
          ? updated.filter((c) => c.unread_count > 0)
          : updated;
      });

      // If current chatroom is open, append message
      setMessages((prev) =>
        selectedChatroom?.id === chatroomId ? [message, ...prev] : prev
      );
    });

    /**
     * Message Read Event
     * Clears unread count and marks messages as read.
     */
    channel.listen(".message.read", (event) => {
      const receiverId = event.receiver_id;

      setChatrooms((prev) =>
        prev.map((c) =>
          c.cr_user_one_id === receiverId || c.cr_user_two_id === receiverId
            ? { ...c, unread_count: 0 }
            : c
        )
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.message_sender_id === receiverId
            ? { ...msg, message_read: true }
            : msg
        )
      );
    });

    // Cleanup subscription when component unmounts
    return () => {
      echo.leave(`private-user.${currentUserId}`);
    };
  }, [currentUserId, selectedChatroom, chatFilter]);

  /** ------------------------------------------------------------
   * Message Sending
   * ------------------------------------------------------------ */
  const handleSendMessage = useCallback(async () => {
    if (!messageText.trim() || sending || !selectedChatroom) return;
    setSending(true);

    try {
      const receiverId =
        selectedChatroom.cr_user_one_id === currentUserId
          ? selectedChatroom.cr_user_two_id
          : selectedChatroom.cr_user_one_id;

      const res = await actions.message.sendMessageAction({
        message_chatroom_id: selectedChatroom.id,
        message_receiver_id: receiverId,
        message_content: messageText.trim(),
      });

      if (!res.success) throw new Error(res.msg || "Failed to send message.");
      setMessageText("");
    } catch (error) {
      console.error("Send Message Error:", error);
    } finally {
      setSending(false);
    }
  }, [messageText, selectedChatroom, sending, currentUserId]);

  /** ------------------------------------------------------------
   * User Management
   * ------------------------------------------------------------ */
  const handleGetUsers = useCallback(
    async (pageIndex = 1, searchQuery = "") => {
      try {
        setLoading(true);
        const params = { pageIndex, pageSize: 500 };
        if (searchQuery.trim()) params.search = searchQuery.trim();

        const res = await actions.user.fetchUsersAction(params);
        if (!res.success) throw new Error(res.msg || "Failed to load users.");

        setUsers((prev) =>
          pageIndex === 1 ? res.data.records : [...prev, ...res.data.records]
        );

        setUserPageDetails({
          totalRecords: res.data.total_records,
          pageIndex: res.data.page_index,
          totalPages: res.data.total_pages,
        });
      } catch (error) {
        console.error("User Load Error:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /** ------------------------------------------------------------
   * Lifecycle Effects
   * ------------------------------------------------------------ */
  useEffect(() => {
    if (isOpen) handleGetChatrooms();
  }, [isOpen, handleGetChatrooms]);

  /** ------------------------------------------------------------
   * Hook Return
   * ------------------------------------------------------------ */
  return {
    isOpen,
    view,
    selectedChatroom,
    chatrooms,
    messages,
    messageText,
    loading,
    sending,
    userPageDetails,
    users,
    chatFilter,
    setMessageText,
    handleToggleDrawer,
    handleCloseChat,
    handleOpenChatroom,
    handleCreateChatroom,
    handleSendMessage,
    handleGetChatrooms,
    handleGetUsers,
    currentUserId,
  };
};
