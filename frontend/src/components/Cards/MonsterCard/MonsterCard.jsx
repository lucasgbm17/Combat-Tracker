import "./MonsterCard.css";

function MonsterCard({ monster }) {
  return (
    <article className="monster-card">
      <div className="monster-card__header">
        <div>
          <p className="monster-card__label">{monster.type}</p>
          <h4 className="monster-card__name">{monster.name}</h4>
        </div>

        <span className="monster-card__challenge">
          CR {monster.challengeRating}
        </span>
      </div>

      <ul className="monster-card__stats">
        <li className="monster-card__stat">
          <span>{monster.armorClass}</span>
          AC
        </li>

        <li className="monster-card__stat">
          <span>
            {monster.currentHp}/{monster.maxHp}
          </span>
          HP
        </li>

        <li className="monster-card__stat">
          <span>{monster.initiative}</span>
          Init
        </li>
      </ul>

      <div className="monster-card__actions">
        <button className="monster-card__button" type="button">
          Dano
        </button>

        <button
          className="monster-card__button monster-card__button_remove"
          type="button"
        >
          Remover
        </button>
      </div>
    </article>
  );
}

export default MonsterCard;
