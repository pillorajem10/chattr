// logics 
import { useLogic } from './useLogic';

// contexts
import { usePostModal } from "@contexts/PostModalContext";

// sections
import PostCards from "@sections/HomeSections/PostCards";

// components
import LoadingScreen from "@components/common/LoadingScreen";
import SnackbarAlert from "@components/common/SnackbarAlert";
import PostDetailsModal from "@components/posts/PostDetailsModal";
import CreatePostModal from "@components/posts/CreatePostModal";
import ShareModal from "@components/posts/ShareModal";

/**
 * Home Component
 * ------------------------------------------------------------------
 * Serves as the main feed view.
 * Handles:
 *  - Displaying and loading posts
 *  - Infinite scroll for post pagination
 *  - Post creation, sharing, and comment interactions
 *  - Snackbar notifications for user feedback
 *
 * Integrates modal components and shared context for smooth
 * user experience across the feed.
 * ------------------------------------------------------------------
 */
const Home = () => {
  const {
    loading,
    posts,
    snackbar,
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
    handleShareInputChange,
    handleSubmitShare,
    handleOpenShareModal,
    handleCloseShareModal,
    setSnackbar,
  } = useLogic();

  const { showCreatePostModal, closeCreatePostModal } = usePostModal();

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-50">
      {/* ------------------------------------------------------------
           Posts Section — Feed with Infinite Scroll
         ------------------------------------------------------------ */}
      {loading && posts.length === 0 ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="w-full max-w-2xl mt-6 px-4">
            <PostCards
              posts={posts}
              onLike={handleLikePost}
              onRemoveLike={handleRemoveLikePost}
              onOpenPostDetails={handleOpenPostDetails}
              onShare={handleOpenShareModal}
            />
          </div>

          {/* Infinite Scroll Loader */}
          <div
            ref={loaderRef}
            className="h-10 flex justify-center items-center my-4 text-gray-400"
          >
            {loading && posts.length > 0 && "Loading more posts..."}
          </div>
        </>
      )}

      {/* ------------------------------------------------------------
           Snackbar — Feedback Notifications
         ------------------------------------------------------------ */}
      {snackbar.open && (
        <SnackbarAlert
          open={snackbar.open}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          message={snackbar.message}
          severity={snackbar.severity}
        />
      )}

      {/* ------------------------------------------------------------
           Post Details Modal — View and Comment
         ------------------------------------------------------------ */}
      {showPostDetailsModal && selectedPost && (
        <PostDetailsModal
          post={selectedPost}
          comments={postComments}
          open={showPostDetailsModal}
          onSubmitComment={handleSubmitComment}
          onCommentInputChange={handleCommentInputChange}
          commentFormValues={commentFormValues}
          onClose={handleClosePostDetails}
        />
      )}

      {/* ------------------------------------------------------------
           Share Modal — Repost with Caption
         ------------------------------------------------------------ */}
      {showShareModal && selectedPost && (
        <ShareModal
          open={showShareModal}
          onClose={handleCloseShareModal}
          post={selectedPost}
          formValues={shareFormValues}
          onChange={handleShareInputChange}
          onSubmit={handleSubmitShare}
        />
      )}

      {/* ------------------------------------------------------------
           Create Post Modal — Triggered from Sidebar/Footer
         ------------------------------------------------------------ */}
      {showCreatePostModal && (
        <CreatePostModal
          open={showCreatePostModal}
          onClose={closeCreatePostModal}
          formValues={formValues}
          onChange={handlePostInputChange}
          onSubmit={handleSubmitPost}
        />
      )}
    </div>
  );
};

export default Home;
