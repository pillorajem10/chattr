import { Send, User } from "lucide-react";

/**
 * AddCommentForm Component
 * ------------------------------------------------------------------
 * Parent Component: PostDetailsModal
 *
 * A lightweight subcomponent that provides an input field and submit
 * button for adding comments to a post. Includes:
 *  - Comment text input with live state binding
 *  - Submit button using a Send icon
 *  - Optional user avatar placeholder for visual context
 * ------------------------------------------------------------------
 */
const AddCommentForm = ({
  value = "",
  onChange,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-3 w-full"
    >
      {/* Optional user icon (can remove if not needed) */}
      <div className="bg-gray-200 rounded-full p-2">
        <User size={18} className="text-gray-600" />
      </div>

      <input
        type="text"
        placeholder="Add a comment..."
        value={value}
        name="comment_content"
        onChange={onChange}
        className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />

      <button
        type="submit"
        className="p-2 text-blue-600 hover:text-blue-700 transition disabled:opacity-50"
      >
        <Send size={18} />
      </button>
    </form>
  );
};

export default AddCommentForm;
