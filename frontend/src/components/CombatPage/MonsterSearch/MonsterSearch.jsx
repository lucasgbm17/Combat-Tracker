import { useEffect, useState } from "react";
import { getMonsters, getMonsterByIndex } from "../../../utils/dndApi";
import "./MonsterSearch.css";

function MonsterSearch({ onAddMonster }) {
  const [monsters, setMonsters] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setIsLoading(true);

    getMonsters()
      .then((data) => {
        setMonsters(data.results || []);
      })
      .catch(() => {
        setErrorMessage("Não foi possível carregar a lista de monstros.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredMonsters = monsters
    .filter((monster) =>
      monster.name.toLowerCase().includes(searchValue.toLowerCase()),
    )
    .slice(0, 6);

  function handleSearchChange(event) {
    setSearchValue(event.target.value);
    setSelectedMonster(null);
    setErrorMessage("");
  }

  function handleSelectMonster(monsterIndex) {
    setIsDetailsLoading(true);
    setErrorMessage("");

    getMonsterByIndex(monsterIndex)
      .then((data) => {
        setSelectedMonster(data);
        setSearchValue(data.name);
      })
      .catch(() => {
        setErrorMessage("Não foi possível carregar os detalhes do monstro.");
      })
      .finally(() => {
        setIsDetailsLoading(false);
      });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (filteredMonsters.length > 0) {
      handleSelectMonster(filteredMonsters[0].index);
    }
  }

  function handleAddMonster() {
    if (!selectedMonster) {
      return;
    }

    onAddMonster(selectedMonster);
    setSelectedMonster(null);
    setSearchValue("");
  }

  const monsterArmorClass = selectedMonster?.armor_class?.[0]?.value || "—";

  const monsterSpeed =
    selectedMonster?.speed?.walk ||
    selectedMonster?.speed?.fly ||
    selectedMonster?.speed?.swim ||
    "—";

  return (
    <section className="monster-search">
      <div className="monster-search__header">
        <div>
          <p className="monster-search__subtitle">API de criaturas</p>
          <h3 className="monster-search__title">Buscar monstros</h3>
        </div>

        <p className="monster-search__description">
          Consulte monstros em uma API externa de Dungeons & Dragons e adicione
          criaturas diretamente ao combate.
        </p>
      </div>

      <form className="monster-search__form" onSubmit={handleSubmit}>
        <input
          className="monster-search__input"
          type="text"
          placeholder="Digite o nome de um monstro"
          value={searchValue}
          onChange={handleSearchChange}
        />

        <button className="monster-search__button" type="submit">
          Buscar
        </button>
      </form>

      {isLoading && (
        <p className="monster-search__message">Carregando monstros...</p>
      )}

      {errorMessage && (
        <p className="monster-search__message monster-search__message_error">
          {errorMessage}
        </p>
      )}

      {searchValue && !selectedMonster && filteredMonsters.length > 0 && (
        <ul className="monster-search__list">
          {filteredMonsters.map((monster) => (
            <li className="monster-search__list-item" key={monster.index}>
              <button
                className="monster-search__list-button"
                type="button"
                onClick={() => handleSelectMonster(monster.index)}
              >
                {monster.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {searchValue &&
        !selectedMonster &&
        !isLoading &&
        filteredMonsters.length === 0 && (
          <p className="monster-search__message">
            Nenhum monstro encontrado com esse nome.
          </p>
        )}

      {isDetailsLoading && (
        <p className="monster-search__message">
          Carregando detalhes do monstro...
        </p>
      )}

      {selectedMonster && (
        <div className="monster-search__result">
          <p className="monster-search__result-label">Resultado da API</p>

          <div className="monster-search__result-card">
            <div>
              <h4 className="monster-search__monster-name">
                {selectedMonster.name}
              </h4>

              <p className="monster-search__monster-info">
                {selectedMonster.size} {selectedMonster.type} • AC{" "}
                {monsterArmorClass} • HP {selectedMonster.hit_points} • CR{" "}
                {selectedMonster.challenge_rating} • Speed {monsterSpeed}
              </p>
            </div>

            <button
              className="monster-search__add-button"
              type="button"
              onClick={handleAddMonster}
            >
              Adicionar ao combate
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default MonsterSearch;
