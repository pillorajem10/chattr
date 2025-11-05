import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { echo } from "@utils/echo";
import actions from "@actions";
import cookie from "js-cookie";

/**
 * useLogic Hook
 * ------------------------------------------------------------
 * Handles all logic for the NotificationsDrawer component.
 * Responsibilities include:
 *  - Fetching and paginating notifications
 *  - Managing filter state (All / Unread)
 *  - Infinite scroll pagination
 *  - Marking notifications as read (single or all)
 *  - Real-time updates via Laravel Echo
 *  - Reporting unread count to parent (e.g. Sidebar badge)
 * ------------------------------------------------------------
 */
export const useLogic = (onUnreadCountChange) => {
  /** ------------------------------------------------------------
   * Current User
   * ------------------------------------------------------------ */
  const account = JSON.parse(cookie.get("account") || "{}");

  /** ------------------------------------------------------------
   * References
   * ------------------------------------------------------------ */
  const loadingRef = useRef(false);
  const observerRef = useRef(null);
  const loaderRef = useRef(null);

  /** ------------------------------------------------------------
   * States
   * ------------------------------------------------------------ */
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [pageDetails, setPageDetails] = useState({
    totalRecords: 0,
    pageIndex: 1,
    totalPages: 1,
  });

  /** ------------------------------------------------------------
   * Fetch Notifications (Initial + Paginated)
   * ------------------------------------------------------------ */
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
        console.error("Notifications Fetch Error:", error);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [filter]
  );

  /** ------------------------------------------------------------
   * Filter Switching (All / Unread)
   * ------------------------------------------------------------ */
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

  /** ------------------------------------------------------------
   * Mark Notifications as Read
   * ------------------------------------------------------------ */
  const markAllAsRead = useCallback(async () => {
    try {
      const res = await actions.notification.markAllNotificationsAsReadAction();
      if (res?.success) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, notification_read: true }))
        );
      }
    } catch (err) {
      console.error("Mark All As Read Error:", err);
    }
  }, []);

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
      console.error("Mark Single Notification Error:", err);
    }
  }, []);

  /** ------------------------------------------------------------
   * Derived State (Computed)
   * ------------------------------------------------------------ */
  const allRead = useMemo(
    () => notifications.every((n) => n.notification_read),
    [notifications]
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.notification_read).length,
    [notifications]
  );

  /** ------------------------------------------------------------
   * Real-Time Notifications (Laravel Echo)
   * ------------------------------------------------------------ */
  useEffect(() => {
    const channel = echo.private(`notifications.${account.id}`);

    channel.listen(".notification.created", (event) => {
      const newNotification = event.notification;
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => {
      echo.leave(`private-notifications.${account.id}`);
    };
  }, [account.id]);

  /** ------------------------------------------------------------
   * Notify Parent on Unread Count Change
   * ------------------------------------------------------------ */
  useEffect(() => {
    if (onUnreadCountChange) onUnreadCountChange(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  /** ------------------------------------------------------------
   * Infinite Scroll Pagination
   * ------------------------------------------------------------ */
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

  /** ------------------------------------------------------------
   * Initial Fetch
   * ------------------------------------------------------------ */
  useEffect(() => {
    handleNotificationsFetch({ pageIndex: 1 });
  }, [filter, handleNotificationsFetch]);

  /** ------------------------------------------------------------
   * Return Public API
   * ------------------------------------------------------------ */
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
