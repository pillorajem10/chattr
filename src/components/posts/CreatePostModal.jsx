import { X } from "lucide-react";

/**
 * CreatePostModal Component
 * ------------------------------------------------------------------
 * A centered modal for composing and submitting a new post.
 * Includes:
 *  - Textarea input for post content
 *  - Submit button with loading state
 *  - Close button for dismissing the modal
 *
 * The modal is controlled externally through `open` and form handlers.
 * ------------------------------------------------------------------
 */
const CreatePostModal = ({
  open,
  onClose,
  formValues,
  onChange,
  onSubmit,
  isSubmitting = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
        {/* ------------------------------------------------------------
             Header — Title and Close Button
           ------------------------------------------------------------ */}
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Create Post</h2>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* ------------------------------------------------------------
             Form — Post Input and Submit
           ------------------------------------------------------------ */}
        <form onSubmit={onSubmit} className="p-5 flex flex-col gap-4">
          <textarea
            name="post_content"
            value={formValues.post_content || ""}
            onChange={onChange}
            placeholder="What's on your mind?"
            rows={5}
            className="w-full resize-none border rounded-lg px-4 py-3 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 disabled:opacity-50"
            disabled={isSubmitting}
          />

          <button
            type="submit"
            disabled={isSubmitting || !formValues.post_content?.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-2 transition disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
