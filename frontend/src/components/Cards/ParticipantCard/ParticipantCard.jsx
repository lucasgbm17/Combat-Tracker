import "./ParticipantCard.css";

function ParticipantCard({ participant, isActive }) {
  const healthPercentage = Math.max(
    0,
    Math.min(100, (participant.currentHp / participant.maxHp) * 100),
  );

  return (
    <article
      className={`participant-card ${
        isActive ? "participant-card_active" : ""
      }`}
    >
      <div className="participant-card__initiative">
        <span className="participant-card__initiative-number">
          {participant.initiative}
        </span>
        <span className="participant-card__initiative-text">Init</span>
      </div>

      <div className="participant-card__main">
        <div className="participant-card__header">
          <div>
            <p
              className={`participant-card__type participant-card__type_${participant.type}`}
            >
              {participant.type === "monster" ? "Monstro" : "Jogador"}
            </p>

            <h3 className="participant-card__name">{participant.name}</h3>
          </div>

          {isActive && (
            <span className="participant-card__turn">Turno atual</span>
          )}
        </div>
      </div>

      <ul className="participant-card__stats">
        <li className="participant-card__stat">
          <span>{participant.armorClass}</span>
          AC
        </li>

        <li className="participant-card__stat">
          <span>{participant.speed}</span>
          Speed
        </li>
      </ul>

      <div className="participant-card__actions">
        <button className="participant-card__button" type="button">
          Dano
        </button>

        <button
          className="participant-card__button participant-card__button_heal"
          type="button"
        >
          Cura
        </button>
      </div>

      <div className="participant-card__health">
        <div className="participant-card__health-header">
          <span>HP</span>
          <span>
            {participant.currentHp}/{participant.maxHp}
          </span>
        </div>

        <div className="participant-card__health-bar">
          <div
            className="participant-card__health-fill"
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
      </div>
    </article>
  );
}

export default ParticipantCard;
