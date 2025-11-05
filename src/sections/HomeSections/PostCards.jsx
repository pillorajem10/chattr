/**
 * PostCards Section
 * ------------------------------------------------------------------
 * Displays a list of post cards fetched from the backend.
 * Each post is rendered through the <PostCard /> subcomponent,
 * which handles its own layout and interaction logic (likes, shares, etc.).
 *
 * If there are no posts available, a friendly placeholder message
 * encourages the user to create the first post.
 *
 * Parent Component:
 *  - Used in <Home /> to render the main feed of posts.
 * ------------------------------------------------------------------
 */

import PostCard from "@subsections/PostCardsSubSections/PostCard";

const PostCards = ({
  posts = [],
  onLike,
  onRemoveLike,
  onOpenPostDetails,
  onShare,
}) => {
  if (!posts.length) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-400 text-lg">
        No posts yet. Be the first to share something!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 items-center">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={onLike}
          onShare={onShare}
          onOpenPostDetails={onOpenPostDetails}
          onRemoveLike={onRemoveLike}
        />
      ))}
    </div>
  );
};

export default PostCards;
