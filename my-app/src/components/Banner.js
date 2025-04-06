import "../styles/Banner.css";
function Banner() {
  const logo = require("../assets/images/anomalie_bjj_logo.png");
  return (
    <div className="banner">
      <img className="logo" src={logo} alt="Logo" />
      <h2>Training and Brazilian jiu-jitsu</h2>
    </div>
  );
}

export default Banner;
