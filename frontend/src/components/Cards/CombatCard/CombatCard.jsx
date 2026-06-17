import { Link } from "react-router-dom";
import "./CombatCard.css";

function CombatCard({ combat, onDeleteCombat }) {
  return (
    <article className="combat-card">
      <div className="combat-card__content">
        <p className="combat-card__label">Combate ativo</p>

        <h3 className="combat-card__title">{combat.name}</h3>

        <p className="combat-card__description">{combat.description}</p>

        <ul className="combat-card__stats">
          <li className="combat-card__stat">
            <span>{combat.participants}</span>
            Jogadores
          </li>

          <li className="combat-card__stat">
            <span>{combat.monsters}</span>
            Monstros
          </li>

          <li className="combat-card__stat">
            <span>{combat.round}</span>
            Rounds
          </li>
        </ul>
      </div>

      <div className="combat-card__actions">
        <Link className="combat-card__open-button" to={`/combats/${combat.id}`}>
          Abrir combate
        </Link>

        <button
          className="combat-card__delete-button"
          type="button"
          onClick={() => onDeleteCombat(combat.id)}
        >
          Excluir
        </button>
      </div>
    </article>
  );
}

export default CombatCard;
