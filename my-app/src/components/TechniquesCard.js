import React, { useState } from "react";
import data from "../data/data.json";
import "../styles/TechniquesCard.css";

function TechniquesCard() {
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="techniquescard">
      <h4>{data.name}</h4>
      {showMore && <p>{data.description}</p>}
      <button onClick={handleShowMore} className="btnAfficherPlus">
        {showMore ? "Afficher Moins" : "Afficher Plus"}
      </button>
    </div>
  );
}

export default TechniquesCard;
