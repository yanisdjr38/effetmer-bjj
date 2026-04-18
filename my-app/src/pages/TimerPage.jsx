import { useCallback, useEffect, useRef, useState } from "react";
import { FaPause, FaPlay, FaPlus, FaStop, FaTrash } from "react-icons/fa";
import soundSrc from "../assets/beep.mp3";
import { useLocalStorage } from "../hooks/useLocalStorage.jsx";
import styles from "./TimerPage.module.scss";

const DEFAULT_PROGRAMS = [
  { id: 1, name: "Sparring", work: 300, rest: 60, rounds: 5 },
  { id: 2, name: "Drill", work: 180, rest: 30, rounds: 4 },
];

/**
 * TimerPage - Programmeur d'entraînement avec timer
 */
function TimerPage() {
  const [programs, setPrograms] = useLocalStorage(
    "timerPrograms",
    DEFAULT_PROGRAMS,
  );
  const [currentProgram, setCurrentProgram] = useState(null);
  const [step, setStep] = useState("work");
  const [timeLeft, setTimeLeft] = useState(0);
  const [round, setRound] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const [newProgram, setNewProgram] = useState({
    name: "",
    work: "",
    rest: "",
    rounds: "",
  });
  const [errors, setErrors] = useState({});

  const validateProgram = useCallback(() => {
    const newErrors = {};
    if (!newProgram.name.trim()) newErrors.name = "Le nom est requis";
    if (!newProgram.work || parseInt(newProgram.work) <= 0) {
      newErrors.work = "Durée de travail requise (> 0)";
    }
    if (!newProgram.rest || parseInt(newProgram.rest) < 0) {
      newErrors.rest = "Durée de repos requise (>= 0)";
    }
    if (!newProgram.rounds || parseInt(newProgram.rounds) <= 0) {
      newErrors.rounds = "Nombre de rounds requis (> 0)";
    }
    return newErrors;
  }, [newProgram]);

  const handleCreateProgram = useCallback(() => {
    const newErrors = validateProgram();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newP = {
      name: newProgram.name,
      id: Date.now(),
      work: parseInt(newProgram.work),
      rest: parseInt(newProgram.rest),
      rounds: parseInt(newProgram.rounds),
    };

    setPrograms([...programs, newP]);
    setNewProgram({ name: "", work: "", rest: "", rounds: "" });
    setErrors({});
  }, [programs, newProgram, validateProgram, setPrograms]);

  const handleDeleteProgram = useCallback(
    (id) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce programme ?")) {
        setPrograms(programs.filter((p) => p.id !== id));
        if (currentProgram?.id === id) stopProgram();
      }
    },
    [programs, currentProgram, setPrograms],
  );

  const startProgram = useCallback((program) => {
    clearInterval(intervalRef.current);
    setCurrentProgram(program);
    setRound(1);
    setStep("work");
    setTimeLeft(program.work);
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const stopProgram = useCallback(() => {
    clearInterval(intervalRef.current);
    setCurrentProgram(null);
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(0);
    setStep("work");
    setRound(1);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused && currentProgram) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (audioRef.current) {
              audioRef.current
                .play()
                .catch(() => console.warn("Audio playback failed"));
            }

            if (step === "work") {
              setStep("rest");
              return currentProgram.rest;
            } else {
              if (round >= currentProgram.rounds) {
                setIsRunning(false);
                return 0;
              }
              setRound((r) => r + 1);
              setStep("work");
              return currentProgram.work;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused, step, round, currentProgram]);

  const formatTime = (s) => {
    const min = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const progress = currentProgram
    ? (((step === "work" ? currentProgram.work : currentProgram.rest) -
        timeLeft) /
        (step === "work" ? currentProgram.work : currentProgram.rest)) *
      100
    : 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProgram((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  return (
    <div className="container">
      <section className={styles.timer_page}>
        <h2>Timer d'entraînement</h2>

        {/* Timer actif */}
        {currentProgram && (
          <div className={styles.timer_display_section}>
            <h3 style={{ color: "white", marginBottom: "0.5rem" }}>
              {currentProgram.name}
            </h3>
            <div className={styles.timer_label}>
              Round {round}/{currentProgram.rounds} •{" "}
              {step === "work" ? "Travail" : "Repos"}
            </div>

            <div className={styles.timer_display}>{formatTime(timeLeft)}</div>

            <svg
              viewBox="0 0 36 36"
              className="circular-chart"
              style={{ margin: "1.5rem auto", width: "120px", height: "120px" }}
            >
              <circle
                className="circle-bg"
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="3"
              />
              <circle
                className="circle"
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke="white"
                strokeWidth="3"
                transform="rotate(-90 18 18)"
                style={{
                  strokeDasharray: `${progress}, 100`,
                  transition: "stroke-dasharray 1s linear",
                }}
              />
            </svg>

            <div className={styles.timer_controls}>
              <button onClick={togglePause}>
                {isPaused ? <FaPlay /> : <FaPause />}
                {isPaused ? "Reprendre" : "Pause"}
              </button>
              <button onClick={stopProgram}>
                <FaStop /> Arrêter
              </button>
            </div>
          </div>
        )}

        {/* Programmes existants */}
        <div className={styles.programs_section}>
          <h3>Mes programmes</h3>
          {programs.length === 0 ? (
            <div className={styles.empty_state}>
              <p>Aucun programme créé. Ajoute-en un pour commencer !</p>
            </div>
          ) : (
            <div className={styles.programs_list}>
              {programs.map((p) => (
                <div key={p.id} className={styles.program_item}>
                  <div className={styles.program_info}>
                    <div className={styles.program_name}>{p.name}</div>
                    <div className={styles.program_details}>
                      <span>{p.rounds}× rounds</span>
                      <span>{formatTime(p.work)} travail</span>
                      <span>{formatTime(p.rest)} repos</span>
                    </div>
                  </div>
                  <div className={styles.program_actions}>
                    <button
                      onClick={() => startProgram(p)}
                      className="primary"
                      title="Démarrer"
                    >
                      <FaPlay /> Démarrer
                    </button>
                    <button
                      onClick={() => handleDeleteProgram(p.id)}
                      className="danger"
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Créer un nouveau programme */}
        <fieldset className={styles.form_section}>
          <legend>Créer un programme</legend>

          <div className={styles.form_group}>
            <label htmlFor="name">Nom du programme *</label>
            <input
              id="name"
              name="name"
              placeholder="Ex: Sparring spécifique..."
              value={newProgram.name}
              onChange={handleInputChange}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <small className={styles.error}>{errors.name}</small>
            )}
          </div>

          <div className={styles.form_grid}>
            <div className={styles.form_group}>
              <label htmlFor="work">Travail (secondes) *</label>
              <input
                id="work"
                type="number"
                name="work"
                placeholder="300"
                min="1"
                value={newProgram.work}
                onChange={handleInputChange}
                aria-invalid={!!errors.work}
              />
              {errors.work && (
                <small className={styles.error}>{errors.work}</small>
              )}
            </div>

            <div className={styles.form_group}>
              <label htmlFor="rest">Repos (secondes) *</label>
              <input
                id="rest"
                type="number"
                name="rest"
                placeholder="60"
                min="0"
                value={newProgram.rest}
                onChange={handleInputChange}
                aria-invalid={!!errors.rest}
              />
              {errors.rest && (
                <small className={styles.error}>{errors.rest}</small>
              )}
            </div>

            <div className={styles.form_group}>
              <label htmlFor="rounds">Nombre de rounds *</label>
              <input
                id="rounds"
                type="number"
                name="rounds"
                placeholder="5"
                min="1"
                value={newProgram.rounds}
                onChange={handleInputChange}
                aria-invalid={!!errors.rounds}
              />
              {errors.rounds && (
                <small className={styles.error}>{errors.rounds}</small>
              )}
            </div>
          </div>

          <div className={styles.form_actions}>
            <button onClick={handleCreateProgram} className="primary">
              <FaPlus style={{ marginRight: "0.5rem" }} /> Créer le programme
            </button>
          </div>
        </fieldset>

        <audio ref={audioRef} src={soundSrc} preload="auto" />
      </section>
    </div>
  );
}

export default TimerPage;
