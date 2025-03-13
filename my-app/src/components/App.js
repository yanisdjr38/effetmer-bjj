import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Banner from "./Banner.js";
import MySessions from "./MySessions.js";
import HomePage from "./pages/HomePage";
import TechniquesPage from "./pages/TechniquesPage";
import TrainingPage from "./pages/TrainingPage";

function App() {
  return (
    <div>
      <Banner />
      <MySessions />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/techniques" element={<TechniquesPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
