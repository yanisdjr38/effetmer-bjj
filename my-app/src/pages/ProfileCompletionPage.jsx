import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./ProfileCompletionPage.scss";

/**
 * ProfileCompletionPage - For new users to complete their profile
 * Required fields: firstName, lastName, weightClass, beltLevel, yearsTraining
 */
export default function ProfileCompletionPage() {
  const navigate = useNavigate();
  const { user, updateProfile, isLoading, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    weightClass: user?.weightClass || "",
    beltLevel: user?.beltLevel || "white",
    yearsTraining: user?.yearsTraining || 0,
    gym: user?.gym || "",
    coachName: user?.coachName || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const weightClasses = [
    "Plumes (até 56kg)",
    "Leve (56-62kg)",
    "Meio-leve (62-69kg)",
    "Médio (69-76kg)",
    "Meio-pesado (76-82kg)",
    "Pesado (82-89kg)",
    "Super pesado (89-96kg)",
    "Pesadíssimo (+96kg)",
  ];

  const beltLevels = ["white", "blue", "purple", "brown", "black", "coral"];

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

    // Validate required fields
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.weightClass
    ) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile(formData);
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

            {/* Weight Class */}
            <div className="form-group">
              <label htmlFor="weightClass">
                Catégorie de poids <span className="required">*</span>
              </label>
              <select
                id="weightClass"
                name="weightClass"
                value={formData.weightClass}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {weightClasses.map((wc) => (
                  <option key={wc} value={wc}>
                    {wc}
                  </option>
                ))}
              </select>
            </div>

            {/* Belt Level */}
            <div className="form-group">
              <label htmlFor="beltLevel">Ceinture</label>
              <select
                id="beltLevel"
                name="beltLevel"
                value={formData.beltLevel}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="white">Blanche</option>
                <option value="blue">Bleue</option>
                <option value="purple">Violette</option>
                <option value="brown">Marron</option>
                <option value="black">Noire</option>
                <option value="coral">Corail</option>
              </select>
            </div>

            {/* Years Training */}
            <div className="form-group">
              <label htmlFor="yearsTraining">Années d'entraînement</label>
              <input
                id="yearsTraining"
                type="number"
                name="yearsTraining"
                value={formData.yearsTraining}
                onChange={handleChange}
                min="0"
                step="0.5"
                disabled={isSubmitting}
              />
            </div>

            {/* Gym Name (Optional) */}
            <div className="form-group">
              <label htmlFor="gym">Nom du club / gym</label>
              <input
                id="gym"
                type="text"
                name="gym"
                value={formData.gym}
                onChange={handleChange}
                placeholder="Votre club BJJ"
                disabled={isSubmitting}
              />
            </div>

            {/* Coach Name (Optional) */}
            <div className="form-group">
              <label htmlFor="coachName">Entraîneur</label>
              <input
                id="coachName"
                type="text"
                name="coachName"
                value={formData.coachName}
                onChange={handleChange}
                placeholder="Nom de votre entraîneur"
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
