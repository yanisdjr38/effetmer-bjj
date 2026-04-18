import {
  faBolt,
  faBook,
  faDumbbell,
  faFire,
  faPerson,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useState } from "react";
import "./training-form.scss";

const TRAINING_TYPES = [
  { value: "techniques", label: "Techniques", icon: faBook },
  { value: "drill", label: "Drill", icon: faBolt },
  { value: "sparring", label: "Sparring", icon: faPerson },
  { value: "openmat", label: "Open Mat", icon: faDumbbell },
  { value: "muscu", label: "Musculation", icon: faBolt },
  { value: "cardio", label: "Cardio", icon: faFire },
  { value: "competition", label: "Compétition", icon: faTrophy },
];

/**
 * TrainingForm - Add/edit training session with validation
 * @param {Function} onAdd - Callback when form is submitted
 * @param {Object} initialData - Data to edit (if editing)
 */
const TrainingForm = ({ onAdd, initialData = null }) => {
  const [form, setForm] = useState({
    date: "",
    type: "techniques",
    duration: "",
    note: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        date: initialData.date || "",
        type: initialData.type || "techniques",
        duration: initialData.duration || "",
        note: initialData.note || "",
      });
    }
  }, [initialData]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!form.date) newErrors.date = "La date est requise";
    if (!form.duration || form.duration <= 0) {
      newErrors.duration = "La durée doit être supérieure à 0";
    }

    return newErrors;
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts correcting
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAdd({ ...form });
    setForm({ date: "", type: "techniques", duration: "", note: "" });
    setErrors({});
  };

  const handleReset = () => {
    setForm({ date: "", type: "techniques", duration: "", note: "" });
    setErrors({});
  };

  return (
    <form className="training-form" onSubmit={handleSubmit} noValidate>
      {/* Date input */}
      <div className="form-group">
        <label htmlFor="date" className="form-label">
          Date <span className="required">*</span>
        </label>
        <input
          id="date"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          aria-invalid={!!errors.date}
          className="form-input"
        />
        {errors.date && <small className="form-error">{errors.date}</small>}
      </div>

      {/* Training type select */}
      <div className="form-group">
        <label htmlFor="type" className="form-label">
          Type d'entraînement <span className="required">*</span>
        </label>
        <select
          id="type"
          name="type"
          value={form.type}
          onChange={handleChange}
          required
          className="form-select"
        >
          {TRAINING_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Duration input */}
      <div className="form-group">
        <label htmlFor="duration" className="form-label">
          Durée (minutes) <span className="required">*</span>
        </label>
        <input
          id="duration"
          type="number"
          name="duration"
          placeholder="Ex: 60"
          min="1"
          value={form.duration}
          onChange={handleChange}
          required
          aria-invalid={!!errors.duration}
          className="form-input"
        />
        {errors.duration && (
          <small className="form-error">{errors.duration}</small>
        )}
      </div>

      {/* Notes textarea */}
      <div className="form-group">
        <label htmlFor="note" className="form-label">
          Notes (optionnel)
        </label>
        <textarea
          id="note"
          name="note"
          placeholder="Décris ta séance (technique travaillée, objectif, etc.)"
          value={form.note}
          onChange={handleChange}
          rows="3"
          className="form-textarea"
        />
      </div>

      {/* Form actions */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn btn--primary"
          aria-label={
            initialData ? "Modifier l'entraînement" : "Ajouter l'entraînement"
          }
        >
          {initialData ? "Modifier" : "Ajouter"}
        </button>
        {initialData && (
          <button
            type="button"
            onClick={handleReset}
            className="btn btn--secondary"
            aria-label="Annuler la modification"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default TrainingForm;
