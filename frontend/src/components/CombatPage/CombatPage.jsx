import ParticipantCard from "../Cards/ParticipantCard/ParticipantCard";
import MonsterSearch from "../MonsterSearch/MonsterSearch";
import "./CombatPage.css";

function CombatPage() {
  const participants = [
    {
      id: "p1",
      name: "Sócrates Riverdeep",
      type: "player",
      description: "Firbolg Druida da Lua",
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
      description: "Clérigo de Tyr",
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
      description: "Ladino Soulknife",
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
      description: "Humanoide amaldiçoado pela licantropia",
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
      description: "Lobo gigante de comportamento agressivo",
      armorClass: 14,
      currentHp: 37,
      maxHp: 37,
      initiative: 12,
      speed: 50,
    },
  ];

  const sortedParticipants = [...participants].sort(
    (a, b) => b.initiative - a.initiative,
  );

  const activeParticipant = sortedParticipants[1];

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
          <button className="combat-page__button" type="button">
            Adicionar jogador
          </button>

          <button
            className="combat-page__button combat-page__button_secondary"
            type="button"
          >
            Adicionar monstro
          </button>

          <button
            className="combat-page__button combat-page__button_next"
            type="button"
          >
            Próximo turno
          </button>
        </div>
        <div className="combat-page__status">
          <div className="combat-page__status-card">
            <span className="combat-page__status-number">1</span>
            <span className="combat-page__status-label">Rodada</span>
          </div>

          <div className="combat-page__status-card combat-page__status-card_wide">
            <span className="combat-page__status-number">
              {activeParticipant.name}
            </span>
            <span className="combat-page__status-label">Turno atual</span>
          </div>
        </div>
      </section>

      <MonsterSearch />

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
              isActive={participant.id === activeParticipant.id}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default CombatPage;
