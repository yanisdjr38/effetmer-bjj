import React, { useEffect, useRef, useState } from "react";

function TimerPage() {
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(false);
  const interval = useRef(null);

  const start = () => {
    if (!active) {
      setActive(true);
      interval.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
  };

  const pause = () => {
    setActive(false);
    clearInterval(interval.current);
  };

  const reset = () => {
    pause();
    setSeconds(0);
  };

  const startSparring = () => {
    reset();
    let total = 0;
    const rounds = [
      { label: "Sparring", duration: 300 },
      { label: "Repos", duration: 60 },
    ];
    let i = 0;

    interval.current = setInterval(() => {
      total++;
      setSeconds(total);
      if (total >= rounds[i].duration) {
        i = (i + 1) % rounds.length;
        total = 0;
        alert(`Changement : ${rounds[i].label}`);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => clearInterval(interval.current);
  }, []);

  return (
    <div className="container timer-page" style={{ textAlign: "center" }}>
      <h2>Chronomètre</h2>
      <h1>
        {String(Math.floor(seconds / 60)).padStart(2, "0")}:
        {String(seconds % 60).padStart(2, "0")}
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <button onClick={start}>Démarrer</button>
        <button onClick={pause}>Pause</button>
        <button onClick={reset}>Reset</button>
        <button onClick={startSparring}>Mode Sparring</button>
      </div>
    </div>
  );
}

export default TimerPage;
