import { User } from "lucide-react";

const SharedPostCard = ({ post }) => {
  if (!post) return null;

  return (
    <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-5 md:p-6 text-gray-700 hover:bg-gray-100 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full border border-gray-200">
          <User size={20} strokeWidth={2} className="text-gray-500" />
        </div>
        <div>
          <h4 className="text-gray-800 font-semibold text-base md:text-lg">
            {post.user?.user_fname} {post.user?.user_lname}
          </h4>
          <p className="text-gray-400 text-sm">
            {post.created_at
              ? new Date(post.created_at).toLocaleString()
              : "Original post"}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
        {post.post_content}
      </p>
    </div>
  );
};

export default SharedPostCard;
