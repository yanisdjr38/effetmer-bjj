import homeIcon from "../assets/images/home.png";
import noteIcon from "../assets/images/journal-alt.png";

function NavBar() {
  return (
    <nav>
      <a>
        <button>
          <img src={homeIcon} alt="Home" />
        </button>
      </a>
      <a>
        <button>
          <img src={noteIcon} alt="Note" />
        </button>
      </a>
      <a></a>
    </nav>
  );
}

export default NavBar;
