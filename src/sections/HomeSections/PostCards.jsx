import PostCard from "@subsections/PostCardsSubsections/PostCard";

const PostCards = ({ posts = [], onLike, onRemoveLike, onOpenPostDetails, onShare }) => {
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
