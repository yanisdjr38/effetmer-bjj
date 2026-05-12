import { useEffect, useRef } from "react";

/**
 * Modal - Accessible modal dialog base component
 * Handles focus management, keyboard escape, and a11y attributes
 */
function Modal({ isOpen, onClose, title, children, size = "medium" }) {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Store previous focus
      previousActiveElement.current = document.activeElement;
      // Delay focus to ensure modal is rendered
      const focusTimer = setTimeout(() => {
        if (modalRef.current) {
          const firstButton = modalRef.current.querySelector(
            "button:not([aria-label='Close modal'])",
          );
          if (firstButton) {
            firstButton.focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, 50);
      // Prevent body scroll
      document.body.style.overflow = "hidden";

      // Handle escape key
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      document.addEventListener("keydown", handleEscape);

      return () => {
        clearTimeout(focusTimer);
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "auto";
        // Restore focus on close
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        ref={modalRef}
        style={{
          ...styles.modal,
          ...getSizeStyles(size),
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div style={styles.header}>
          <h2 id="modal-title" style={styles.title}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={styles.closeButton}
            aria-label="Fermer la fenêtre"
            type="button"
          >
            ✕
          </button>
        </div>
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
}

const getSizeStyles = (size) => {
  const sizes = {
    small: { maxWidth: "400px" },
    medium: { maxWidth: "600px" },
    large: { maxWidth: "900px" },
  };
  return sizes[size] || sizes.medium;
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem",
  },
  modal: {
    backgroundColor: "var(--color-bg, #fff)",
    borderRadius: "8px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
    animation: "slideUp 0.3s ease-out",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
    borderBottom: "1px solid var(--color-outline, #eee)",
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    padding: "0.25rem 0.5rem",
    color: "var(--color-text, #333)",
  },
  content: {
    padding: "1.5rem",
    maxHeight: "70vh",
    overflowY: "auto",
  },
};

// CSS animation
const style = document.createElement("style");
style.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
if (typeof document !== "undefined") {
  document.head.appendChild(style);
}

export default Modal;
