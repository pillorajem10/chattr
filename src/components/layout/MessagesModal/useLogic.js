/* ===================================================
   Message Modal Logic Hook
   ---------------------------------------------------
   Handles:
   - Loading chatrooms and users
   - Opening and creating chatrooms
   - Real-time chatroom updates via Echo
   - Sending and receiving messages in real-time
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
   * UI State
   * ---------------------------------------- */
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("list");
  const [selectedChatroom, setSelectedChatroom] = useState(null);

  /* ----------------------------------------
   * Data State
   * ---------------------------------------- */
  const [chatrooms, setChatrooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [users, setUsers] = useState([]);

  const [userPageDetails, setUserPageDetails] = useState({
    totalRecords: 0,
    pageIndex: 1,
    totalPages: 1,
  });

  /* ----------------------------------------
   * Loading & Snackbar
   * ---------------------------------------- */
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
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
  const handleGetChatrooms = useCallback(async (filter = "all") => {
    try {
      setLoading(true);
      const res = await actions.message.getUserChatroomsAction(filter);
      if (!res.success) throw new Error(res.msg || "Failed to load chatrooms.");
      setChatrooms(res.data);
    } catch (error) {
      console.error("Chatroom Load Error:", error);
      setSnackbar({
        open: true,
        message: "Failed to load chatrooms.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpenChatroom = useCallback(async (chatroom) => {
    try {
      setLoading(true);
      setView("chat");
      setSelectedChatroom(chatroom);
      chatroomRef.current = chatroom.id;

      const res = await actions.message.getConversationAction(chatroom.id);
      if (!res.success) throw new Error(res.msg || "Failed to load messages.");

      setMessages(res.data.records);

      // Mark as read immediately when opening
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

        // Determine which user is the receiver
        const isUserOne = newChatroom.cr_user_one_id === currentUserId;
        const receiver = isUserOne
          ? newChatroom.user_two || newChatroom.userTwo
          : newChatroom.user_one || newChatroom.userOne;

        // Ensure receiver details are embedded for display
        newChatroom = {
          ...newChatroom,
          receiver_name: receiver
            ? `${receiver.user_fname} ${receiver.user_lname}`
            : "User",
        };

        // Add chatroom to list if not existing
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
   * Real-Time Chatroom Events (Echo)
   * ---------------------------------------- */
  useEffect(() => {
    if (!currentUserId) return;

    const channel = echo.private(`chatrooms.${currentUserId}`);

    channel.listen(".chatroom.created", (event) => {
      const newChatroom = event.chatroom;
      setChatrooms((prev) => {
        const exists = prev.some((c) => c.id === newChatroom.id);
        return exists ? prev : [newChatroom, ...prev];
      });
    });

    return () => {
      echo.leave(`private-chatrooms.${currentUserId}`);
    };
  }, [currentUserId]);

  /* ----------------------------------------
   * Real-Time Message Updates (Echo)
   * ---------------------------------------- */
  useEffect(() => {
    if (!selectedChatroom?.id) return;

    const chatroomId = selectedChatroom.id;
    const channel = echo.private(`chatroom.${chatroomId}`);

    // Listen for new messages in this chatroom
    channel.listen(".message.sent", (event) => {
      setMessages((prev) => [event, ...prev]);
    });

    // Listen for read receipts
    channel.listen(".message.read", (event) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.message_sender_id === event.receiver_id
            ? { ...msg, message_read: true }
            : msg
        )
      );
    });

    return () => {
      echo.leave(`private-chatroom.${chatroomId}`);
    };
  }, [selectedChatroom?.id]);

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

      setMessages((prev) => [res.data.message, ...prev]);
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

        const params = {
          pageIndex,
          pageSize: 500,
        };

        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

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
