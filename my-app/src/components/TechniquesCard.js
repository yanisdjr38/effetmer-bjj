import React from "react";

function TechniquesCard({ Techniques }) {
  return (
    <div className="techniquecard">
      <h2>{Techniques.name}</h2>
      <p>{Techniques.description}</p>
    </div>
  );
}

export default TechniquesCard;
