import { createContext, useContext, useState } from "react";

/**
 * PostModalContext
 * ------------------------------------------------------------------
 * Provides global state and controls for managing the Create Post modal.
 * Includes:
 *  - `showCreatePostModal` to track visibility
 *  - `openCreatePostModal` and `closeCreatePostModal` for control
 *
 * Used by components like the Sidebar and Footer to trigger
 * post creation across the app.
 * ------------------------------------------------------------------
 */
const PostModalContext = createContext();

export const PostModalProvider = ({ children }) => {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  const openCreatePostModal = () => setShowCreatePostModal(true);
  const closeCreatePostModal = () => setShowCreatePostModal(false);

  return (
    <PostModalContext.Provider
      value={{
        showCreatePostModal,
        openCreatePostModal,
        closeCreatePostModal,
      }}
    >
      {children}
    </PostModalContext.Provider>
  );
};

/**
 * Hook: usePostModal
 * ------------------------------------------------------------------
 * Custom hook for accessing modal state and actions.
 * Simplifies opening and closing the Create Post modal
 * from any component in the app.
 * ------------------------------------------------------------------
 */
export const usePostModal = () => useContext(PostModalContext);
