import React from "react";
import { IconContext } from "react-icons";

function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      <IconContext.Provider value={{ className: "stat-icon" }}>
        <div>{icon}</div>
      </IconContext.Provider>
      <h3>{label}</h3>
      <div className="stat-value">{value}</div>
    </div>
  );
}

export default StatCard;
