import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";

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
  // Local reactive state to reflect instant like/unlike feedback
  const [liked, setLiked] = useState(isLiked);
  const [localLikes, setLocalLikes] = useState(likesCount);

  // Keep local state in sync with parent updates (e.g., realtime updates or refresh)
  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  useEffect(() => {
    setLocalLikes(likesCount);
  }, [likesCount]);

  const handleLikeClick = async () => {
    // Prevent double toggles until backend responds
    if (liked && reactionId) {
      // Unlike
      setLiked(false);
      setLocalLikes((prev) => Math.max(prev - 1, 0));
      await onRemoveLike?.(reactionId, postId);
    } else {
      // Like
      setLiked(true);
      setLocalLikes((prev) => prev + 1);
      await onLike?.(postId);
    }
  };

  return (
    <div className="flex justify-between items-center mt-8 text-gray-500">
      {/* Like Button */}
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

      {/* Comment Button */}
      <button
        onClick={() => onOpenPostDetails(postId)}
        className="flex items-center gap-2 hover:text-blue-500 transition-colors"
      >
        <MessageCircle size={22} strokeWidth={2} />
        <span className="text-sm">{commentCount > 0 ? commentCount : ""}</span>
      </button>

      {/* Share Button */}
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
