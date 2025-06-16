import React, { useState } from "react";

function TechniquesPage() {
  const [techniques, setTechniques] = useState(() => {
    const saved = localStorage.getItem("techniques");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({ name: "", category: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTechnique = { ...form, id: Date.now() };
    const updated = [...techniques, newTechnique];
    setTechniques(updated);
    localStorage.setItem("techniques", JSON.stringify(updated));
    setForm({ name: "", category: "" });
  };

  const handleDelete = (id) => {
    const updated = techniques.filter((t) => t.id !== id);
    setTechniques(updated);
    localStorage.setItem("techniques", JSON.stringify(updated));
  };

  return (
    <div className="container">
      <h2>Bibliothèque de techniques</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nom de la technique"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Catégorie (garde, passage...)"
          value={form.category}
          onChange={handleChange}
          required
        />
        <button type="submit">Ajouter</button>
      </form>

      <ul>
        {techniques.map((t) => (
          <li key={t.id}>
            🥋 {t.name} — {t.category}
            <button onClick={() => handleDelete(t.id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TechniquesPage;
