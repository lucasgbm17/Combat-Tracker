import "./PlayerCard.css";

function PlayerCard({ player }) {
  return (
    <article className="player-card">
      <div className="player-card__header">
        <div>
          <p className="player-card__label">Jogador</p>
          <h4 className="player-card__name">{player.name}</h4>
        </div>

        <span className="player-card__initiative">
          Iniciativa {player.initiative}
        </span>
      </div>

      <p className="player-card__class">{player.characterClass}</p>

      <ul className="player-card__stats">
        <li className="player-card__stat">
          <span>{player.armorClass}</span>
          AC
        </li>

        <li className="player-card__stat">
          <span>
            {player.currentHp}/{player.maxHp}
          </span>
          HP
        </li>
      </ul>

      <div className="player-card__actions">
        <button className="player-card__button" type="button">
          Dano
        </button>

        <button
          className="player-card__button player-card__button_heal"
          type="button"
        >
          Cura
        </button>
      </div>
    </article>
  );
}

export default PlayerCard;
