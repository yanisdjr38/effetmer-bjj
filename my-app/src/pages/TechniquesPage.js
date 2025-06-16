import React, { useState } from "react";
import {
  FaEdit,
  FaExclamationTriangle,
  FaStar,
  FaStickyNote,
  FaTrashAlt,
} from "react-icons/fa";

function TechniquesPage() {
  const [techniques, setTechniques] = useState(() => {
    const saved = localStorage.getItem("techniquesList");
    return saved ? JSON.parse(saved) : [];
  });

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const fileURL = URL.createObjectURL(files[0]);
      setForm({ ...form, [name]: fileURL });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      const updated = techniques.map((t) =>
        t.id === editing.id ? { ...form, id: t.id } : t
      );
      setTechniques(updated);
      localStorage.setItem("techniquesList", JSON.stringify(updated));
      setEditing(null);
    } else {
      const newEntry = { ...form, id: Date.now() };
      const updated = [...techniques, newEntry];
      setTechniques(updated);
      localStorage.setItem("techniquesList", JSON.stringify(updated));
    }
    setForm({
      title: "",
      category: "soumissions",
      note: "",
      status: "à réviser",
      image: null,
      video: null,
    });
  };

  const handleEdit = (entry) => {
    setEditing(entry);
    setForm(entry);
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cette technique ?")) {
      const updated = techniques.filter((t) => t.id !== id);
      setTechniques(updated);
      localStorage.setItem("techniquesList", JSON.stringify(updated));
    }
  };

  const handleResetFilters = () => {
    setFilters({ category: "", title: "", status: "" });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "soumissions":
        return "#ff6b6b";
      case "passage":
        return "#4dabf7";
      case "garde":
        return "#38d9a9";
      case "renversements":
        return "#ffd43b";
      case "autre":
        return "#ced4da";
      default:
        return "#f1f3f5";
    }
  };

  const filteredTechniques = techniques.filter((t) => {
    return (
      (filters.category === "" || t.category === filters.category) &&
      (filters.title === "" ||
        t.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (filters.status === "" || t.status === filters.status)
    );
  });

  return (
    <div className="container">
      <h2>Mes techniques</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Nom de la technique"
          value={form.title}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="soumissions">Soumissions</option>
          <option value="passage">Passage</option>
          <option value="garde">Garde</option>
          <option value="renversements">Renversements</option>
          <option value="autre">Autre</option>
        </select>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          required
        >
          <option value="à réviser">À réviser</option>
          <option value="maîtrisée">Maîtrisée</option>
        </select>
        <textarea
          name="note"
          placeholder="Notes (facultatif)"
          value={form.note}
          onChange={handleChange}
          rows={3}
        />
        <label>Image :</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        <label>Vidéo :</label>
        <input
          type="file"
          name="video"
          accept="video/*"
          onChange={handleChange}
        />
        <button type="submit">{editing ? "Modifier" : "Ajouter"}</button>
      </form>

      <div style={{ margin: "1rem 0", display: "flex", gap: "0.5rem" }}>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">Toutes les catégories</option>
          <option value="soumissions">Soumissions</option>
          <option value="passage">Passage</option>
          <option value="garde">Garde</option>
          <option value="renversements">Renversements</option>
          <option value="autre">Autre</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Tous les statuts</option>
          <option value="à réviser">À réviser</option>
          <option value="maîtrisée">Maîtrisée</option>
        </select>
        <input
          type="text"
          placeholder="Filtrer par mot-clé"
          value={filters.title}
          onChange={(e) => setFilters({ ...filters, title: e.target.value })}
        />
        <button onClick={handleResetFilters}>Réinitialiser les filtres</button>
      </div>

      {filteredTechniques.length === 0 ? (
        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Aucune technique trouvée.
        </p>
      ) : (
        <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
          {filteredTechniques.map((t) => (
            <div
              key={t.id}
              className="card"
              style={{
                textAlign: "left",
                position: "relative",
                borderLeft: `8px solid ${getCategoryColor(t.category)}`,
              }}
            >
              <div>
                <strong>{t.title}</strong> – <em>{t.category}</em>
                {t.status === "maîtrisée" ? (
                  <FaStar
                    style={{ color: "#fcc419", marginLeft: "0.5rem" }}
                    title="Maîtrisée"
                  />
                ) : (
                  <FaExclamationTriangle
                    style={{ color: "#ff922b", marginLeft: "0.5rem" }}
                    title="À réviser"
                  />
                )}
              </div>
              {t.image && (
                <img
                  src={t.image}
                  alt="illustration"
                  style={{ marginTop: "0.5rem", maxWidth: "100%" }}
                />
              )}
              {t.video && (
                <video
                  src={t.video}
                  controls
                  style={{ marginTop: "0.5rem", maxWidth: "100%" }}
                />
              )}
              {t.note && (
                <div style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
                  <FaStickyNote style={{ marginRight: "0.3rem" }} /> {t.note}
                </div>
              )}
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem" }}
              >
                <button onClick={() => handleEdit(t)}>
                  <FaEdit /> Modifier
                </button>
                <button onClick={() => handleDelete(t.id)}>
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

export default TechniquesPage;
