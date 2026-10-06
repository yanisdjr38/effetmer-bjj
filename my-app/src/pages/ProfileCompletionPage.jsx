import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./ProfileCompletionPage.scss";

/**
 * ProfileCompletionPage - For new users to complete their profile
 * Champs attendus par le backend (server/src/models/User.js: profile.*)
 */
export default function ProfileCompletionPage() {
  const navigate = useNavigate();
  const { user, updateProfile, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || "",
    lastName: user?.profile?.lastName || "",
    academy: user?.profile?.academy || "",
    belt: user?.profile?.belt || "white",
    weight: user?.profile?.weight || "",
    yearsOfPractice: user?.profile?.yearsOfPractice || 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const belts = ["white", "blue", "purple", "brown", "black"];
  const beltLabels = {
    white: "Blanche",
    blue: "Bleue",
    purple: "Violette",
    brown: "Marron",
    black: "Noire",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.academy.trim() ||
      !formData.weight ||
      Number(formData.weight) <= 0
    ) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        academy: formData.academy.trim(),
        belt: formData.belt,
        weight: Number(formData.weight),
        yearsOfPractice: Number(formData.yearsOfPractice) || 0,
      });
      // Profile complete, redirect to home
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la sauvegarde");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-completion-page">
      <div className="profile-completion-container">
        {/* Header */}
        <div className="completion-header">
          <h1>Compléter votre profil</h1>
          <p>Quelques informations pour personaliser votre expérience</p>
        </div>

        {/* Form Card */}
        <div className="completion-card">
          <form onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">
                  Prénom <span className="required">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jean"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">
                  Nom <span className="required">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Dupont"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Academy */}
            <div className="form-group">
              <label htmlFor="academy">
                Académie / Équipe <span className="required">*</span>
              </label>
              <input
                id="academy"
                type="text"
                name="academy"
                value={formData.academy}
                onChange={handleChange}
                placeholder="Votre académie BJJ"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Belt Level */}
            <div className="form-group">
              <label htmlFor="belt">Ceinture</label>
              <select
                id="belt"
                name="belt"
                value={formData.belt}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                {belts.map((belt) => (
                  <option key={belt} value={belt}>
                    {beltLabels[belt]}
                  </option>
                ))}
              </select>
            </div>

            {/* Weight */}
            <div className="form-group">
              <label htmlFor="weight">
                Poids (kg) <span className="required">*</span>
              </label>
              <input
                id="weight"
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min="30"
                max="300"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Years of Practice */}
            <div className="form-group">
              <label htmlFor="yearsOfPractice">Années d'entraînement</label>
              <input
                id="yearsOfPractice"
                type="number"
                name="yearsOfPractice"
                value={formData.yearsOfPractice}
                onChange={handleChange}
                min="0"
                step="0.5"
                disabled={isSubmitting}
              />
            </div>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}
            {authError && <div className="error-message">{authError}</div>}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sauvegarde en cours..." : "Continuer"}
            </button>

            {/* Note */}
            <p className="form-note">
              <span className="required">*</span> Champs obligatoires
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
