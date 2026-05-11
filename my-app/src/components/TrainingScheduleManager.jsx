import { useCallback, useState } from "react";
import { useApp } from "../context/AppContext";
import styles from "./TrainingScheduleManager.module.scss";

/**
 * TrainingScheduleManager - Manage recurring weekly training sessions
 * Allows users to add/edit/delete training blocks for each day of the week
 */
const TrainingScheduleManager = () => {
  const {
    trainingSchedule,
    addScheduleSession,
    updateScheduleSession,
    deleteScheduleSession,
  } = useApp();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    day: "Lundi",
    startTime: "10:00",
    endTime: "11:30",
    trainingType: "open mat", // open mat, fundamentals, advanced, wrestling, conditioning
    notes: "",
    enabled: true,
  });

  const trainingTypes = [
    { value: "open mat", label: "Open Mat" },
    { value: "fundamentals", label: "Fondamentaux" },
    { value: "advanced", label: "Avancé" },
    { value: "wrestling", label: "Lutte" },
    { value: "conditioning", label: "Conditionnement" },
  ];

  const daysOfWeek = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      day: "Lundi",
      startTime: "10:00",
      endTime: "11:30",
      trainingType: "open mat",
      notes: "",
      enabled: true,
    });
    setEditingId(null);
  }, []);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  // Handle add/update session
  const handleSaveSession = useCallback(() => {
    if (editingId) {
      updateScheduleSession(editingId, formData);
      setEditingId(null);
    } else {
      addScheduleSession(formData);
    }
    setIsAddingNew(false);
    resetForm();
  }, [
    editingId,
    formData,
    addScheduleSession,
    updateScheduleSession,
    resetForm,
  ]);

  // Handle edit session
  const handleEditSession = useCallback((session) => {
    setFormData({
      day: session.day,
      startTime: session.startTime,
      endTime: session.endTime,
      trainingType: session.trainingType,
      notes: session.notes || "",
      enabled: session.enabled,
    });
    setEditingId(session.id);
    setIsAddingNew(true);
  }, []);

  // Handle delete session
  const handleDeleteSession = useCallback(
    (id) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette séance?")) {
        deleteScheduleSession(id);
      }
    },
    [deleteScheduleSession],
  );

  // Organize sessions by day
  const sessionsByDay = daysOfWeek.reduce((acc, day) => {
    acc[day] = trainingSchedule.sessions.filter(
      (s) => s.day === day && s.enabled,
    );
    return acc;
  }, {});

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>🗓️ Horaire d'entraînement</h2>
        <p>Gérez vos séances d'entraînement récurrentes hebdomadaires</p>
      </div>

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className={styles.formContainer}>
          <h3>
            {editingId ? "Modifier la séance" : "Ajouter une nouvelle séance"}
          </h3>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="day">Jour</label>
              <select
                id="day"
                name="day"
                value={formData.day}
                onChange={handleInputChange}
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="trainingType">Type</label>
              <select
                id="trainingType"
                name="trainingType"
                value={formData.trainingType}
                onChange={handleInputChange}
              >
                {trainingTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="startTime">Start Time</label>
              <input
                id="startTime"
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endTime">End Time</label>
              <input
                id="endTime"
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="e.g., Bring rashguard, bring water"
              rows="3"
            />
          </div>

          <div className={styles.checkbox}>
            <input
              id="enabled"
              type="checkbox"
              name="enabled"
              checked={formData.enabled}
              onChange={handleInputChange}
            />
            <label htmlFor="enabled">Active session</label>
          </div>

          <div className={styles.formActions}>
            <button
              className={`${styles.btn} ${styles.primary}`}
              onClick={handleSaveSession}
            >
              {editingId ? "Update Session" : "Add Session"}
            </button>
            <button
              className={`${styles.btn} ${styles.secondary}`}
              onClick={() => {
                setIsAddingNew(false);
                resetForm();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add button */}
      {!isAddingNew && (
        <button
          className={`${styles.btn} ${styles.addBtn}`}
          onClick={() => setIsAddingNew(true)}
        >
          + Add Training Session
        </button>
      )}

      {/* Weekly Schedule Display */}
      <div className={styles.weekGrid}>
        {daysOfWeek.map((day) => (
          <div key={day} className={styles.dayCard}>
            <h3 className={styles.dayTitle}>{day}</h3>

            {sessionsByDay[day].length === 0 ? (
              <p className={styles.noSession}>Rest day</p>
            ) : (
              <div className={styles.sessions}>
                {sessionsByDay[day].map((session) => (
                  <div key={session.id} className={styles.sessionItem}>
                    <div className={styles.sessionTime}>
                      <span className={styles.time}>
                        {session.startTime} - {session.endTime}
                      </span>
                      <span
                        className={`${styles.badge} ${styles[session.trainingType]}`}
                      >
                        {
                          trainingTypes.find(
                            (t) => t.value === session.trainingType,
                          )?.label
                        }
                      </span>
                    </div>

                    {session.notes && (
                      <p className={styles.notes}>{session.notes}</p>
                    )}

                    <div className={styles.actions}>
                      <button
                        className={`${styles.iconBtn} ${styles.edit}`}
                        onClick={() => handleEditSession(session)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className={`${styles.iconBtn} ${styles.delete}`}
                        onClick={() => handleDeleteSession(session.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      {trainingSchedule.sessions.length > 0 && (
        <div className={styles.summary}>
          <h3>Summary</h3>
          <p>
            <strong>
              {trainingSchedule.sessions.filter((s) => s.enabled).length}
            </strong>{" "}
            active sessions per week
          </p>
          <p>
            <strong>Most common type:</strong>{" "}
            {trainingSchedule.sessions.length > 0
              ? trainingTypes.find(
                  (t) =>
                    t.value ===
                    trainingSchedule.sessions
                      .map((s) => s.trainingType)
                      .sort(
                        (a, b) =>
                          trainingSchedule.sessions.filter(
                            (s) => s.trainingType === b,
                          ).length -
                          trainingSchedule.sessions.filter(
                            (s) => s.trainingType === a,
                          ).length,
                      )[0],
                )?.label
              : "N/A"}
          </p>
        </div>
      )}
    </div>
  );
};

export default TrainingScheduleManager;
