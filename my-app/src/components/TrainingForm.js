import React, { useEffect, useState } from "react";

const TrainingForm = ({ onAdd, initialData }) => {
  const [form, setForm] = useState({
    date: "",
    type: "techniques",
    duration: "",
    note: "",
  });

  const [filters, setFilters] = useState({ date: "", type: "" });

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...form });
    setForm({ date: "", type: "techniques", duration: "", note: "" });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <select name="type" value={form.type} onChange={handleChange} required>
          <option value="techniques">Techniques</option>
          <option value="drill">Drill</option>
          <option value="sparring">Sparring</option>
          <option value="openmat">Open Mat</option>
          <option value="muscu">Musculation</option>
          <option value="cardio">Cardio</option>
          <option value="competition">Compétitions</option>
        </select>

        <input
          type="number"
          name="duration"
          placeholder="Durée (min)"
          value={form.duration}
          onChange={handleChange}
          required
        />

        <textarea
          name="note"
          placeholder="Note sur la séance (facultatif)"
          value={form.note}
          onChange={handleChange}
          rows={3}
        />

        <button type="submit">{initialData ? "Modifier" : "Ajouter"}</button>
      </form>

      <div style={{ margin: "1rem 0", display: "flex", gap: "0.5rem" }}>
        <input
          type="date"
          placeholder="Filtrer par date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />

        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">Tous les types</option>
          <option value="techniques">Techniques</option>
          <option value="drill">Drill</option>
          <option value="sparring">Sparring</option>
          <option value="openmat">Open Mat</option>
          <option value="muscu">Musculation</option>
          <option value="cardio">Cardio</option>
          <option value="competition">Compétitions</option>
        </select>
      </div>
    </>
  );
};

export default TrainingForm;
