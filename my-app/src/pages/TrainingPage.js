import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaEdit,
  FaStickyNote,
  FaTrashAlt,
} from "react-icons/fa";
import TrainingForm from "../components/TrainingForm";

function TrainingPage() {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("trainingSessions");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingSession, setEditingSession] = useState(null);
  const [filters, setFilters] = useState({ date: "", type: "" });

  const handleAdd = (newSession) => {
    if (editingSession) {
      const updated = sessions.map((s) =>
        s.id === editingSession.id ? { ...newSession, id: s.id } : s
      );
      setSessions(updated);
      localStorage.setItem("trainingSessions", JSON.stringify(updated));
      setEditingSession(null);
    } else {
      const updated = [...sessions, { ...newSession, id: Date.now() }];
      setSessions(updated);
      localStorage.setItem("trainingSessions", JSON.stringify(updated));
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cet entraînement ?")) {
      const updated = sessions.filter((s) => s.id !== id);
      setSessions(updated);
      localStorage.setItem("trainingSessions", JSON.stringify(updated));
    }
  };

  const handleResetFilters = () => {
    setFilters({ date: "", type: "" });
  };

  const filteredSessions = sessions.filter((s) => {
    return (
      (filters.date === "" || s.date === filters.date) &&
      (filters.type === "" || s.type === filters.type)
    );
  });

  return (
    <div className="container">
      <h2>Suivi d'entraînement</h2>

      <TrainingForm
        onAdd={handleAdd}
        initialData={editingSession}
        filters={filters}
        setFilters={setFilters}
      />

      <div style={{ marginTop: "1rem", textAlign: "right" }}>
        <button onClick={handleResetFilters}>Réinitialiser les filtres</button>
      </div>

      {filteredSessions.length === 0 ? (
        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Aucun entraînement trouvé.
        </p>
      ) : (
        <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
          {filteredSessions.map((s) => (
            <div
              key={s.id}
              className="card"
              style={{ textAlign: "left", position: "relative" }}
            >
              <div>
                <FaCalendarAlt /> <strong>{s.date}</strong>
              </div>
              <div>
                <strong>Type :</strong> {s.type}
              </div>
              <div>
                <FaClock /> Durée : {s.duration} min
              </div>
              {s.note && (
                <div style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
                  <FaStickyNote style={{ marginRight: "0.3rem" }} /> {s.note}
                </div>
              )}
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem" }}
              >
                <button onClick={() => handleEdit(s)}>
                  <FaEdit /> Modifier
                </button>
                <button onClick={() => handleDelete(s.id)}>
                  <FaTrashAlt /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrainingPage;
