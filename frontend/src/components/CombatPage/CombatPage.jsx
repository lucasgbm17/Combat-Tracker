import { useState } from "react";
import ParticipantCard from "../Cards/ParticipantCard/ParticipantCard";
import MonsterSearch from "../MonsterSearch/MonsterSearch";
import "./CombatPage.css";

//Temporário
const initialParticipants = [
  {
    id: "p1",
    name: "Sócrates Riverdeep",
    type: "player",
    armorClass: 16,
    currentHp: 72,
    maxHp: 72,
    initiative: 18,
    speed: 30,
  },
  {
    id: "p2",
    name: "Capa Barsavi",
    type: "player",
    armorClass: 18,
    currentHp: 64,
    maxHp: 64,
    initiative: 15,
    speed: 30,
  },
  {
    id: "p3",
    name: "Skidbladnir",
    type: "player",
    armorClass: 17,
    currentHp: 58,
    maxHp: 58,
    initiative: 21,
    speed: 30,
  },
  {
    id: "m1",
    name: "Werewolf",
    type: "monster",
    armorClass: 12,
    currentHp: 58,
    maxHp: 58,
    initiative: 14,
    speed: 30,
  },
  {
    id: "m2",
    name: "Dire Wolf",
    type: "monster",
    armorClass: 14,
    currentHp: 37,
    maxHp: 37,
    initiative: 12,
    speed: 50,
  },
];

function CombatPage() {
  const [participants, setParticipants] = useState(initialParticipants);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [isMonsterSearchOpen, setIsMonsterSearchOpen] = useState(false);

  const sortedParticipants = [...participants].sort(
    (a, b) => b.initiative - a.initiative,
  );

  const activeParticipant = sortedParticipants[currentTurnIndex];

  //Abrir/Fechar Monster Search------------------------------------------------------------------------------------------------
  function handleToggleMonsterSearch() {
    setIsMonsterSearchOpen((currentValue) => !currentValue);
  }

  //Monstro--------------------------------------------------------------------------------------------------------------------
  function getMonsterArmorClass(monster) {
    return monster.armor_class?.[0]?.value || 10;
  }

  function getMonsterSpeed(monster) {
    const rawSpeed =
      monster.speed?.walk ||
      monster.speed?.fly ||
      monster.speed?.swim ||
      "30 ft.";

    const parsedSpeed = Number.parseInt(rawSpeed, 10);

    if (Number.isNaN(parsedSpeed)) {
      return 30;
    }

    return parsedSpeed;
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
  function handleDamageParticipant(participantId) {
    const damageValue = window.prompt("Digite o valor do dano:");

    if (!damageValue) {
      return;
    }

    const parsedDamage = Number(damageValue);

    if (Number.isNaN(parsedDamage) || parsedDamage <= 0) {
      return;
    }

    setParticipants((currentParticipants) =>
      currentParticipants.map((participant) => {
        if (participant.id !== participantId) {
          return participant;
        }

        return {
          ...participant,
          currentHp: Math.max(0, participant.currentHp - parsedDamage),
        };
      }),
    );
  }

  //Adicionar Cura------------------------------------------------------------------------------------------------------
  function handleHealParticipant(participantId) {
    const healValue = window.prompt("Digite o valor da cura:");

    if (!healValue) {
      return;
    }

    const parsedHeal = Number(healValue);

    if (Number.isNaN(parsedHeal) || parsedHeal <= 0) {
      return;
    }

    setParticipants((currentParticipants) =>
      currentParticipants.map((participant) => {
        if (participant.id !== participantId) {
          return participant;
        }

        return {
          ...participant,
          currentHp: Math.min(
            participant.maxHp,
            participant.currentHp + parsedHeal,
          ),
        };
      }),
    );
  }

  //Adicionar jogador-------------------------------------------------------------------------------------------
  function handleAddPlayer() {
    const name = window.prompt("Nome do jogador:");

    if (!name || name.trim() === "") {
      return;
    }

    const armorClass = Number(window.prompt("Classe de Armadura do jogador:"));
    const maxHp = Number(window.prompt("HP máximo do jogador:"));
    const initiative = Number(window.prompt("Iniciativa do jogador:"));
    const speed = Number(window.prompt("Deslocamento do jogador:"));

    if (
      Number.isNaN(armorClass) ||
      Number.isNaN(maxHp) ||
      Number.isNaN(initiative) ||
      Number.isNaN(speed) ||
      armorClass <= 0 ||
      maxHp <= 0 ||
      speed <= 0
    ) {
      window.alert("Preencha os dados numéricos corretamente.");
      return;
    }

    const newPlayer = {
      id: `p-${Date.now()}`,
      name: name.trim(),
      type: "player",
      armorClass,
      currentHp: maxHp,
      maxHp,
      initiative,
      speed,
    };

    setParticipants((currentParticipants) => [
      ...currentParticipants,
      newPlayer,
    ]);
  }

  return (
    <main className="combat-page">
      <section className="combat-page__hero">
        <div className="combat-page__heading">
          <p className="combat-page__subtitle">Controle de combate</p>

          <h2 className="combat-page__title">Covil dos Lobisomens</h2>

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
            onClick={handleAddPlayer}
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
          {sortedParticipants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              isActive={activeParticipant?.id === participant.id}
              onDamageParticipant={handleDamageParticipant}
              onHealParticipant={handleHealParticipant}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default CombatPage;
