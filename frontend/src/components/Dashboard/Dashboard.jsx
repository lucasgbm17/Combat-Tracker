import { useState } from "react";
import CreateCombatModal from "../Modals/CreateCombatModal/CreateCombatModal";
import CombatCard from "../Cards/CombatCard/CombatCard";
import "./Dashboard.css";

function Dashboard({ combats, onCreateCombat, onDeleteCombat }) {
  //Carregar Combates----------------------------------------------------------------------------
  function getCombatData(combatId) {
    const savedCombatData = localStorage.getItem(
      `dnd-combat-tracker-combat-${combatId}`,
    );

    if (!savedCombatData) {
      return {
        participants: [],
        round: 1,
      };
    }

    try {
      return JSON.parse(savedCombatData);
    } catch {
      return {
        participants: [],
        round: 1,
      };
    }
  }

  //Modal de Combate----------------------------------------------------------------------------------
  const [isCreateCombatModalOpen, setIsCreateCombatModalOpen] = useState(false);

  function handleOpenCreateCombatModal() {
    setIsCreateCombatModalOpen(true);
  }

  function handleCloseCreateCombatModal() {
    setIsCreateCombatModalOpen(false);
  }
  //--------------------------------------------------------------------------------------------------
  function getCombatSummary(combat) {
    const combatData = getCombatData(combat.id);
    const participants = combatData.participants || [];

    const playersCount = participants.filter(
      (participant) => participant.type === "player",
    ).length;

    const monstersCount = participants.filter(
      (participant) => participant.type === "monster",
    ).length;

    return {
      ...combat,
      participants: playersCount,
      monsters: monstersCount,
      round: combatData.round || 1,
    };
  }

  return (
    <main className="dashboard">
      <section className="dashboard__header">
        <div>
          <p className="dashboard__subtitle">Painel do Mestre</p>
          <h2 className="dashboard__title">Meus combates</h2>
          <p className="dashboard__description">
            Crie, organize e acesse seus encontros de Dungeons & Dragons em um
            único lugar.
          </p>
        </div>

        <button
          className="dashboard__button"
          type="button"
          onClick={handleOpenCreateCombatModal}
        >
          Novo combate
        </button>
      </section>

      {combats.length > 0 ? (
        <section className="dashboard__list">
          {combats.map((combat) => (
            <CombatCard
              key={combat.id}
              combat={getCombatSummary(combat)}
              onDeleteCombat={onDeleteCombat}
            />
          ))}
        </section>
      ) : (
        <p className="dashboard__empty">
          Nenhum combate criado ainda. Clique em “Novo combate” para começar.
        </p>
      )}
      <CreateCombatModal
        isOpen={isCreateCombatModalOpen}
        onClose={handleCloseCreateCombatModal}
        onCreateCombat={onCreateCombat}
      />
    </main>
  );
}

export default Dashboard;
