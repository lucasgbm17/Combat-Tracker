import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Dashboard from "../Dashboard/Dashboard";
import CombatPage from "../CombatPage/CombatPage";
import About from "../About/About";
import Footer from "../Footer/Footer";
import "./App.css";

const initialCombats = [
  {
    id: "1",
    name: "Lobisomens",
    description: "Combate contra lobisomens nas florestas de Baróvia.",
    participants: 7,
    monsters: 4,
    round: 1,
  },
  {
    id: "2",
    name: "Goblins",
    description: "Um encontro rápido durante a viagem do grupo.",
    participants: 5,
    monsters: 3,
    round: 2,
  },
  {
    id: "3",
    name: "Ataque das Aranhas",
    description: "Criaturas sombrias protegendo uma antiga fortaleza.",
    participants: 8,
    monsters: 5,
    round: 3,
  },
];

function App() {
  const [combats, setCombats] = useState(initialCombats);

  //Criando Combate
  function handleCreateCombat() {
    const combatName = window.prompt("Digite o nome do novo combate:");

    if (!combatName || combatName.trim() === "") {
      return;
    }

    const newCombat = {
      id: Date.now().toString(),
      name: combatName.trim(),
      description: "Novo combate criado pelo Mestre.",
      participants: 0,
      monsters: 0,
      round: 1,
    };

    setCombats([newCombat, ...combats]);
  }

  //Deletando Combate
  function handleDeleteCombat(combatId) {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este combate?",
    );

    if (!confirmDelete) {
      return;
    }

    setCombats(combats.filter((combat) => combat.id !== combatId));
  }

  return (
    <div className="page">
      <Header />

      <Routes>
        <Route path="/" element={<Main />} />

        <Route
          path="/dashboard"
          element={
            <Dashboard
              combats={combats}
              onCreateCombat={handleCreateCombat}
              onDeleteCombat={handleDeleteCombat}
            />
          }
        />

        <Route path="/combats/:combatId" element={<CombatPage />} />

        <Route path="/about" element={<About />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
