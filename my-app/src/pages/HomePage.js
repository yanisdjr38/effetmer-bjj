import React, { useEffect, useState } from "react";
import {
  FaBook,
  FaCalendarAlt,
  FaClock,
  FaDumbbell,
  FaHistory,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import ProgressCircle from "../components/ProgressCircle";
import StatCard from "../components/StatCard";

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [trainingStats, setTrainingStats] = useState({
    total: 0,
    thisWeek: 0,
    totalDuration: 0,
    lastDate: null,
  });
  const [techniqueCount, setTechniqueCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      const sessions =
        JSON.parse(localStorage.getItem("trainingSessions")) || [];
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());

      const thisWeek = sessions.filter((session) => {
        const sessionDate = new Date(session.date);
        return sessionDate >= startOfWeek;
      });

      const totalDuration = sessions.reduce(
        (sum, s) => sum + Number(s.duration || 0),
        0
      );
      const lastSession =
        sessions.length > 0 ? sessions[sessions.length - 1].date : null;

      setTrainingStats({
        total: sessions.length,
        thisWeek: thisWeek.length,
        totalDuration,
        lastDate: lastSession,
      });

      const techniques = JSON.parse(localStorage.getItem("techniques")) || [];
      setTechniqueCount(techniques.length);
      setLoading(false);
    }, 500);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Aucun";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="homepage">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="homepage">
      <img src={logo} alt="EffetMer BJJ" className="logo-home" />
      <p>Voici un aperçu de ta progression :</p>

      <ProgressCircle
        value={trainingStats.thisWeek}
        max={5}
        label="Objectif hebdo"
      />

      <StatCard
        icon={<FaCalendarAlt />}
        label="Entraînements cette semaine"
        value={trainingStats.thisWeek}
      />
      <StatCard
        icon={<FaDumbbell />}
        label="Total des entraînements"
        value={trainingStats.total}
      />
      <StatCard
        icon={<FaClock />}
        label="Temps total"
        value={`${trainingStats.totalDuration} min`}
      />
      <StatCard
        icon={<FaBook />}
        label="Techniques enregistrées"
        value={techniqueCount}
      />
      <StatCard
        icon={<FaHistory />}
        label="Dernier entraînement"
        value={formatDate(trainingStats.lastDate)}
      />
    </div>
  );
}

export default HomePage;
