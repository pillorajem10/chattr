import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";

/**
 * PostCardFooter Component
 * ------------------------------------------------------------------
 * Parent Section: PostCard  (Section: PostCards)
 *
 * Handles user engagement interactions for each post:
 *  - Like / Unlike with optimistic UI updates
 *  - Open detailed post view (comments)
 *  - Trigger share modal for reposting
 *
 * Keeps UI state synchronized with backend updates and
 * real-time events from other users.
 * ------------------------------------------------------------------
 */
const PostCardFooter = ({
  postId,
  isLiked = false,
  likesCount = 0,
  commentCount = 0,
  shareCount = 0,
  reactionId = null,
  onLike,
  onRemoveLike,
  onOpenPostDetails,
  onShare,
}) => {
  /* ------------------------------------------------------------
   * Local state — for optimistic UI and real-time updates
   * ------------------------------------------------------------ */
  const [liked, setLiked] = useState(isLiked);
  const [localLikes, setLocalLikes] = useState(likesCount);
  const [localReactionId, setLocalReactionId] = useState(reactionId);

  /* ------------------------------------------------------------
   * Sync local state when parent props update
   * ------------------------------------------------------------ */
  useEffect(() => setLiked(isLiked), [isLiked]);
  useEffect(() => setLocalLikes(likesCount), [likesCount]);
  useEffect(() => setLocalReactionId(reactionId), [reactionId]);

  /* ------------------------------------------------------------
   * Handle Like / Unlike Button Click
   * Performs instant UI updates while syncing to backend
   * ------------------------------------------------------------ */
  const handleLikeClick = async () => {
    if (liked) {
      // Unlike post
      setLiked(false);
      setLocalLikes((prev) => Math.max(prev - 1, 0));

      if (localReactionId) {
        await onRemoveLike?.(localReactionId, postId);
        setLocalReactionId(null);
      }
    } else {
      // Like post
      setLiked(true);
      setLocalLikes((prev) => prev + 1);

      const response = await onLike?.(postId);

      // Store the newly created reaction ID
      if (response?.success && response?.data?.id) {
        setLocalReactionId(response.data.id);
      }
    }
  };

  /* ------------------------------------------------------------
   * Render Footer Buttons — Like, Comment, Share
   * ------------------------------------------------------------ */
  return (
    <div className="flex justify-between items-center mt-8 text-gray-500">
      {/* ------------------------------------------------------------
           Like Button
         ------------------------------------------------------------ */}
      <button
        onClick={handleLikeClick}
        className={`flex items-center gap-2 transition-colors ${
          liked ? "text-red-500" : "hover:text-red-500"
        }`}
      >
        <Heart
          size={22}
          strokeWidth={2}
          fill={liked ? "currentColor" : "none"}
        />
        <span className="text-sm">{localLikes > 0 ? localLikes : ""}</span>
      </button>

      {/* ------------------------------------------------------------
           Comment Button
         ------------------------------------------------------------ */}
      <button
        onClick={() => onOpenPostDetails(postId)}
        className="flex items-center gap-2 hover:text-blue-500 transition-colors"
      >
        <MessageCircle size={22} strokeWidth={2} />
        <span className="text-sm">{commentCount > 0 ? commentCount : ""}</span>
      </button>

      {/* ------------------------------------------------------------
           Share Button
         ------------------------------------------------------------ */}
      <button
        onClick={() => onShare(postId)}
        className="flex items-center gap-2 hover:text-green-500 transition-colors"
      >
        <Share2 size={22} strokeWidth={2} />
        <span className="text-sm">{shareCount > 0 ? shareCount : ""}</span>
      </button>
    </div>
  );
};

export default PostCardFooter;
