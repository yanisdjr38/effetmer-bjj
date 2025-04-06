import React from "react";

import SessionsCard from "../components/SessionsCard";
import "../styles/MySessions.css";

function MySessions() {
  return (
    <section className="mysessions">
      <h3>My Sessions</h3>
      <button className="addBtn">ADD SESSIONS</button>
      <div className="mysessions-container">
        <SessionsCard />
      </div>
    </section>
  );
}

export default MySessions;
