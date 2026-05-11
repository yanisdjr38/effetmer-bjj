import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import styles from "./OnboardingPage.module.scss";

/**
 * OnboardingPage - Multi-step wizard for first-time user setup
 * Collects: name, academy, belt, weight, experience, goals, preferences
 */
const OnboardingPage = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useApp();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    academy: "",
    belt: "white",
    weight: "",
    yearsOfPractice: "",
    weeklyGoal: 4,
    preferredTrainingDays: ["Monday", "Wednesday", "Friday", "Saturday"],
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error for this field
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors],
  );

  // Handle day selection toggle
  const handleDayToggle = useCallback((day) => {
    setFormData((prev) => {
      const days = prev.preferredTrainingDays;
      if (days.includes(day)) {
        return {
          ...prev,
          preferredTrainingDays: days.filter((d) => d !== day),
        };
      } else {
        return {
          ...prev,
          preferredTrainingDays: [...days, day],
        };
      }
    });
  }, []);

  // Validate current step
  const validateStep = useCallback(() => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "Le prénom est requis";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Le nom est requis";
      }
      if (!formData.academy.trim()) {
        newErrors.academy = "Le nom de l'académie est requis";
      }
    }

    if (step === 2) {
      if (!formData.weight || Number(formData.weight) <= 0) {
        newErrors.weight = "Un poids valide est requis";
      }
      if (!formData.yearsOfPractice || Number(formData.yearsOfPractice) < 0) {
        newErrors.yearsOfPractice = "Les années de pratique sont requises";
      }
    }

    if (step === 3) {
      if (formData.preferredTrainingDays.length === 0) {
        newErrors.preferredTrainingDays =
          "Sélectionnez au moins un jour d'entraînement";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [step, formData]);

  // Handle next step
  const handleNext = useCallback(() => {
    if (validateStep()) {
      if (step < totalSteps) {
        setStep((prev) => prev + 1);
      } else {
        // Complete onboarding
        completeOnboarding(formData);
        navigate("/");
      }
    }
  }, [step, totalSteps, validateStep, formData, completeOnboarding, navigate]);

  // Handle previous step
  const handlePrevious = useCallback(() => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  }, [step]);

  // Belt options with colors
  const belts = [
    { value: "white", label: "Ceinture Blanche", color: "#FFFFFF" },
    { value: "blue", label: "Ceinture Bleue", color: "#4169E1" },
    { value: "purple", label: "Ceinture Mauve", color: "#9370DB" },
    { value: "brown", label: "Ceinture Marron", color: "#8B4513" },
    { value: "black", label: "Ceinture Noire", color: "#000000" },
  ];

  // Days of week
  const daysOfWeek = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  return (
    <div className={styles.onboarding}>
      {/* Background decoration */}
      <div className={styles.bgDecor}></div>

      {/* Container */}
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>🥋 Bienvenue sur EFFETMER</h1>
          <p className={styles.subtitle}>
            Configurons votre suivi BJJ personnel
          </p>

          {/* Progress bar */}
          <div className={styles.progressBar}>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
            <p className={styles.stepIndicator}>
              Étape {step} sur {totalSteps}
            </p>
          </div>
        </div>

        {/* Form */}
        <form className={styles.form}>
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className={`${styles.step} ${styles.active}`}>
              <h2 className={styles.stepTitle}>Informations Personnelles</h2>

              <div className={styles.twoColumn}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">Prénom</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Jean"
                    className={errors.firstName ? styles.error : ""}
                  />
                  {errors.firstName && (
                    <span className={styles.errorText}>{errors.firstName}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Nom</label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Dupont"
                    className={errors.lastName ? styles.error : ""}
                  />
                  {errors.lastName && (
                    <span className={styles.errorText}>{errors.lastName}</span>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="academy">Académie / Équipe</label>
                <input
                  id="academy"
                  type="text"
                  name="academy"
                  value={formData.academy}
                  onChange={handleInputChange}
                  placeholder="Votre académie BJJ"
                  className={errors.academy ? styles.error : ""}
                />
                {errors.academy && (
                  <span className={styles.errorText}>{errors.academy}</span>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Belt & Stats */}
          {step === 2 && (
            <div className={`${styles.step} ${styles.active}`}>
              <h2 className={styles.stepTitle}>
                Votre Ceinture & Statistiques
              </h2>

              <div className={styles.formGroup}>
                <label>Niveau de Ceinture Actuel</label>
                <div className={styles.beltOptions}>
                  {belts.map((belt) => (
                    <button
                      key={belt.value}
                      type="button"
                      className={`${styles.beltOption} ${
                        formData.belt === belt.value ? styles.selected : ""
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          belt: belt.value,
                        }))
                      }
                    >
                      <div
                        className={styles.beltCircle}
                        style={{ backgroundColor: belt.color }}
                      ></div>
                      <span>{belt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.twoColumn}>
                <div className={styles.formGroup}>
                  <label htmlFor="weight">Poids (kg)</label>
                  <input
                    id="weight"
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="70"
                    min="30"
                    max="200"
                    className={errors.weight ? styles.error : ""}
                  />
                  {errors.weight && (
                    <span className={styles.errorText}>{errors.weight}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="yearsOfPractice">Années de Pratique</label>
                  <input
                    id="yearsOfPractice"
                    type="number"
                    name="yearsOfPractice"
                    value={formData.yearsOfPractice}
                    onChange={handleInputChange}
                    placeholder="2"
                    min="0"
                    max="60"
                    className={errors.yearsOfPractice ? styles.error : ""}
                  />
                  {errors.yearsOfPractice && (
                    <span className={styles.errorText}>
                      {errors.yearsOfPractice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Training Schedule */}
          {step === 3 && (
            <div className={`${styles.step} ${styles.active}`}>
              <h2 className={styles.stepTitle}>
                Jours d'Entraînement Préférés
              </h2>
              <p className={styles.stepDescription}>
                Sélectionnez les jours où vous préférez vous entraîner
              </p>

              <div className={styles.daysGrid}>
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`${styles.dayButton} ${
                      formData.preferredTrainingDays.includes(day)
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDayToggle(day)}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>

              {errors.preferredTrainingDays && (
                <span className={styles.errorText}>
                  {errors.preferredTrainingDays}
                </span>
              )}
            </div>
          )}

          {/* Step 4: Goals */}
          {step === 4 && (
            <div className={`${styles.step} ${styles.active}`}>
              <h2 className={styles.stepTitle}>Votre Objectif Hebdomadaire</h2>
              <p className={styles.stepDescription}>
                Combien de séances voulez-vous compléter par semaine?
              </p>

              <div className={styles.goalSelector}>
                {[1, 2, 3, 4, 5, 6, 7].map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    className={`${styles.goalButton} ${
                      formData.weeklyGoal === goal ? styles.selected : ""
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        weeklyGoal: goal,
                      }))
                    }
                  >
                    <span className={styles.goalNumber}>{goal}</span>
                    <span className={styles.goalLabel}>
                      {goal === 1 ? "séance" : "séances"}
                    </span>
                  </button>
                ))}
              </div>

              <div className={styles.summary}>
                <h3>Résumé</h3>
                <p>
                  <strong>Nom:</strong> {formData.firstName} {formData.lastName}
                </p>
                <p>
                  <strong>Académie:</strong> {formData.academy}
                </p>
                <p>
                  <strong>Ceinture:</strong>{" "}
                  {belts.find((b) => b.value === formData.belt)?.label}
                </p>
                <p>
                  <strong>Expérience:</strong> {formData.yearsOfPractice} ans
                </p>
                <p>
                  <strong>Jours d'Entraînement:</strong>{" "}
                  {formData.preferredTrainingDays.join(", ")}
                </p>
                <p>
                  <strong>Objectif Hebdomadaire:</strong> {formData.weeklyGoal}{" "}
                  séances
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Navigation buttons */}
        <div className={styles.navigation}>
          <button
            type="button"
            className={`${styles.btn} ${styles.secondary}`}
            onClick={handlePrevious}
            disabled={step === 1}
          >
            ← Précédent
          </button>

          <button
            type="button"
            className={`${styles.btn} ${styles.primary}`}
            onClick={handleNext}
          >
            {step === totalSteps ? "Terminer la config 🚀" : "Suivant →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
