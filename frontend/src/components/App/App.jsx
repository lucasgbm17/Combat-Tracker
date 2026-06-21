import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Dashboard from "../Dashboard/Dashboard";
import CombatPage from "../CombatPage/CombatPage";
import About from "../About/About";
import Footer from "../Footer/Footer";
gi;

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

//Carregar Combates----------------------------------------------
const COMBATS_STORAGE_KEY = "dnd-combat-tracker-combats";

function getInitialCombats() {
  const savedCombats = localStorage.getItem(COMBATS_STORAGE_KEY);

  if (!savedCombats) {
    return initialCombats;
  }

  try {
    return JSON.parse(savedCombats);
  } catch {
    return initialCombats;
  }
}

function App() {
  const [combats, setCombats] = useState(getInitialCombats);

  useEffect(() => {
    localStorage.setItem(COMBATS_STORAGE_KEY, JSON.stringify(combats));
  }, [combats]);

  //Criando Combate
  function handleCreateCombat(combatData) {
    const newCombat = {
      id: Date.now().toString(),
      name: combatData.name,
      description: combatData.description || "Novo combate criado pelo Mestre.",
      participants: 0,
      monsters: 0,
      round: 1,
    };

    localStorage.setItem(
      `dnd-combat-tracker-combat-${newCombat.id}`,
      JSON.stringify({
        participants: [],
        round: 1,
        currentTurnIndex: 0,
      }),
    );

    setCombats((currentCombats) => [newCombat, ...currentCombats]);
  }

  //Deletando Combate
  function handleDeleteCombat(combatId) {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este combate?",
    );

    if (!confirmDelete) {
      return;
    }

    setCombats((currentCombats) =>
      currentCombats.filter((combat) => combat.id !== combatId),
    );

    localStorage.removeItem(`dnd-combat-tracker-combat-${combatId}`);
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

        <Route
          path="/combats/:combatId"
          element={<CombatPage combats={combats} />}
        />

        <Route path="/about" element={<About />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
