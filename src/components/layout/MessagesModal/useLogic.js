/* ===================================================
   Message Modal Logic Hook
   ---------------------------------------------------
   Handles:
   - Toggling message drawer states
   - Loading chatrooms
   - Selecting and viewing conversation
   - Sending and reading messages
====================================================== */

import { useState, useCallback, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import actions from "@actions";

export const useLogic = () => {
  /* ----------------------------------------
   * Current User (from cookie)
   * ---------------------------------------- */
  const accountCookie = Cookies.get("account");
  const currentUser = accountCookie ? JSON.parse(accountCookie) : null;
  const currentUserId = currentUser ? Number(currentUser.id) : null;

  /* ----------------------------------------
   * UI State
   * ---------------------------------------- */
  const [isOpen, setIsOpen] = useState(false); // modal open/close
  const [view, setView] = useState("list"); // "list" or "chat"
  const [selectedChatroom, setSelectedChatroom] = useState(null);

  /* ----------------------------------------
   * Data State
   * ---------------------------------------- */
  const [chatrooms, setChatrooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

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
   * Toggle Drawer
   * ---------------------------------------- */
  const toggleDrawer = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) loadChatrooms();
  }, [isOpen]);

  const closeChat = useCallback(() => {
    setView("list");
    setSelectedChatroom(null);
    setMessages([]);
  }, []);

  /* ----------------------------------------
   * Load Chatrooms
   * ---------------------------------------- */
  const loadChatrooms = useCallback(async (filter = "all") => {
    console.log("Loading chatrooms with filter:", filter);

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

  /* ----------------------------------------
   * Load Messages
   * ---------------------------------------- */
  const openChatroom = useCallback(async (chatroom) => {
    try {
      setLoading(true);
      setView("chat");
      setSelectedChatroom(chatroom);
      chatroomRef.current = chatroom.id;

      const res = await actions.message.getConversationAction(chatroom.id);
      if (!res.success) throw new Error(res.msg || "Failed to load messages.");

      setMessages(res.data.records);

      // Mark as read
      await actions.message.markConversationAsReadAction(chatroom.id);

      // Reset unread count locally
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

  /* ----------------------------------------
   * Send Message
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
        message_receiver_id: receiverId,
        message_content: messageText.trim(),
      });

      if (!res.success) throw new Error(res.msg || "Failed to send message.");

      // Add new message to the local state
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
   * Snackbar Close
   * ---------------------------------------- */
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  /* ----------------------------------------
   * Auto-load Chatrooms When Open
   * ---------------------------------------- */
  useEffect(() => {
    if (isOpen) loadChatrooms();
  }, [isOpen, loadChatrooms]);

  /* ----------------------------------------
   * Return Public State & Methods
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
    setMessageText,
    toggleDrawer,
    closeChat,
    openChatroom,
    handleSendMessage,
    loadChatrooms,
    handleCloseSnackbar,
    currentUserId,
  };
};
