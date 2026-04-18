import { useCallback, useMemo, useState } from "react";
import { FaEdit, FaImage, FaTrashAlt, FaVideo } from "react-icons/fa";
import { useLocalStorage } from "../hooks/useLocalStorage.jsx";
import styles from "./TechniquesPage.module.scss";

const CATEGORIES = {
  soumissions: { label: "Soumissions", color: "#ef4444" },
  passage: { label: "Passage", color: "#3b82f6" },
  garde: { label: "Garde", color: "#10b981" },
  renversements: { label: "Renversements", color: "#f59e0b" },
  autre: { label: "Autre", color: "#6b7280" },
};

const STATUSES = {
  "à réviser": { label: "À réviser", icon: "→" },
  maîtrisée: { label: "Maîtrisée", icon: "✓" },
};

/**
 * TechniquesPage - Gestion et apprentissage des techniques BJJ
 */
function TechniquesPage() {
  const [techniques, setTechniques] = useLocalStorage("techniquesList", []);
  const [form, setForm] = useState({
    title: "",
    category: "soumissions",
    note: "",
    status: "à réviser",
    image: null,
    video: null,
  });
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    title: "",
    status: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = "Le nom de la technique est requis";
    }
    return newErrors;
  }, [form.title]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      const fileURL = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, [name]: fileURL }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    // Effacer l'erreur
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

    if (editing) {
      setTechniques(
        techniques.map((t) =>
          t.id === editing.id ? { ...form, id: t.id } : t,
        ),
      );
      setEditing(null);
    } else {
      setTechniques([...techniques, { ...form, id: Date.now() }]);
    }

    setForm({
      title: "",
      category: "soumissions",
      note: "",
      status: "à réviser",
      image: null,
      video: null,
    });
    setErrors({});
  };

  const handleEdit = useCallback((technique) => {
    setEditing(technique);
    setForm(technique);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDelete = useCallback(
    (id) => {
      if (
        window.confirm("Êtes-vous sûr de vouloir supprimer cette technique ?")
      ) {
        setTechniques(techniques.filter((t) => t.id !== id));
      }
    },
    [techniques, setTechniques],
  );

  const handleCancel = () => {
    setEditing(null);
    setForm({
      title: "",
      category: "soumissions",
      note: "",
      status: "à réviser",
      image: null,
      video: null,
    });
    setErrors({});
  };

  const handleResetFilters = useCallback(() => {
    setFilters({ category: "", title: "", status: "" });
  }, []);

  // Filtrer les techniques
  const filteredTechniques = useMemo(() => {
    return techniques.filter((t) => {
      return (
        (filters.category === "" || t.category === filters.category) &&
        (filters.title === "" ||
          t.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.status === "" || t.status === filters.status)
      );
    });
  }, [techniques, filters]);

  const stats = useMemo(() => {
    return {
      total: filteredTechniques.length,
      mastered: filteredTechniques.filter((t) => t.status === "maîtrisée")
        .length,
      toReview: filteredTechniques.filter((t) => t.status === "à réviser")
        .length,
    };
  }, [filteredTechniques]);

  return (
    <div className="container">
      <section className={styles.techniques_page}>
        <h2>Mes Techniques</h2>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className={styles.form_section}>
          <div className={styles.form_group}>
            <label htmlFor="title">Nom de la technique *</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Ex: Armlock à partir de la garde..."
              value={form.title}
              onChange={handleChange}
              required
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <small className={styles.error}>{errors.title}</small>
            )}
          </div>

          <div className={styles.form_grid}>
            <div className={styles.form_group}>
              <label htmlFor="category">Catégorie *</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                {Object.entries(CATEGORIES).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.form_group}>
              <label htmlFor="status">Statut *</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                {Object.entries(STATUSES).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.form_group}>
              <label htmlFor="note">Notes (optionnel)</label>
              <textarea
                id="note"
                name="note"
                placeholder="Ajoute tes observations, les points clés, les variations..."
                value={form.note}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>

          <div className={styles.form_grid}>
            <div className={styles.form_group}>
              <label htmlFor="image">
                <FaImage style={{ marginRight: "0.5rem" }} /> Image
              </label>
              <input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="video">
                <FaVideo style={{ marginRight: "0.5rem" }} /> Vidéo
              </label>
              <input
                id="video"
                type="file"
                name="video"
                accept="video/*"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.form_actions}>
            <button type="submit" className="primary">
              {editing ? "Modifier" : "Ajouter"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={handleCancel}
                className="secondary"
              >
                Annuler
              </button>
            )}
          </div>
        </form>

        {editing && (
          <div
            style={{
              background: "#fef3c7",
              border: "1px solid #fcd34d",
              padding: "1rem",
              borderRadius: "var(--radius-lg)",
              marginTop: "1rem",
              color: "#92400e",
            }}
          >
            ✏️ Modification en cours : <strong>{editing.title}</strong>
          </div>
        )}

        {/* Filtres */}
        <fieldset className={styles.filters_section}>
          <legend style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
            Filtrer
          </legend>
          <label className={styles.filter_group}>
            <span>Catégorie</span>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              <option value="">Toutes</option>
              {Object.entries(CATEGORIES).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.filter_group}>
            <span>Statut</span>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">Tous</option>
              {Object.entries(STATUSES).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.search_group}>
            <label>
              <span>Rechercher</span>
              <input
                type="text"
                placeholder="Mot-clé..."
                value={filters.title}
                onChange={(e) =>
                  setFilters({ ...filters, title: e.target.value })
                }
              />
            </label>
          </div>

          {(filters.category || filters.status || filters.title) && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{ width: "100%" }}
            >
              Réinitialiser les filtres
            </button>
          )}
        </fieldset>

        {/* Stats */}
        {filteredTechniques.length > 0 && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              background:
                "linear-gradient(135deg, var(--color-primary-50), var(--color-accent-50))",
              borderRadius: "var(--radius-lg)",
              fontSize: "0.875rem",
              color: "var(--color-neutral-900)",
            }}
          >
            <strong>{stats.total}</strong> technique
            {stats.total > 1 ? "s" : ""} • <strong>⭐ {stats.mastered}</strong>{" "}
            maîtrisée{stats.mastered > 1 ? "s" : ""} •{" "}
            <strong>⚠️ {stats.toReview}</strong> à réviser
          </div>
        )}

        {/* Liste des techniques */}
        {filteredTechniques.length === 0 ? (
          <div className={styles.empty_state}>
            <p>
              {techniques.length === 0
                ? "Aucune technique enregistrée. Commence par en ajouter une !"
                : "Aucune technique ne correspond à tes filtres."}
            </p>
            {techniques.length > 0 && (
              <button onClick={handleResetFilters}>Effacer les filtres</button>
            )}
          </div>
        ) : (
          <div className={styles.techniques_grid}>
            {filteredTechniques.map((t) => (
              <article key={t.id} className={styles.technique_card}>
                <img
                  src={t.image || "https://via.placeholder.com/300"}
                  alt={t.title}
                  className={styles.technique_media}
                />

                <div className={styles.technique_content}>
                  <h3 className={styles.technique_name}>{t.title}</h3>

                  <p className={styles.technique_description}>
                    {t.note || "Aucune description"}
                  </p>

                  <div className={styles.technique_badges}>
                    <span className={`${styles.badge} ${styles.category}`}>
                      {CATEGORIES[t.category]?.label || t.category}
                    </span>
                    <span
                      className={`${styles.badge} ${
                        t.status === "maîtrisée"
                          ? `${styles.difficulty_advanced}`
                          : `${styles.difficulty_beginner}`
                      }`}
                    >
                      {STATUSES[t.status]?.icon}{" "}
                      {STATUSES[t.status]?.label || t.status}
                    </span>
                  </div>

                  <div className={styles.technique_actions}>
                    <button
                      onClick={() => handleEdit(t)}
                      className="primary"
                      title="Modifier"
                    >
                      <FaEdit style={{ marginRight: "0.5rem" }} /> Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="danger"
                      title="Supprimer"
                    >
                      <FaTrashAlt style={{ marginRight: "0.5rem" }} /> Supprimer
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TechniquesPage;
