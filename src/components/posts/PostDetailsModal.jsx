import { X, MessageCircle, User } from "lucide-react";
import AddCommentForm from "@subcomponents/PostsDetailsModalSubComponents/AddCommentForm";

/**
 * PostDetailsModal Component
 * ------------------------------------------------------------------
 * Displays the full details of a post inside a centered modal.
 * Includes:
 *  - Post content and author information
 *  - Scrollable list of comments
 *  - Fixed comment input form at the bottom
 *
 * Designed for viewing and engaging with individual posts without
 * leaving the current page.
 * ------------------------------------------------------------------
 */
const PostDetailsModal = ({
  post,
  comments,
  open,
  onClose,
  onCommentInputChange,
  onSubmitComment,
  commentFormValues,
}) => {
  if (!open || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden relative">

        {/* ------------------------------------------------------------
             Header — Author Info and Close Button
           ------------------------------------------------------------ */}
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-gray-200 rounded-full p-2">
              <User size={20} className="text-gray-600" />
            </div>
            <span className="font-semibold text-gray-800">
              {post.user?.user_fname} {post.user?.user_lname}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* ------------------------------------------------------------
             Post Content
           ------------------------------------------------------------ */}
        <div className="p-5 overflow-y-auto flex-shrink-0 border-b">
          <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
            {post.post_content}
          </p>
        </div>

        {/* ------------------------------------------------------------
             Comments List — Scrollable Section
           ------------------------------------------------------------ */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <MessageCircle size={16} /> Comments
          </h3>

          {comments && comments.length > 0 ? (
            <div className="space-y-3 pb-16">
              {comments.map((comment, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="bg-gray-200 rounded-full p-1 mt-1">
                    <User size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {comment.user?.user_fname} {comment.user?.user_lname}
                    </p>
                    <p className="text-sm text-gray-700">
                      {comment.comment_content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No comments yet.</p>
          )}
        </div>

        {/* ------------------------------------------------------------
             Comment Form — Fixed at Bottom
           ------------------------------------------------------------ */}
        <div className="border-t bg-white px-4 py-3 sticky bottom-0">
          <AddCommentForm
            value={commentFormValues.comment_content}
            onChange={onCommentInputChange}
            onSubmit={onSubmitComment}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetailsModal;
