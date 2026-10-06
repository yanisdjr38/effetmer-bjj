import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaEdit,
  FaStickyNote,
  FaTrashAlt,
} from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import TrainingForm from "../components/TrainingForm.jsx";
import { useApp } from "../context/AppContext.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { TRAINING_TYPES, TRAINING_TYPE_LABELS } from "../lib/constants.js";
import styles from "./TrainingPage.module.scss";

/**
 * TrainingPage - Gestion et visualisation des entraînements
 */
function TrainingPage() {
  usePageTitle("Entraînement");
  const { trainingSessions: sessions, addTrainingSession, updateTrainingSession, deleteTrainingSession } =
    useApp();
  const [editingSession, setEditingSession] = useState(null);
  const [filters, setFilters] = useState({ date: "", type: "" });
  const [searchParams, setSearchParams] = useSearchParams();

  // Raccourci PWA "Ajouter une séance" (manifest.json) : /training?action=new
  useEffect(() => {
    if (searchParams.get("action") === "new") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.getElementById("date")?.focus();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleAdd = useCallback(
    (newSession) => {
      if (editingSession) {
        updateTrainingSession(editingSession.id, newSession);
        setEditingSession(null);
      } else {
        addTrainingSession(newSession);
      }
    },
    [editingSession, addTrainingSession, updateTrainingSession],
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
        deleteTrainingSession(id);
      }
    },
    [deleteTrainingSession],
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
              {TRAINING_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>
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
            <div className={styles.stat_item}>
              <div>{stats.count}</div>
              <div>Entraînement{stats.count > 1 ? "s" : ""}</div>
            </div>
            <div className={styles.stat_item}>
              <div>{stats.totalDuration} min</div>
              <div>Total</div>
            </div>
            <div className={styles.stat_item}>
              <div>{stats.averageDuration} min</div>
              <div>Moyenne</div>
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
                  <span className={styles.session_type_badge}>
                    {TRAINING_TYPE_LABELS[s.type] || s.type}
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
                    className={styles.danger}
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
