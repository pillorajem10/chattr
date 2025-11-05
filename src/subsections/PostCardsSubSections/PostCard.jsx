import { User } from "lucide-react";
import PostCardFooter from "@subsections/PostCardsSubsections/PostCardFooter";
import SharedPostCard from "@subsections/PostCardsSubsections/SharedPostCard";

/**
 * PostCard Component
 * ------------------------------------------------------------------
 * Parent Section: PostCards
 *
 * Renders a single post entry, showing:
 *  - User details (name and timestamp)
 *  - Post content
 *  - Optional shared post preview
 *  - Footer actions (like, comment, share)
 *
 * Acts as the main display unit for user posts within
 * the PostCards section.
 * ------------------------------------------------------------------
 */
const PostCard = ({ post, onLike, onRemoveLike, onOpenPostDetails, onShare }) => {
  const {
    id,
    user,
    post_content,
    created_at,
    post_is_shared,
    original_post,
    likedByUser,
    likesCount,
    commentCount,
    shareCount,
    user_reaction_id,
  } = post;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8 lg:p-10 hover:shadow-lg transition-shadow duration-300 w-full max-w-3xl">
      {/* ------------------------------------------------------------
           Header — User Info and Timestamp
         ------------------------------------------------------------ */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-gray-100 rounded-full border border-gray-200">
          <User size={26} strokeWidth={2} className="text-gray-500" />
        </div>
        <div>
          <h3 className="text-gray-800 font-semibold text-lg md:text-xl lg:text-2xl">
            {user?.user_fname} {user?.user_lname}
          </h3>
          <p className="text-gray-400 text-sm md:text-base">
            {created_at ? new Date(created_at).toLocaleString() : "Just now"}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------
           Content — Main Post Body
         ------------------------------------------------------------ */}
      <div className="text-gray-700 text-base md:text-lg lg:text-xl leading-relaxed whitespace-pre-line">
        {post_content}
      </div>

      {/* ------------------------------------------------------------
           Shared Post — Nested Post Preview
         ------------------------------------------------------------ */}
      {post_is_shared && original_post && <SharedPostCard post={original_post} />}

      {/* ------------------------------------------------------------
           Footer — Reactions, Comments, and Share Buttons
         ------------------------------------------------------------ */}
      <PostCardFooter
        postId={id}
        reactionId={user_reaction_id}
        isLiked={likedByUser}
        likesCount={likesCount}
        commentCount={commentCount}
        onOpenPostDetails={onOpenPostDetails}
        shareCount={shareCount}
        onShare={onShare}
        onLike={onLike}
        onRemoveLike={onRemoveLike}
      />
    </div>
  );
};

export default PostCard;
