/* ===================================================
   Home Page Logic Hook
   ---------------------------------------------------
   Handles:
   - Post fetching with infinite scroll
   - Optimistic like/unlike behavior
   - Snackbar notifications
   - Real-time updates for likes and comments
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
   * Fetch Posts
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

        const newRecords = (response.data.records || []).map((post) => ({
          ...post,
          commentsCount: post.commentsCount ?? post.commentCount ?? 0,
          likesCount: post.likesCount ?? post.likeCount ?? 0,
          shareCount: post.shareCount ?? post.sharesCount ?? 0,
        }));

        setPosts((prev) => (append ? [...prev, ...newRecords] : newRecords));

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
   * Like / Unlike Post
   * ---------------------------------------- */
  const handleLikePost = useCallback(async (postId) => {
    try {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, likedByUser: true, likesCount: post.likesCount + 1 }
            : post
        )
      );

      const response = await actions.reaction.reactToPostAction(postId);
      if (!response.success) throw new Error(response.msg);

      const reactionId = response?.data?.id;
      if (reactionId) {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId ? { ...post, user_reaction_id: reactionId } : post
          )
        );
      }

      return response;
    } catch (error) {
      console.error("Like Post Error:", error);
      return { success: false, msg: error.message || "Unexpected error." };
    }
  }, []);

  const handleRemoveLikePost = useCallback(async (reactionId, postId) => {
    try {
      if (!reactionId) {
        console.warn("Missing reactionId for post:", postId);
        return;
      }

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

      const response = await actions.reaction.removeReactFromPostAction(reactionId);

      if (!response.success) {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likedByUser: true,
                  likesCount: post.likesCount + 1,
                }
              : post
          )
        );
        throw new Error(response.msg || "Failed to remove like.");
      }

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, user_reaction_id: null } : post
        )
      );
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
      { rootMargin: "800px 0px 800px 0px", threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    observerRef.current.observe(currentLoader);

    return () => {
      if (observerRef.current && currentLoader) {
        observerRef.current.unobserve(currentLoader);
      }
    };
  }, [handlePostsFetch, pageDetails, loading]);

  /* ----------------------------------------
   * Open and Close Post Details
   * ---------------------------------------- */
  const handleOpenPostDetails = useCallback(async (postId) => {
    try {
      const response = await actions.post.fetchPostDetailAction(postId);
      if (!response.success)
        throw new Error(response.msg || "Failed to fetch post details.");

      const postData = response.data;
      setSelectedPost(postData);
      setShowPostDetailsModal(true);

      if (!postData.comments) {
        const commentsResponse = await actions.comment.fetchCommentsByPostAction(
          postId,
          { pageIndex: 1 }
        );
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
  }, []);

  const handleClosePostDetails = useCallback(() => {
    setShowPostDetailsModal(false);
    setSelectedPost(null);
    setPostComments([]);
  }, []);

  /* ----------------------------------------
   * Share Modal
   * ---------------------------------------- */
  const handleOpenShareModal = useCallback(async (postId) => {
    try {
      const response = await actions.post.fetchPostDetailAction(postId);
      if (!response.success)
        throw new Error(response.msg || "Failed to fetch post details for sharing.");

      setSelectedPost(response.data);
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

  const handleCloseShareModal = useCallback(() => {
    setShowShareModal(false);
    setSelectedPost(null);
  }, []);

  /* ----------------------------------------
   * Input Handlers
   * ---------------------------------------- */
  const handleCommentInputChange = (e) => {
    const { name, value } = e.target;
    setCommentFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleShareInputChange = (e) => {
    const { name, value } = e.target;
    setShareFormValues((prev) => ({ ...prev, [name]: value }));
  };

  /* ----------------------------------------
   * Submit Comment
   * ---------------------------------------- */
  const handleSubmitComment = useCallback(
    async (e) => {
      e.preventDefault();
      if (!selectedPost) return;

      try {
        const response = await actions.comment.commentToPostAction(selectedPost.id, {
          comment_content: commentFormValues.comment_content,
        });

        if (!response.success)
          throw new Error(response.msg || "Failed to submit comment.");

        setCommentFormValues({ comment_content: "" });

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
    [selectedPost, commentFormValues.comment_content]
  );

  /* ----------------------------------------
   * Submit Post
   * ---------------------------------------- */
  const handleSubmitPost = useCallback(
    async (e) => {
      e.preventDefault();
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        const response = await actions.post.createPostAction(formValues);
        if (!response.success)
          throw new Error(response.msg || "Failed to create post.");

        setFormValues({ post_content: "" });
        setSnackbar({
          open: true,
          message: "Post created successfully.",
          severity: "success",
        });

        closeCreatePostModal();
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
    },
    [formValues, handlePostsFetch, closeCreatePostModal]
  );

  /* ----------------------------------------
   * Submit Share
   * ---------------------------------------- */
  const handleSubmitShare = useCallback(
    async (e) => {
      e.preventDefault();
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        const response = await actions.share.sharePostAction(selectedPost.id, shareFormValues);
        if (!response.success)
          throw new Error(response.msg || "Failed to share post.");

        setShareFormValues({ share_caption: "" });
        setSnackbar({
          open: true,
          message: "Post shared successfully.",
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
    },
    [shareFormValues, selectedPost, handleCloseShareModal, handlePostsFetch]
  );

  /* ----------------------------------------
   * Real-time Updates (Likes)
   * ---------------------------------------- */
  useEffect(() => {
    const channel = echo.channel("reactions");

    channel.listen(".reaction.created", (event) => {
      const payload = event.reaction || event;
      const postId = Number(payload.post_id || payload.reaction_post_id);
      const count = payload.likesCount;

      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likesCount: count } : p))
      );
    });

    channel.listen(".reaction.removed", (event) => {
      const payload = event.reaction || event;
      const postId = Number(payload.post_id || payload.reaction_post_id);
      const count = payload.likesCount;

      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likesCount: count } : p))
      );
    });

    return () => {
      echo.leave("reactions");
    };
  }, []);

  /* ----------------------------------------
   * Real-time Updates (Comments)
   * ---------------------------------------- */
  useEffect(() => {
    const channel = echo.channel("comments");

    channel.listen(".comment.created", (event) => {
      const { comment, commentCount } = event;
      if (!comment) return;

      const postId = Number(comment.comment_post_id || comment.post_id);
      const newCount = Number(commentCount ?? 0);

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, commentsCount: newCount } : p
        )
      );

      if (selectedPost?.id === postId) {
        setSelectedPost((prev) => (prev ? { ...prev, commentsCount: newCount } : prev));
        setPostComments((prev) => [...prev, comment]);
      }
    });

    return () => {
      echo.leave("comments");
    };
  }, [selectedPost]);

  /* ----------------------------------------
   * Initial Data Load
   * ---------------------------------------- */
  useEffect(() => {
    handlePostsFetch({ pageIndex: 1 });
  }, [handlePostsFetch]);

  /* ----------------------------------------
   * Expose State and Handlers
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
    handlePostsFetch,
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
