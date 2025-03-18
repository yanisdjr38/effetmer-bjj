import "../styles/SessionsCard.css";

function SessionsCard() {
  return (
    <div className="sessionscard">
      <button className="btnEdit">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="20"
          height="20"
          viewBox="0 0 50 50"
        >
          <path d="M40.561,11.987c0.586,0.586,0.586,1.536,0,2.121L15.488,39.181l-5.292,1.77c-0.709,0.237-1.384-0.438-1.147-1.147	l1.77-5.292L35.892,9.439c0.586-0.586,1.536-0.586,2.121,0L40.561,11.987z M33.274,13.294L11.583,34.985l-1.058,3.164l1.325,1.325	l3.165-1.058l21.691-21.691L33.274,13.294z"></path>
        </svg>
      </button>
      <h4>Sessions 1</h4>
      <p>descripion</p>
    </div>
  );
}

export default SessionsCard;
