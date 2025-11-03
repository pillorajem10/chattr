import { useLogic } from "./useLogic";
import PostCards from "@sections/HomeSections/PostCards";
import LoadingScreen from "@components/common/LoadingScreen";
import SnackbarAlert from "@components/common/SnackbarAlert";

const Home = () => {
  const {
    loading,
    loaderRef,
    posts,
    snackbar,
    handleLikePost,
    handleRemoveLikePost,
    setSnackbar,
  } = useLogic();

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-50">
      {loading && posts.length === 0 ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="w-full max-w-2xl mt-6 px-4">
            <PostCards 
              posts={posts} 
              onLike={handleLikePost} 
              onRemoveLike={handleRemoveLikePost} 
            />
          </div>

          {/* Infinite Scroll Loader */}
          <div
            ref={loaderRef}
            className="h-10 flex justify-center items-center my-4 text-gray-400"
          >
            {loading && posts.length > 0 && "Loading more posts..."}
          </div>
        </>
      )}

      {snackbar.open && (
        <SnackbarAlert
          open={snackbar.open}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          message={snackbar.message}
          severity={snackbar.severity}
        />
      )}
    </div>
  );
};

export default Home;
