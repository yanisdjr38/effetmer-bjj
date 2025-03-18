import React, { useState } from "react";
import data from "../data/data.json";
import "../styles/TechniquesCard.css";

function TechniquesCard() {
  // État pour gérer l'affichage de chaque description
  const [showMore, setShowMore] = useState({});

  // Fonction pour gérer le toggle d'une technique spécifique
  const handleShowMore = (index) => {
    setShowMore((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Bascule l'état spécifique à l'index
    }));
  };

  return (
    <div className="techniques-container">
      {data.techniques.map((technique, index) => (
        <div key={index} className="techniquescard">
          <h4>{technique.name}</h4>
          {showMore[index] && <p>{technique.description}</p>}
          <button
            onClick={() => handleShowMore(index)}
            className="btnAfficherPlus"
          >
            {showMore[index] ? "Afficher Moins" : "Afficher Plus"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default TechniquesCard;
