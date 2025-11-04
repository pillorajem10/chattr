import { X, User } from "lucide-react";

const ShareModal = ({
  open,
  onClose,
  post,        
  formValues,  
  onChange,
  onSubmit,
  isSubmitting = false,
}) => {
  if (!open || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Share Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Original Post Preview */}
        <div className="px-5 py-4 border-b bg-gray-50">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gray-200 rounded-full p-2">
              <User size={18} className="text-gray-600" />
            </div>
            <span className="font-semibold text-gray-800">
              {post.user?.user_fname} {post.user?.user_lname}
            </span>
          </div>
          <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
            {post.post_content}
          </p>
        </div>

        {/* Share Form */}
        <form onSubmit={onSubmit} className="p-5 flex flex-col gap-4">
          <textarea
            name="share_caption"
            value={formValues.share_caption || ""}
            onChange={onChange}
            placeholder="What's would you like to say?"
            rows={4}
            className="w-full resize-none border rounded-lg px-4 py-3 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 disabled:opacity-50"
            disabled={isSubmitting}
          />

          <button
            type="submit"
            disabled={isSubmitting || !formValues.share_caption?.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-2 transition disabled:opacity-50"
          >
            {isSubmitting ? "Sharing..." : "Share"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShareModal;
