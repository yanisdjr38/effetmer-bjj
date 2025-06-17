import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay, FaPlus, FaStop, FaTrash } from "react-icons/fa";
import soundSrc from "../assets/beep.mp3";
import "../styles.css";

function TimerPage() {
  const [programs, setPrograms] = useState([
    { id: 1, name: "Sparring", work: 300, rest: 60, rounds: 5 },
    { id: 2, name: "Drill", work: 180, rest: 30, rounds: 4 },
  ]);
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

  const handleCreateProgram = () => {
    const newP = {
      ...newProgram,
      id: Date.now(),
      work: parseInt(newProgram.work),
      rest: parseInt(newProgram.rest),
      rounds: parseInt(newProgram.rounds),
    };
    setPrograms([...programs, newP]);
    setNewProgram({ name: "", work: "", rest: "", rounds: "" });
  };

  const handleDeleteProgram = (id) => {
    const confirm = window.confirm("Supprimer ce programme ?");
    if (confirm) {
      const filtered = programs.filter((p) => p.id !== id);
      setPrograms(filtered);
    }
  };

  const startProgram = (program) => {
    clearInterval(intervalRef.current);
    setCurrentProgram(program);
    setRound(1);
    setStep("work");
    setTimeLeft(program.work);
    setIsRunning(true);
    setIsPaused(false);
  };

  const stopProgram = () => {
    clearInterval(intervalRef.current);
    setCurrentProgram(null);
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(0);
    setStep("work");
    setRound(1);
  };

  useEffect(() => {
    if (isRunning && !isPaused && currentProgram) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (audioRef.current) audioRef.current.play();
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
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused, step, round, currentProgram]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const formatTime = (s) => {
    const min = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const progress = currentProgram
    ? (timeLeft /
        (step === "work" ? currentProgram.work : currentProgram.rest)) *
      100
    : 0;

  return (
    <div className="container timer-page">
      <h2>Programmes d'entraînement</h2>
      <audio ref={audioRef} src={soundSrc} preload="auto" />

      <div className="program-list">
        {programs.map((p) => (
          <div key={p.id} className="program-item-row">
            <button className="program-button" onClick={() => startProgram(p)}>
              {p.name} ({p.rounds} x {p.work}s / {p.rest}s)
            </button>
            <button
              className="delete-button"
              onClick={() => handleDeleteProgram(p.id)}
              title="Supprimer"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="new-program">
        <input
          placeholder="Nom"
          value={newProgram.name}
          onChange={(e) =>
            setNewProgram({ ...newProgram, name: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Travail (s)"
          value={newProgram.work}
          onChange={(e) =>
            setNewProgram({ ...newProgram, work: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Repos (s)"
          value={newProgram.rest}
          onChange={(e) =>
            setNewProgram({ ...newProgram, rest: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Rounds"
          value={newProgram.rounds}
          onChange={(e) =>
            setNewProgram({ ...newProgram, rounds: e.target.value })
          }
        />
        <button onClick={handleCreateProgram}>
          <FaPlus /> Ajouter
        </button>
      </div>

      {currentProgram && (
        <div className="timer-box">
          <div className="timer-label">
            {step === "work" ? "Travail" : "Repos"} (Round {round}/
            {currentProgram.rounds})
          </div>
          <div className="timer-display">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle"
                strokeDasharray={`${progress}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="percentage">
                {formatTime(timeLeft)}
              </text>
            </svg>
          </div>
          <div className="timer-controls">
            <button onClick={togglePause}>
              {isPaused ? <FaPlay /> : <FaPause />}{" "}
              {isPaused ? "Reprendre" : "Pause"}
            </button>
            <button onClick={stopProgram}>
              <FaStop /> Arrêter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimerPage;
