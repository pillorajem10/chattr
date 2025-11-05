/* ===================================================
   Message Modal Logic Hook
   ---------------------------------------------------
   Handles:
   - Loading chatrooms and users
   - Opening and creating chatrooms
   - Real-time updates via Echo
   - Sending and receiving messages
   - Marking conversations as read
   - Snackbar feedback and UI state
====================================================== */

import { useState, useCallback, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { echo } from "@utils/echo";
import actions from "@actions";

export const useLogic = () => {
  /* ----------------------------------------
   * Current User
   * ---------------------------------------- */
  const accountCookie = Cookies.get("account");
  const currentUser = accountCookie ? JSON.parse(accountCookie) : null;
  const currentUserId = currentUser ? Number(currentUser.id) : null;

  /* ----------------------------------------
   * UI & Data States
   * ---------------------------------------- */
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [userPageDetails, setUserPageDetails] = useState({
    totalRecords: 0,
    pageIndex: 1,
    totalPages: 1,
  });

  const chatroomRef = useRef(null);

  /* ----------------------------------------
   * Drawer Controls
   * ---------------------------------------- */
  const handleToggleDrawer = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) handleGetChatrooms();
  }, [isOpen]);

  const handleCloseChat = useCallback(() => {
    setView("list");
    setSelectedChatroom(null);
    setMessages([]);
  }, []);

  /* ----------------------------------------
   * Chatroom Operations
   * ---------------------------------------- */
  const handleGetChatrooms = useCallback(
    async (filter = chatFilter) => {
      try {
        setLoading(true);
        const res = await actions.message.getUserChatroomsAction({ filter });
        if (!res.success)
          throw new Error(res.msg || "Failed to load chatrooms.");
        setChatrooms(res.data);
        setChatFilter(filter);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to load chatrooms.",
          severity: "error",
        });
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
      setSnackbar({
        open: true,
        message: "Failed to open chatroom.",
        severity: "error",
      });
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

        setSnackbar({
          open: true,
          message: `Chat started with ${newChatroom.receiver_name}.`,
          severity: "success",
        });
      } catch (error) {
        console.error("Create Chatroom Error:", error);
        setSnackbar({
          open: true,
          message: "Failed to create chatroom.",
          severity: "error",
        });
      } finally {
        setSending(false);
      }
    },
    [sending, currentUserId]
  );

  /* ----------------------------------------
   * Real-Time Updates via Echo
   * ---------------------------------------- */
  useEffect(() => {
    if (!currentUserId) return;

    const userChannel = echo.private(`chatrooms.${currentUserId}`);
    const messageChannel = echo.private(`messages.${currentUserId}`);
    const subscribedChannels = [];

    // Listen for new chatroom creation
    userChannel.listen(".chatroom.created", (event) => {
      const newChatroom = event.chatroom;
      setChatrooms((prev) => {
        const exists = prev.some((c) => c.id === newChatroom.id);
        return exists ? prev : [newChatroom, ...prev];
      });
    });

    // Listen globally for direct messages
    messageChannel.listen(".message.sent", (event) => {
      const message = event.message || event;
      const chatroomId = message.message_chatroom_id;

      setChatrooms((prev) => {
        let updated = prev.map((c) =>
          c.id === chatroomId
            ? {
                ...c,
                messages: [message],
                unread_count:
                  selectedChatroom?.id === chatroomId
                    ? 0
                    : (c.unread_count || 0) + 1,
              }
            : c
        );

        updated.sort((a, b) => {
          const timeA = a.messages?.[0]?.created_at || a.updated_at;
          const timeB = b.messages?.[0]?.created_at || b.updated_at;
          return new Date(timeB) - new Date(timeA);
        });

        if (chatFilter === "unread") {
          updated = updated.filter((c) => c.unread_count > 0);
        }

        return updated;
      });

      setMessages((prev) =>
        selectedChatroom?.id === chatroomId ? [message, ...prev] : prev
      );
    });

    messageChannel.listen(".message.read", (event) => {
      const receiverId = event.receiver_id;
      setChatrooms((prev) =>
        prev.map((c) =>
          c.cr_user_one_id === receiverId || c.cr_user_two_id === receiverId
            ? { ...c, unread_count: 0 }
            : c
        )
      );
    });

    // Subscribe to all active chatrooms
    if (chatrooms.length > 0) {
      chatrooms.forEach((room) => {
        const roomChannel = echo.private(`chatroom.${room.id}`);

        roomChannel.listen(".message.sent", (event) => {
          const message = event.message || event;
          const chatroomId = message.message_chatroom_id;

          setChatrooms((prev) =>
            prev.map((c) =>
              c.id === chatroomId
                ? {
                    ...c,
                    messages: [message],
                    unread_count:
                      selectedChatroom?.id === chatroomId
                        ? 0
                        : (c.unread_count || 0) + 1,
                  }
                : c
            )
          );

          setMessages((prev) =>
            selectedChatroom?.id === chatroomId ? [message, ...prev] : prev
          );
        });

        roomChannel.listen(".message.read", (event) => {
          const receiverId = event.receiver_id;
          setChatrooms((prev) =>
            prev.map((c) =>
              c.id === room.id ? { ...c, unread_count: 0 } : c
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

        subscribedChannels.push(`chatroom.${room.id}`);
      });
    }

    // Cleanup
    return () => {
      echo.leave(`private-chatrooms.${currentUserId}`);
      echo.leave(`private-messages.${currentUserId}`);
      subscribedChannels.forEach((ch) => echo.leave(ch));
    };
  }, [currentUserId, chatrooms, selectedChatroom, chatFilter]);

  /* ----------------------------------------
   * Messaging Operations
   * ---------------------------------------- */
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
      setSnackbar({
        open: true,
        message: "Failed to send message.",
        severity: "error",
      });
    } finally {
      setSending(false);
    }
  }, [messageText, selectedChatroom, sending, currentUserId]);

  /* ----------------------------------------
   * User Operations
   * ---------------------------------------- */
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
        setSnackbar({
          open: true,
          message: "Failed to load users.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* ----------------------------------------
   * Snackbar Controls
   * ---------------------------------------- */
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  /* ----------------------------------------
   * Auto-load Chatrooms When Drawer Opens
   * ---------------------------------------- */
  useEffect(() => {
    if (isOpen) handleGetChatrooms();
  }, [isOpen, handleGetChatrooms]);

  /* ----------------------------------------
   * Public API
   * ---------------------------------------- */
  return {
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
    chatFilter,
    setMessageText,
    handleToggleDrawer,
    handleCloseChat,
    handleOpenChatroom,
    handleCreateChatroom,
    handleSendMessage,
    handleGetChatrooms,
    handleGetUsers,
    handleCloseSnackbar,
    setSnackbar,
    currentUserId,
  };
};
