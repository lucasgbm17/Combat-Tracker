import { useState } from "react";
import "./ParticipantCard.css";

function ParticipantCard({
  participant,
  isActive,
  onDamageParticipant,
  onHealParticipant,
  onDeleteParticipant,
  onUpdateParticipant,
}) {
  const healthPercentage = Math.max(
    0,
    Math.min(100, (participant.currentHp / participant.maxHp) * 100),
  );

  //Health Status Porcentagem-----------------------------------------------------------------------------------------------------------
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

  //Editar Cartão-----------------------------------------------------------------------------------------------------------------------
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  function startEditing(field, currentValue) {
    setEditingField(field);
    setEditingValue(String(currentValue));
  }

  function cancelEditing() {
    setEditingField(null);
    setEditingValue("");
  }

  function saveEditing() {
    if (!editingField) {
      return;
    }

    onUpdateParticipant(participant.id, editingField, editingValue);
    setEditingField(null);
    setEditingValue("");
  }

  function handleEditKeyDown(event) {
    if (event.key === "Enter") {
      saveEditing();
    }

    if (event.key === "Escape") {
      cancelEditing();
    }
  }

  function renderEditableField(field, value, className, inputType = "text") {
    if (editingField === field) {
      return (
        <input
          className={`${className} participant-card__inline-input`}
          type={inputType}
          value={editingValue}
          autoFocus
          onChange={(event) => setEditingValue(event.target.value)}
          onBlur={saveEditing}
          onKeyDown={handleEditKeyDown}
        />
      );
    }

    return (
      <button
        className={`${className} participant-card__editable-button`}
        type="button"
        onClick={() => startEditing(field, value)}
        title="Clique para editar"
      >
        {value}
      </button>
    );
  }

  return (
    <article
      className={`participant-card ${
        isActive ? "participant-card_active" : ""
      }`}
    >
      <div className="participant-card__initiative">
        <span className="participant-card__initiative-number">
          {renderEditableField(
            "initiative",
            participant.initiative,
            "participant-card__initiative-value",
            "number",
          )}
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

            <h3 className="participant-card__name">
              {renderEditableField(
                "name",
                participant.name,
                "participant-card__name-value",
              )}
            </h3>
          </div>

          {isActive && (
            <span className="participant-card__turn">Turno atual</span>
          )}
        </div>
      </div>

      <ul className="participant-card__stats">
        <li className="participant-card__stat participant-card__stat_shield">
          <span>
            {renderEditableField(
              "armorClass",
              participant.armorClass,
              "participant-card__stat-value",
              "number",
            )}
          </span>
          CA
        </li>

        <li className="participant-card__stat">
          <span>
            {renderEditableField(
              "speed",
              participant.speed,
              "participant-card__stat-value",
              "number",
            )}
          </span>
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
          <span className="participant-card__hp-values">
            {renderEditableField(
              "currentHp",
              participant.currentHp,
              "participant-card__hp-value",
              "number",
            )}
            <span className="participant-card__hp-divider">/</span>
            {renderEditableField(
              "maxHp",
              participant.maxHp,
              "participant-card__hp-value",
              "number",
            )}
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
