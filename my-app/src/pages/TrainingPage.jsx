import { useCallback, useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaEdit,
  FaStickyNote,
  FaTrashAlt,
} from "react-icons/fa";
import TrainingForm from "../components/TrainingForm.jsx";
import { useLocalStorage } from "../hooks/useLocalStorage.jsx";
import styles from "./TrainingPage.module.scss";

const TRAINING_TYPES = {
  techniques: "Techniques",
  drill: "Drill",
  sparring: "Sparring",
  openmat: "Open Mat",
  muscu: "Musculation",
  cardio: "Cardio",
  competition: "Compétition",
};

/**
 * TrainingPage - Gestion et visualisation des entraînements
 */
function TrainingPage() {
  const [sessions, setSessions] = useLocalStorage("trainingSessions", []);
  const [editingSession, setEditingSession] = useState(null);
  const [filters, setFilters] = useState({ date: "", type: "" });

  const handleAdd = useCallback(
    (newSession) => {
      let updated;
      if (editingSession) {
        updated = sessions.map((s) =>
          s.id === editingSession.id ? { ...newSession, id: s.id } : s,
        );
        setEditingSession(null);
      } else {
        updated = [...sessions, { ...newSession, id: Date.now() }];
      }
      setSessions(updated);
    },
    [sessions, editingSession, setSessions],
  );

  const handleEdit = useCallback((session) => {
    setEditingSession(session);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDelete = useCallback(
    (id) => {
      if (
        window.confirm("Êtes-vous sûr de vouloir supprimer cet entraînement ?")
      ) {
        setSessions(sessions.filter((s) => s.id !== id));
      }
    },
    [sessions, setSessions],
  );

  const handleResetFilters = useCallback(() => {
    setFilters({ date: "", type: "" });
  }, []);

  // Filtrer et trier les sessions
  const filteredSessions = useMemo(() => {
    return sessions
      .filter((s) => {
        return (
          (filters.date === "" || s.date === filters.date) &&
          (filters.type === "" || s.type === filters.type)
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [sessions, filters]);

  const stats = useMemo(() => {
    const totalDuration = filteredSessions.reduce(
      (sum, s) => sum + Number(s.duration || 0),
      0,
    );
    return {
      count: filteredSessions.length,
      totalDuration,
      averageDuration:
        filteredSessions.length > 0
          ? Math.round(totalDuration / filteredSessions.length)
          : 0,
    };
  }, [filteredSessions]);

  return (
    <div className="container">
      <section className={styles.training_page}>
        <h2>Suivi d'entraînement</h2>

        {editingSession && (
          <div
            className={styles.form_section}
            style={{
              background: "#fef3c7",
              borderColor: "#fcd34d",
              color: "#92400e",
            }}
          >
            ✏️ Modification en cours : {editingSession.date}
          </div>
        )}

        <TrainingForm onAdd={handleAdd} initialData={editingSession} />

        {/* Filtres */}
        <fieldset className={styles.filters_section}>
          <legend style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
            Filtrer
          </legend>
          <label className={styles.filter_group}>
            <span>Date</span>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            />
          </label>
          <label className={styles.filter_group}>
            <span>Type</span>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">Tous les types</option>
              {Object.entries(TRAINING_TYPES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {(filters.date || filters.type) && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{ width: "100%", marginTop: "var(--space-2)" }}
            >
              Réinitialiser les filtres
            </button>
          )}
        </fieldset>

        {/* Stats */}
        {filteredSessions.length > 0 && (
          <div className={styles.stats_summary}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                {stats.count}
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-neutral-600)",
                }}
              >
                Entraînement{stats.count > 1 ? "s" : ""}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                {stats.totalDuration} min
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-neutral-600)",
                }}
              >
                Total
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                {stats.averageDuration} min
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-neutral-600)",
                }}
              >
                Moyenne
              </div>
            </div>
          </div>
        )}

        {/* Listes des sessions */}
        {filteredSessions.length === 0 ? (
          <div className={styles.empty_state}>
            <p>
              {sessions.length === 0
                ? "Aucun entraînement enregistré."
                : "Aucun entraînement ne correspond aux filtres."}
            </p>
            {sessions.length > 0 && (
              <button onClick={handleResetFilters}>Effacer les filtres</button>
            )}
          </div>
        ) : (
          <div className={styles.sessions_list}>
            {filteredSessions.map((s) => (
              <article key={s.id} className={styles.session_item}>
                <div className={styles.session_info}>
                  <span className={styles.session_date}>
                    <FaCalendarAlt style={{ marginRight: "0.5rem" }} />
                    {new Date(s.date).toLocaleDateString("fr-FR", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      background: "var(--color-accent-600)",
                      color: "white",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      maxWidth: "fit-content",
                    }}
                  >
                    {TRAINING_TYPES[s.type] || s.type}
                  </span>
                  <span className={styles.session_duration}>
                    <FaClock style={{ marginRight: "0.5rem" }} />
                    {s.duration} min
                  </span>
                  {s.note && (
                    <div className={styles.session_notes}>
                      <FaStickyNote style={{ marginRight: "0.5rem" }} />
                      {s.note}
                    </div>
                  )}
                </div>

                <div className={styles.session_actions}>
                  <button
                    onClick={() => handleEdit(s)}
                    title="Modifier cet entraînement"
                  >
                    <FaEdit style={{ marginRight: "0.5rem" }} /> Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="danger"
                    title="Supprimer cet entraînement"
                  >
                    <FaTrashAlt style={{ marginRight: "0.5rem" }} /> Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TrainingPage;
