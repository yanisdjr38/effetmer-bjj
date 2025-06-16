import React, { useState } from "react";

const TrainingForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    date: "",
    type: "techniques",
    duration: "",
    note: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...form, id: Date.now() });
    setForm({ date: "", type: "techniques", duration: "", note: "" });
  };

  return (
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

      <button type="submit">Ajouter</button>
    </form>
  );
};

export default TrainingForm;
