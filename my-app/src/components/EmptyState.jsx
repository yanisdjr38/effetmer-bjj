/**
 * EmptyState - Reusable empty state component for consistent UX
 * Displays when no data is available with actionable CTA
 */
function EmptyState({ icon = "📭", title, description, action, actionLabel }) {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>{icon}</div>
      <h3 style={styles.title}>{title}</h3>
      {description && <p style={styles.description}>{description}</p>}
      {action && actionLabel && (
        <button style={styles.button} onClick={action}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 1.5rem",
    textAlign: "center",
    backgroundColor: "var(--color-surface, #f0f0f0)",
    borderRadius: "8px",
    opacity: 0.8,
  },
  icon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
    color: "var(--color-text, #333)",
  },
  description: {
    fontSize: "0.95rem",
    color: "var(--color-text-secondary, #666)",
    marginBottom: "1.5rem",
    maxWidth: "400px",
  },
  button: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "var(--color-primary, #59d8e5)",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
};

export default EmptyState;
