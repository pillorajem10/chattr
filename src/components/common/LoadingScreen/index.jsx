import styles from "./index.module.css";

const LoadingScreen = () => {
  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-white/70 backdrop-blur-md
      "
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className={`${styles.spinner} shadow-lg`} />
    </div>
  );
};

export default LoadingScreen;
