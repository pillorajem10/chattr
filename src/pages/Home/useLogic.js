/* ===================================================
   Home Page Logic Hook
   ---------------------------------------------------
   Handles:
   - Post fetching with infinite scroll
   - Optimistic like/unlike behavior
   - Snackbar notifications
   - UI state management
====================================================== */

import { useState, useRef, useEffect, useCallback } from "react";
import actions from "@actions";
import { echo } from "@utils/echo";

export const useLogic = () => {
  /* ----------------------------------------
   * References
   * ---------------------------------------- */
  const loadingRef = useRef(false); // Prevents multiple simultaneous fetches
  const observerRef = useRef(null); // IntersectionObserver instance
  const loaderRef = useRef(null);   // Scroll trigger element

  /* ----------------------------------------
   * States
   * ---------------------------------------- */
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [formValues, setFormValues] = useState({ post_content: "" });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [pageDetails, setPageDetails] = useState({
    totalRecords: 0,
    pageIndex: 1,
    totalPages: 1,
  });

  /* ----------------------------------------
   * Fetch Posts (with optional append)
   * Used for both initial load and infinite scroll
   * ---------------------------------------- */
  const handlePostsFetch = useCallback(
    async ({ pageIndex = 1, append = false } = {}) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        const response = await actions.post.fetchPostsAction({ pageIndex });

        if (!response.success)
          throw new Error(response.msg || "Failed to fetch posts.");

        const newRecords = response.data.records || [];

        setPosts((prev) =>
          append ? [...prev, ...newRecords] : newRecords
        );

        setPageDetails({
          totalRecords: response.data.totalRecords || 0,
          pageIndex: response.data.pageIndex || 1,
          totalPages: response.data.totalPages || 1,
        });
      } catch (error) {
        console.error("Fetch Posts Error:", error);
        setSnackbar({
          open: true,
          message: error.message || "An unexpected error occurred.",
          severity: "error",
        });
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    []
  );

  /* ----------------------------------------
   * Like Post
   * Optimistic update for immediate feedback
   * ---------------------------------------- */
  const handleLikePost = useCallback(async (postId) => {
    try {
      // Update UI instantly
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likesCount: post.likesCount + 1,
                likedByUser: true,
              }
            : post
        )
      );

      // API request
      const response = await actions.reaction.reactToPostAction(postId);
      if (!response.success)
        throw new Error(response.msg || "Failed to like the post.");
    } catch (error) {
      console.error("Like Post Error:", error);
      setSnackbar({
        open: true,
        message: error.message || "An unexpected error occurred.",
        severity: "error",
      });
    }
  }, []);

  /* ----------------------------------------
   * Remove Like (Unlike Post)
   * Also performs optimistic update
   * ---------------------------------------- */
  const handleRemoveLikePost = useCallback(async (reactionId, postId) => {
    if (!reactionId) return;

    try {
      // Optimistic state update
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                likedByUser: false,
                likesCount: Math.max(post.likesCount - 1, 0),
              }
            : post
        )
      );

      // API call
      const response = await actions.reaction.removeReactFromPostAction(
        reactionId
      );
      if (!response.success)
        throw new Error(response.msg || "Failed to remove like.");
    } catch (error) {
      console.error("Remove Like Post Error:", error);
      setSnackbar({
        open: true,
        message: error.message || "An unexpected error occurred.",
        severity: "error",
      });
    }
  }, []);

  /* ----------------------------------------
   * Infinite Scroll
   * Triggers when near bottom (Instagram-style)
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
          await handlePostsFetch({
            pageIndex: pageDetails.pageIndex + 1,
            append: true,
          });
        }
      },
      {
        rootMargin: "800px 0px 800px 0px", // Trigger early
        threshold: 0.1,
      }
    );

    const currentLoader = loaderRef.current;
    observerRef.current.observe(currentLoader);

    return () => observerRef.current?.unobserve(currentLoader);
  }, [handlePostsFetch, pageDetails, loading]);

  useEffect(() => {
    const channel = echo.private("reactions");

    // When someone likes a post
    channel.listen(".reaction.created", (event) => {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === event.postId
            ? { ...post, likesCount: event.likesCount }
            : post
        )
      );
    });

    // When someone unlikes a post
    channel.listen(".reaction.removed", (event) => {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === event.postId
            ? { ...post, likesCount: event.likesCount }
            : post
        )
      );
    });

    return () => echo.leaveChannel("private-reactions");
  }, []);

  /* ----------------------------------------
   * Initial Data Load
   * ---------------------------------------- */
  useEffect(() => {
    handlePostsFetch({ pageIndex: 1 });
  }, [handlePostsFetch]);

  /* ----------------------------------------
   * Expose Reactive State & Functions
   * ---------------------------------------- */
  return {
    loading,
    posts,
    snackbar,
    showCreatePostModal,
    pageDetails,
    formValues,
    loaderRef,
    handlePostsFetch,
    handleLikePost,
    handleRemoveLikePost,
    setSnackbar,
  };
};
