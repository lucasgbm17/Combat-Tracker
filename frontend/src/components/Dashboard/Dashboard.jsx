import CombatCard from "../Cards/CombatCard/CombatCard";
import "./Dashboard.css";

function Dashboard({ combats, onCreateCombat, onDeleteCombat }) {
  return (
    <main className="dashboard">
      <section className="dashboard__header">
        <div>
          <p className="dashboard__subtitle">Painel do Mestre</p>
          <h2 className="dashboard__title">Meus combates</h2>
          <p className="dashboard__description">
            Crie, organize e acesse seus encontros de Dungeons & Dragons em um
            único lugar.
          </p>
        </div>

        <button
          className="dashboard__button"
          type="button"
          onClick={onCreateCombat}
        >
          Novo combate
        </button>
      </section>

      {combats.length > 0 ? (
        <section className="dashboard__list">
          {combats.map((combat) => (
            <CombatCard
              key={combat.id}
              combat={combat}
              onDeleteCombat={onDeleteCombat}
            />
          ))}
        </section>
      ) : (
        <p className="dashboard__empty">
          Nenhum combate criado ainda. Clique em “Novo combate” para começar.
        </p>
      )}
    </main>
  );
}

export default Dashboard;
