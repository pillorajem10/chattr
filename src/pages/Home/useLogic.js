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
import { usePostModal } from "@contexts/PostModalContext";

export const useLogic = () => {
  /* ----------------------------------------
   * References
   * ---------------------------------------- */
  const loadingRef = useRef(false);
  const observerRef = useRef(null);
  const loaderRef = useRef(null);   
  const { closeCreatePostModal } = usePostModal();

  /* ----------------------------------------
   * States
   * ---------------------------------------- */
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postComments, setPostComments] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPostDetailsModal, setShowPostDetailsModal] = useState(false);

  const [shareFormValues, setShareFormValues] = useState({ share_caption: "" });
  const [formValues, setFormValues] = useState({ post_content: "" });
  const [commentFormValues, setCommentFormValues] = useState({ comment_content: "" });

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

  /* ----------------------------------------
  * Fetch post details
  * Triggers post details modal
  * Open Post Details Modal
  * ---------------------------------------- */
  const handleOpenPostDetails = useCallback(async (postId) => {
    try {
      const response = await actions.post.fetchPostDetailAction(postId);

      if (!response.success) throw new Error(response.msg || "Failed to fetch post details.");

      const postData = response.data;
      setSelectedPost(postData);
      setShowPostDetailsModal(true);

      // Fetch comments separately only if not already included
      if (!postData.comments) {
        const commentsResponse = await actions.comment.fetchCommentsByPostAction(postId, { pageIndex: 1 });
        if (commentsResponse.success) {
          setPostComments(commentsResponse.data || []);
        }
      } else {
        setPostComments(postData.comments);
      }
    } catch (error) {
      console.error("Fetch Post Details Error:", error);
      setSnackbar({
        open: true,
        message: error.message || "An unexpected error occurred.",
        severity: "error",
      });
    }
  }, [selectedPost]);

  /* ----------------------------------------
  * Handle Open Share Modal
  * Fetches post details for sharing
  * ---------------------------------------- */
  const handleOpenShareModal = useCallback(async (postId) => {
    try {
      const response = await actions.post.fetchPostDetailAction(postId);

      if (!response.success)
        throw new Error(response.msg || "Failed to fetch post details for sharing.");

      const postData = response.data;
      setSelectedPost(postData);
      setShowShareModal(true);
    } catch (error) {
      console.error("Open Share Modal Error:", error);
      setSnackbar({
        open: true,
        message: error.message || "An unexpected error occurred while opening share modal.",
        severity: "error",
      });
    }
  }, []);

  /* ----------------------------------------
  * Close Share Modal
  * ---------------------------------------- */
  const handleCloseShareModal = useCallback(() => {
    setShowShareModal(false);
    setSelectedPost(null);
  }, []);

  /* ----------------------------------------
  * Close Post Details Modal
  * ---------------------------------------- */
  const handleClosePostDetails = useCallback(() => {
    setShowPostDetailsModal(false);
    setSelectedPost(null);
    setPostComments([]);
  }, []);

  /* ----------------------------------------
  * Handle Comment Input Change
  * ---------------------------------------- */
  const handleCommentInputChange = (e) => {
    const { name, value } = e.target;
    setCommentFormValues((prev) => ({ ...prev, [name]: value }));
  };

  /* ----------------------------------------
  * Handle Post Input Change
  * ---------------------------------------- */
  const handlePostInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  /* ----------------------------------------
  * Handle Share Input Change
  * ---------------------------------------- */
  const handleShareInputChange = (e) => {
    const { name, value } = e.target;
    setShareFormValues((prev) => ({ ...prev, [name]: value }));
  };

  /* ----------------------------------------
  * Handle Submit Comment
  * ---------------------------------------- */
  const handleSubmitComment = useCallback(
    async (e) => {
      e.preventDefault();
      if (!selectedPost) return;

      try {
        const response = await actions.comment.commentToPostAction(
          selectedPost.id,
          { comment_content: commentFormValues.comment_content }
        );

        if (!response.success)
          throw new Error(response.msg || "Failed to submit comment.");

        // Clear input
        setCommentFormValues({ comment_content: "" });

        // Refresh comments
        const commentsResponse = await actions.comment.fetchCommentsByPostAction(
          selectedPost.id,
          { pageIndex: 1 }
        );

        if (commentsResponse.success) {
          setPostComments(commentsResponse.data || []);
        }
      } catch (error) {
        console.error("Submit Comment Error:", error);
        setSnackbar({
          open: true,
          message: error.message || "An unexpected error occurred.",
          severity: "error",
        });
      }
    },
    [
      selectedPost,
      commentFormValues.comment_content,
    ]
  );

  /* ----------------------------------------
  * Handle Submit Post
  * ---------------------------------------- */
 const handleSubmitPost = useCallback(async (e) => {
    e.preventDefault();
    
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const response = await actions.post.createPostAction(formValues);

      if (!response.success)
        throw new Error(response.msg || "Failed to create post.");

      // Clear form
      setFormValues({ post_content: "" });
      setSnackbar({
        open: true,
        message: "Post created successfully!",
        severity: "success",
      });

      closeCreatePostModal();
    
      // Refresh posts
      await handlePostsFetch({ pageIndex: 1 });
    } catch (error) {
      console.error("Create Post Error:", error);
      setSnackbar({
        open: true,
        message: error.message || "An unexpected error occurred.",
        severity: "error",
      });
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
 }, [formValues]);

  /* ----------------------------------------
  * Handle Submit Share
  * ---------------------------------------- */
 const handleSubmitShare = useCallback(async (e) => {
    e.preventDefault();

    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const response = await actions.share.sharePostAction(
        selectedPost.id,
        shareFormValues
      );
      if (!response.success)
        throw new Error(response.msg || "Failed to share post.");

      
      setShareFormValues({ share_caption: "" });

      setSnackbar({
        open: true,
        message: "Post shared successfully!",
        severity: "success",
      });

      handleCloseShareModal();

      await handlePostsFetch({ pageIndex: 1 });
    } catch (error) {
      console.error("Share Post Error:", error);

      setSnackbar({
        open: true,
        message: error.message || "An unexpected error occurred.",
        severity: "error",
      });
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [shareFormValues, selectedPost, handleCloseShareModal]);

  /* ----------------------------------------
   * Real-time Updates via Echo
   * Listens for like/unlike events
   * ---------------------------------------- */
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
    pageDetails,
    formValues,
    commentFormValues,
    loaderRef,
    postComments,
    selectedPost,
    showShareModal, 
    shareFormValues,
    showPostDetailsModal,
    handleSubmitComment,
    handleLikePost,
    handleRemoveLikePost,
    handleClosePostDetails,
    handleCommentInputChange,
    handlePostInputChange,
    handleOpenPostDetails,
    handleSubmitPost,
    handleSubmitShare,
    handleShareInputChange,
    handleOpenShareModal,
    handleCloseShareModal,
    setSnackbar,
  };
};
