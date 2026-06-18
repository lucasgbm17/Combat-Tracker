import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ParticipantCard from "../Cards/ParticipantCard/ParticipantCard";
import AddPlayerModal from "../Modals/AddPlayerModal/AddPlayerModal";
import HealthModal from "../Modals/HealthModal/HealthModal";
import MonsterSearch from "../MonsterSearch/MonsterSearch";
import "./CombatPage.css";

function CombatPage({ combats }) {
  const { combatId } = useParams();

  const currentCombat = combats.find((combat) => combat.id === combatId);

  const combatStorageKey = `dnd-combat-tracker-combat-${combatId}`;

  //Carrregar Combates---------------------------------------------------------------------------------------------------------
  function getInitialCombatData() {
    const savedCombatData = localStorage.getItem(combatStorageKey);

    if (!savedCombatData) {
      return {
        participants: [],
        round: 1,
        currentTurnIndex: 0,
      };
    }

    try {
      return JSON.parse(savedCombatData);
    } catch {
      return {
        participants: [],
        round: 1,
        currentTurnIndex: 0,
      };
    }
  }

  const initialCombatData = getInitialCombatData();

  const [participants, setParticipants] = useState(
    initialCombatData.participants,
  );
  const [currentTurnIndex, setCurrentTurnIndex] = useState(
    initialCombatData.currentTurnIndex,
  );
  const [round, setRound] = useState(initialCombatData.round);
  const [isMonsterSearchOpen, setIsMonsterSearchOpen] = useState(false);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [healthModal, setHealthModal] = useState({
    isOpen: false,
    mode: null,
    participantId: null,
  });

  useEffect(() => {
    const combatData = {
      participants,
      round,
      currentTurnIndex,
    };

    localStorage.setItem(combatStorageKey, JSON.stringify(combatData));
  }, [participants, round, currentTurnIndex, combatStorageKey]);

  const sortedParticipants = [...participants].sort(
    (a, b) => b.initiative - a.initiative,
  );

  const activeParticipant = sortedParticipants[currentTurnIndex];

  const selectedHealthParticipant = participants.find(
    (participant) => participant.id === healthModal.participantId,
  );

  //Abrir/Fechar Modal---------------------------------------------------------------------------------------------------------
  function handleOpenAddPlayerModal() {
    setIsAddPlayerModalOpen(true);
  }

  function handleCloseAddPlayerModal() {
    setIsAddPlayerModalOpen(false);
  }

  //Abrir/Fechar Monster Search------------------------------------------------------------------------------------------------
  function handleToggleMonsterSearch() {
    setIsMonsterSearchOpen((currentValue) => !currentValue);
  }

  //Monstro--------------------------------------------------------------------------------------------------------------------
  function getMonsterArmorClass(monster) {
    return monster.armor_class?.[0]?.value || 10;
  }

  function parseSpeedValue(speedValue) {
    if (!speedValue) {
      return null;
    }

    const parsedSpeed = Number.parseInt(speedValue, 10);

    if (Number.isNaN(parsedSpeed)) {
      return null;
    }

    return parsedSpeed;
  }

  function getMonsterSpeed(monster) {
    return {
      walk: parseSpeedValue(monster.speed?.walk),
      fly: parseSpeedValue(monster.speed?.fly),
      swim: parseSpeedValue(monster.speed?.swim),
      climb: parseSpeedValue(monster.speed?.climb),
      burrow: parseSpeedValue(monster.speed?.burrow),
    };
  }

  function handleAddMonsterFromApi(monster) {
    const initiativeValue = window.prompt(`Iniciativa de ${monster.name}:`);

    if (!initiativeValue) {
      return;
    }

    const initiative = Number(initiativeValue);

    if (Number.isNaN(initiative)) {
      window.alert("Digite uma iniciativa válida.");
      return;
    }

    const activeParticipantId = activeParticipant?.id;

    const newMonster = {
      id: `m-${monster.index}-${Date.now()}`,
      name: monster.name,
      type: "monster",
      armorClass: getMonsterArmorClass(monster),
      currentHp: monster.hit_points || 1,
      maxHp: monster.hit_points || 1,
      initiative,
      speed: getMonsterSpeed(monster),
      challengeRating: monster.challenge_rating,
      apiIndex: monster.index,
    };

    const updatedParticipants = [...participants, newMonster];

    const sortedUpdatedParticipants = [...updatedParticipants].sort(
      (a, b) => b.initiative - a.initiative,
    );

    setParticipants(updatedParticipants);

    if (activeParticipantId) {
      const newActiveIndex = sortedUpdatedParticipants.findIndex(
        (participant) => participant.id === activeParticipantId,
      );

      setCurrentTurnIndex(newActiveIndex >= 0 ? newActiveIndex : 0);
    }

    setIsMonsterSearchOpen(false);
  }

  //Próximo Turno--------------------------------------------------------------------------------------------------------------
  function handleNextTurn() {
    if (sortedParticipants.length === 0) {
      return;
    }

    const nextTurnIndex = currentTurnIndex + 1;

    if (nextTurnIndex >= sortedParticipants.length) {
      setCurrentTurnIndex(0);
      setRound(round + 1);
      return;
    }

    setCurrentTurnIndex(nextTurnIndex);
  }

  //Adicionar Dano------------------------------------------------------------------------------------------------------------
  function handleOpenDamageModal(participantId) {
    setHealthModal({
      isOpen: true,
      mode: "damage",
      participantId,
    });
  }

  //Adicionar Cura------------------------------------------------------------------------------------------------------
  function handleOpenHealModal(participantId) {
    setHealthModal({
      isOpen: true,
      mode: "heal",
      participantId,
    });
  }

  function handleCloseHealthModal() {
    setHealthModal({
      isOpen: false,
      mode: null,
      participantId: null,
    });
  }

  function handleSubmitHealthChange(amount) {
    setParticipants((currentParticipants) =>
      currentParticipants.map((participant) => {
        if (participant.id !== healthModal.participantId) {
          return participant;
        }

        if (healthModal.mode === "damage") {
          return {
            ...participant,
            currentHp: Math.max(0, participant.currentHp - amount),
          };
        }

        return {
          ...participant,
          currentHp: Math.min(
            participant.maxHp,
            participant.currentHp + amount,
          ),
        };
      }),
    );

    handleCloseHealthModal();
  }
  //Adicionar jogador-------------------------------------------------------------------------------------------
  function handleAddPlayer(playerData) {
    const activeParticipantId = activeParticipant?.id;

    const newPlayer = {
      id: `p-${Date.now()}`,
      name: playerData.name,
      type: "player",
      armorClass: playerData.armorClass,
      currentHp: playerData.maxHp,
      maxHp: playerData.maxHp,
      initiative: playerData.initiative,
      speed: {
        walk: playerData.speed,
      },
    };

    const updatedParticipants = [...participants, newPlayer];

    const sortedUpdatedParticipants = [...updatedParticipants].sort(
      (a, b) => b.initiative - a.initiative,
    );

    setParticipants(updatedParticipants);

    if (activeParticipantId) {
      const newActiveIndex = sortedUpdatedParticipants.findIndex(
        (participant) => participant.id === activeParticipantId,
      );

      setCurrentTurnIndex(newActiveIndex >= 0 ? newActiveIndex : 0);
    }
  }

  //Remover Participante
  function handleDeleteParticipant(participantId) {
    const participantToDelete = participants.find(
      (participant) => participant.id === participantId,
    );

    if (!participantToDelete) {
      return;
    }

    const confirmDelete = window.confirm(
      `Tem certeza que deseja remover ${participantToDelete.name} do combate?`,
    );

    if (!confirmDelete) {
      return;
    }

    const activeParticipantId = activeParticipant?.id;

    const updatedParticipants = participants.filter(
      (participant) => participant.id !== participantId,
    );

    setParticipants(updatedParticipants);

    if (updatedParticipants.length === 0) {
      setCurrentTurnIndex(0);
      setRound(1);
      return;
    }

    const sortedUpdatedParticipants = [...updatedParticipants].sort(
      (a, b) => b.initiative - a.initiative,
    );

    if (participantId === activeParticipantId) {
      setCurrentTurnIndex((currentIndex) =>
        Math.min(currentIndex, sortedUpdatedParticipants.length - 1),
      );
      return;
    }

    const newActiveParticipantIndex = sortedUpdatedParticipants.findIndex(
      (participant) => participant.id === activeParticipantId,
    );

    setCurrentTurnIndex(
      newActiveParticipantIndex >= 0 ? newActiveParticipantIndex : 0,
    );
  }

  //Atualizar Cartão-------------------------------------------------------------------------------------------------------------------
  function handleUpdateParticipant(participantId, field, value) {
    const activeParticipantId = activeParticipant?.id;

    const updatedParticipants = participants.map((participant) => {
      if (participant.id !== participantId) {
        return participant;
      }

      if (field === "name") {
        if (value.trim() === "") {
          return participant;
        }

        return {
          ...participant,
          name: value.trim(),
        };
      }

      const numericValue = Number(value);

      if (Number.isNaN(numericValue)) {
        return participant;
      }

      if (field === "armorClass" && numericValue <= 0) {
        return participant;
      }

      if (field === "maxHp" && numericValue <= 0) {
        return participant;
      }

      if (field === "currentHp" && numericValue < 0) {
        return participant;
      }

      if (field === "currentHp") {
        return {
          ...participant,
          currentHp: Math.min(numericValue, participant.maxHp),
        };
      }

      if (field === "maxHp") {
        return {
          ...participant,
          maxHp: numericValue,
          currentHp: Math.min(participant.currentHp, numericValue),
        };
      }

      return {
        ...participant,
        [field]: numericValue,
      };
    });

    const sortedUpdatedParticipants = [...updatedParticipants].sort(
      (a, b) => b.initiative - a.initiative,
    );

    setParticipants(updatedParticipants);

    if (activeParticipantId) {
      const newActiveParticipantIndex = sortedUpdatedParticipants.findIndex(
        (participant) => participant.id === activeParticipantId,
      );

      setCurrentTurnIndex(
        newActiveParticipantIndex >= 0 ? newActiveParticipantIndex : 0,
      );
    }
  }

  return (
    <main className="combat-page">
      <section className="combat-page__hero">
        <div className="combat-page__heading">
          <p className="combat-page__subtitle">Controle de combate</p>

          <h2 className="combat-page__title">
            {currentCombat ? currentCombat.name : "Combate"}
          </h2>

          <p className="combat-page__description">
            Gerencie jogadores, monstros, pontos de vida, iniciativa e turnos em
            uma única ordem de combate.
          </p>
        </div>
      </section>

      <section className="combat-page__controls">
        <div className="combat-page__actions">
          <button
            className="combat-page__button"
            type="button"
            onClick={handleOpenAddPlayerModal}
          >
            Adicionar jogador
          </button>

          <button
            className="combat-page__button combat-page__button_secondary"
            type="button"
            onClick={handleToggleMonsterSearch}
          >
            {isMonsterSearchOpen ? "Fechar busca" : "Adicionar monstro"}
          </button>

          <button
            className="combat-page__button combat-page__button_next"
            type="button"
            onClick={handleNextTurn}
          >
            Próximo turno
          </button>
        </div>

        <div className="combat-page__status">
          <div className="combat-page__status-card">
            <span className="combat-page__status-number">{round}</span>
            <span className="combat-page__status-label">Rodada</span>
          </div>

          <div className="combat-page__status-card combat-page__status-card_wide">
            <span className="combat-page__status-number">
              {activeParticipant ? activeParticipant.name : "Sem participantes"}
            </span>
            <span className="combat-page__status-label">Turno atual</span>
          </div>
        </div>
      </section>

      {isMonsterSearchOpen && (
        <MonsterSearch onAddMonster={handleAddMonsterFromApi} />
      )}

      <section className="combat-page__initiative">
        <div className="combat-page__initiative-header">
          <div>
            <p className="combat-page__initiative-subtitle">
              Ordem de iniciativa
            </p>
            <h3 className="combat-page__section-title">
              Participantes do combate
            </h3>
          </div>

          <span className="combat-page__counter">
            {sortedParticipants.length} participantes
          </span>
        </div>

        <div className="combat-page__initiative-list">
          {sortedParticipants.length > 0 ? (
            sortedParticipants.map((participant) => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                isActive={activeParticipant?.id === participant.id}
                onDamageParticipant={handleOpenDamageModal}
                onHealParticipant={handleOpenHealModal}
                onDeleteParticipant={handleDeleteParticipant}
                onUpdateParticipant={handleUpdateParticipant}
              />
            ))
          ) : (
            <p className="combat-page__empty">
              Nenhum participante adicionado ainda. Use os botões acima para
              adicionar jogadores ou monstros ao combate.
            </p>
          )}
        </div>
      </section>
      <AddPlayerModal
        isOpen={isAddPlayerModalOpen}
        onClose={handleCloseAddPlayerModal}
        onAddPlayer={handleAddPlayer}
      />
      <HealthModal
        isOpen={healthModal.isOpen}
        mode={healthModal.mode}
        participant={selectedHealthParticipant}
        onClose={handleCloseHealthModal}
        onSubmit={handleSubmitHealthChange}
      />
    </main>
  );
}

export default CombatPage;
