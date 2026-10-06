import {
  faBolt,
  faBook,
  faDumbbell,
  faFire,
  faPerson,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Source unique des types d'entraînement, partagée entre TrainingForm et TrainingPage.
 */
export const TRAINING_TYPES = [
  { value: "techniques", label: "Techniques", icon: faBook },
  { value: "drill", label: "Drill", icon: faBolt },
  { value: "sparring", label: "Sparring", icon: faPerson },
  { value: "openmat", label: "Open Mat", icon: faDumbbell },
  { value: "muscu", label: "Musculation", icon: faBolt },
  { value: "cardio", label: "Cardio", icon: faFire },
  { value: "competition", label: "Compétition", icon: faTrophy },
];

export const TRAINING_TYPE_LABELS = Object.fromEntries(
  TRAINING_TYPES.map((t) => [t.value, t.label]),
);
