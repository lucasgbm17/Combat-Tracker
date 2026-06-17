import { Routes, Route } from "react-router-dom";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Dashboard from "../Dashboard/Dashboard";
import CombatPage from "../CombatPage/CombatPage";
import CombatCard from "../Cards/CombatCard/CombatCard";
import About from "../About/About";
import Footer from "../Footer/Footer";
import "./App.css";

function App() {
  return (
    <div className="page">
      <Header />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/combats/:combatId" element={<CombatPage />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
