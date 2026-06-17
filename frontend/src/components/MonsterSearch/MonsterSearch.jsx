import "./MonsterSearch.css";

function MonsterSearch() {
  return (
    <section className="monster-search">
      <div className="monster-search__header">
        <div>
          <p className="monster-search__subtitle">API de criaturas</p>
          <h3 className="monster-search__title">Buscar monstros</h3>
        </div>

        <p className="monster-search__description">
          Esta área será usada para consultar monstros em uma API externa de
          Dungeons & Dragons.
        </p>
      </div>

      <form className="monster-search__form">
        <input
          className="monster-search__input"
          type="text"
          placeholder="Digite o nome de um monstro"
        />

        <button className="monster-search__button" type="button">
          Buscar
        </button>
      </form>

      <div className="monster-search__result">
        <p className="monster-search__result-label">Resultado de exemplo</p>

        <div className="monster-search__result-card">
          <div>
            <h4 className="monster-search__monster-name">Adult Red Dragon</h4>
            <p className="monster-search__monster-info">
              Dragão enorme • AC 19 • HP 256 • CR 17
            </p>
          </div>

          <button className="monster-search__add-button" type="button">
            Adicionar ao combate
          </button>
        </div>
      </div>
    </section>
  );
}

export default MonsterSearch;
