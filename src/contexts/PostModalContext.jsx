import { createContext, useContext, useState } from "react";

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

export const usePostModal = () => useContext(PostModalContext);
