/* ===================================================
   Notifications Drawer Logic Hook
   ---------------------------------------------------
   Handles:
   - Notification fetching and pagination
   - Infinite scroll for seamless loading
   - Filter switching (All / Unread)
   - Mark all or individual notifications as read
   - Tracks unread count for sidebar badge
====================================================== */

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import actions from "@actions";

export const useLogic = (onUnreadCountChange) => {
  const loadingRef = useRef(false);
  const observerRef = useRef(null);
  const loaderRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [pageDetails, setPageDetails] = useState({
    totalRecords: 0,
    pageIndex: 1,
    totalPages: 1,
  });

  /* ----------------------------------------
   * Fetch Notifications
   * ---------------------------------------- */
  const handleNotificationsFetch = useCallback(
    async ({ pageIndex = 1, append = false, customFilter } = {}) => {
      const activeFilter = customFilter || filter;
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);

      try {
        const response = await actions.notification.fetchNotificationsAction({
          pageIndex,
          pageSize: 20,
          filter: activeFilter,
        });

        if (!response.success)
          throw new Error(response.msg || "Failed to fetch notifications.");

        const newRecords = response.data.records || [];
        setNotifications((prev) =>
          append ? [...prev, ...newRecords] : newRecords
        );

        setPageDetails({
          totalRecords: response.data.totalRecords || 0,
          pageIndex: response.data.pageIndex || 1,
          totalPages: response.data.totalPages || 1,
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [filter]
  );

  /* ----------------------------------------
   * Handle Filter Change
   * ---------------------------------------- */
  const handleFilterChange = useCallback(
    async (newFilter) => {
      if (newFilter === filter) return;
      setFilter(newFilter);
      await handleNotificationsFetch({
        pageIndex: 1,
        append: false,
        customFilter: newFilter,
      });
    },
    [filter, handleNotificationsFetch]
  );

  /* ----------------------------------------
   * Mark All As Read
   * ---------------------------------------- */
  const markAllAsRead = useCallback(async () => {
    try {
      const res = await actions.notification.markAllNotificationsAsReadAction();
      if (res?.success) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, notification_read: true }))
        );
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  }, []);

  /* ----------------------------------------
   * Mark Single Notification As Read
   * ---------------------------------------- */
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const res = await actions.notification.markNotificationAsReadAction(
        notificationId
      );
      if (res?.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, notification_read: true } : n
          )
        );
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  }, []);

  /* ----------------------------------------
   * Derived State (computed values)
   * ---------------------------------------- */
  const allRead = useMemo(
    () => notifications.every((n) => n.notification_read),
    [notifications]
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.notification_read).length,
    [notifications]
  );

  /* ----------------------------------------
   * Notify parent (e.g. sidebar) when unread count changes
   * ---------------------------------------- */
  useEffect(() => {
    if (onUnreadCountChange) onUnreadCountChange(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  /* ----------------------------------------
   * Infinite Scroll
   * ---------------------------------------- */
  useEffect(() => {
    if (!loaderRef.current) return;

    observerRef.current = new IntersectionObserver(
      async (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          !loading &&
          pageDetails.pageIndex < pageDetails.totalPages
        ) {
          await handleNotificationsFetch({
            pageIndex: pageDetails.pageIndex + 1,
            append: true,
          });
        }
      },
      { rootMargin: "600px 0px 600px 0px", threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    observerRef.current.observe(currentLoader);
    return () => observerRef.current?.unobserve(currentLoader);
  }, [handleNotificationsFetch, pageDetails, loading]);

  /* ----------------------------------------
   * Initial Fetch
   * ---------------------------------------- */
  useEffect(() => {
    handleNotificationsFetch({ pageIndex: 1 });
  }, [filter, handleNotificationsFetch]);

  /* ----------------------------------------
   * Expose to Component
   * ---------------------------------------- */
  return {
    loading,
    notifications,
    allRead,
    unreadCount,
    filter,
    loaderRef,
    handleFilterChange,
    markAllAsRead,
    markAsRead,
  };
};
