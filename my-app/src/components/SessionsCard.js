import "../styles/SessionsCard.css";

function SessionsCard() {
  return (
    <div className="sessionscard">
      <button className="btnEdit">
        <img src={require("../assets/images/pencil.png")} alt="Edit" />
      </button>
      <h4>Sessions 1</h4>
      <p>descripion</p>
    </div>
  );
}

export default SessionsCard;
