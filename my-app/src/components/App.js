import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Homepage from "../pages/HomePage.js"; // Assure-toi que le chemin est correct !
import TrainingPage from "../pages/TrainingPage.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/training" element={<TrainingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
