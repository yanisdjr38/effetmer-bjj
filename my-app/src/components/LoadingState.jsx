/**
 * LoadingState - Skeleton loading placeholder
 * Shows minimal placeholder while content loads
 */
function LoadingState({ variant = "small" }) {
  const content =
    variant === "small" ? (
      <div style={styles.skeletonSmall}></div>
    ) : (
      <>
        <div style={{ ...styles.skeletonLine, width: "60%" }}></div>
        <div style={{ ...styles.skeletonLine, width: "100%" }}></div>
        <div style={{ ...styles.skeletonLine, width: "80%" }}></div>
      </>
    );

  return <div style={styles.container}>{content}</div>;
}

const styles = {
  container: {
    padding: "2rem 1rem",
    backgroundColor: "var(--color-surface, #f0f0f0)",
    borderRadius: "8px",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  skeletonSmall: {
    height: "60px",
    backgroundColor: "var(--color-outline, #ddd)",
    borderRadius: "4px",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  skeletonLine: {
    height: "12px",
    backgroundColor: "var(--color-outline, #ddd)",
    borderRadius: "4px",
    marginBottom: "0.75rem",
    animation: "pulse 1.5s ease-in-out infinite",
    lastChild: {
      marginBottom: 0,
    },
  },
};

// CSS animation for skeleton
const style = document.createElement("style");
style.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`;
if (typeof document !== "undefined") {
  document.head.appendChild(style);
}

export default LoadingState;
