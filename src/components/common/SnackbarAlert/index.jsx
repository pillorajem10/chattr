import { useEffect } from "react";
import styles from "./index.module.css"; // Scoped animation styles

/**
 * Snackbar Component
 * ------------------------------------------------------------------
 * Displays a temporary message at the bottom center of the screen.
 * Supports two states: success or error.
 * Automatically disappears after 3 seconds with a slide-up animation.
 * ------------------------------------------------------------------
 */
const Snackbar = ({ message, severity = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseStyles =
    "fixed bottom-6 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all z-50";

  const typeStyles = {
    success: "bg-green-400",
    error: "bg-red-400",
  };

  return (
    <div className={`${baseStyles} ${typeStyles[severity]} ${styles.slideUp}`}>
      {message}
    </div>
  );
};

export default Snackbar;
