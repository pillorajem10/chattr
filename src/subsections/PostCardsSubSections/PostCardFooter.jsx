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
  const handleLikeClick = () => {
    if (isLiked && reactionId) {
      onRemoveLike?.(reactionId, postId);
    } else {
      onLike?.(postId);
    }
  };

  return (
    <div className="flex justify-between items-center mt-8 text-gray-500">
      {/* Like Button */}
      <button
        onClick={handleLikeClick}
        className={`flex items-center gap-2 transition-colors ${
          isLiked ? "text-red-500" : "hover:text-red-500"
        }`}
      >
        <Heart
          size={22}
          strokeWidth={2}
          fill={isLiked ? "currentColor" : "none"}
        />
        <span className="text-sm">{likesCount > 0 ? likesCount : ""}</span>
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
