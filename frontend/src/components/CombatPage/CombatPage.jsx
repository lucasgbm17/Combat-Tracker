import { useEffect, useState } from "react";
import ParticipantCard from "../Cards/ParticipantCard/ParticipantCard";
import AddPlayerModal from "../Modals/AddPlayerModal/AddPlayerModal";
import HealthModal from "../Modals/HealthModal/HealthModal";
import MonsterSearch from "./MonsterSearch/MonsterSearch";
import ConfirmResetModal from "../Modals/ConfirmResetModal/ConfirmResetModal";
import "./CombatPage.css";

const COMBAT_STORAGE_KEY = "combat-tracker-current-combat";

function getInitialCombatData() {
  const savedCombatData = localStorage.getItem(COMBAT_STORAGE_KEY);

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

function CombatPage({ combats }) {
  //Carrregar Combates---------------------------------------------------------------------------------------------------------
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
  const [initiativeMessage, setInitiativeMessage] = useState("");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  //Temporizador da Iniciativa--------------------------------------------------------------

  useEffect(() => {
    if (!initiativeMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setInitiativeMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [initiativeMessage]);

  //----------------------------------------------------------------------------------------

  useEffect(() => {
    const combatData = {
      participants,
      round,
      currentTurnIndex,
    };

    localStorage.setItem(COMBAT_STORAGE_KEY, JSON.stringify(combatData));
  }, [participants, round, currentTurnIndex]);

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
  ///Monstro CA
  function getMonsterArmorClass(monster) {
    return monster.armor_class?.[0]?.value || 10;
  }
  ///Monstro Speed
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

  ///Rolando iniciativa do monstro
  function rollD20() {
    return Math.floor(Math.random() * 20) + 1;
  }

  function getAbilityModifier(abilityScore) {
    return Math.floor((abilityScore - 10) / 2);
  }

  function rollMonsterInitiative(monster) {
    const initiativeRoll = rollD20();
    const dexterityModifier = getAbilityModifier(monster.dexterity || 10);

    return {
      initiative: initiativeRoll + dexterityModifier,
      initiativeRoll,
      initiativeBonus: dexterityModifier,
    };
  }

  ///Pegando monstro da API
  function handleAddMonsterFromApi(monster) {
    const activeParticipantId = activeParticipant?.id;

    const monsterInitiative = rollMonsterInitiative(monster);

    const newMonster = {
      id: `m-${monster.index}-${Date.now()}`,
      name: monster.name,
      type: "monster",
      armorClass: getMonsterArmorClass(monster),
      currentHp: monster.hit_points || 1,
      maxHp: monster.hit_points || 1,
      initiative: monsterInitiative.initiative,
      initiativeRoll: monsterInitiative.initiativeRoll,
      initiativeBonus: monsterInitiative.initiativeBonus,
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

    const initiativeBonusText =
      monsterInitiative.initiativeBonus >= 0
        ? `+${monsterInitiative.initiativeBonus}`
        : monsterInitiative.initiativeBonus;

    setInitiativeMessage(
      `${monster.name} rolou iniciativa: ${monsterInitiative.initiativeRoll} ${initiativeBonusText} = ${monsterInitiative.initiative}`,
    );

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

  //Reiniciar Combate-------------------------------------------------------------------------------------------
  function handleOpenResetModal() {
    setIsResetModalOpen(true);
  }

  function handleCloseResetModal() {
    setIsResetModalOpen(false);
  }

  function handleConfirmResetCombat() {
    setParticipants([]);
    setRound(1);
    setCurrentTurnIndex(0);
    setInitiativeMessage("");
    setIsMonsterSearchOpen(false);
    setIsResetModalOpen(false);

    localStorage.removeItem(COMBAT_STORAGE_KEY);
  }

  return (
    <main className="combat-page">
      <section className="combat-page__hero">
        <div className="combat-page__heading">
          <p className="combat-page__subtitle">Controle de combate</p>

          <h2 className="combat-page__title">Mesa de Combate</h2>

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
        {initiativeMessage && (
          <p className="combat-page__initiative-message">{initiativeMessage}</p>
        )}
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

          <div className="combat-page__initiative-header-actions">
            <span className="combat-page__counter">
              {sortedParticipants.length} participantes
            </span>
            <button
              className="combat-page__reset-button"
              type="button"
              onClick={handleOpenResetModal}
            >
              Reiniciar combate
            </button>
          </div>
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
      <ConfirmResetModal
        isOpen={isResetModalOpen}
        onClose={handleCloseResetModal}
        onConfirm={handleConfirmResetCombat}
      />
    </main>
  );
}

export default CombatPage;
