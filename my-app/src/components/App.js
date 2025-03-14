import Banner from "./Banner.js";
import MySessions from "./MySessions.js";
import MyTechniques from "./MyTechniques.js";

function App() {
  return (
    <div>
      <Banner />
      <MySessions />
      <section className="mytechniques">
        <MyTechniques />
      </section>
    </div>
  );
}

export default App;
