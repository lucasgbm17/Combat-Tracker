import "./ParticipantCard.css";

function ParticipantCard({
  participant,
  isActive,
  onDamageParticipant,
  onHealParticipant,
  onDeleteParticipant,
}) {
  const healthPercentage = Math.max(
    0,
    Math.min(100, (participant.currentHp / participant.maxHp) * 100),
  );

  //Health Status
  function getHealthStatusClass() {
    if (healthPercentage <= 10) {
      return "participant-card__health-fill_critical";
    }

    if (healthPercentage <= 40) {
      return "participant-card__health-fill_heavy";
    }

    if (healthPercentage <= 70) {
      return "participant-card__health-fill_moderate";
    }

    return "participant-card__health-fill_light";
  }

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
        <span className="participant-card__initiative-label">Init</span>
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
        <li className="participant-card__stat participant-card__stat_shield">
          <span>{participant.armorClass}</span>
          CA
        </li>

        <li className="participant-card__stat">
          <span>{participant.speed}</span>
          Speed
        </li>
      </ul>

      <div className="participant-card__actions">
        <button
          className="participant-card__button"
          type="button"
          onClick={() => onDamageParticipant(participant.id)}
        >
          Dano
        </button>

        <button
          className="participant-card__button participant-card__button_heal"
          type="button"
          onClick={() => onHealParticipant(participant.id)}
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
            className={`participant-card__health-fill ${getHealthStatusClass()}`}
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
      </div>
      <button
        className="participant-card__delete-button"
        type="button"
        onClick={() => onDeleteParticipant(participant.id)}
      >
        X
      </button>
    </article>
  );
}

export default ParticipantCard;
