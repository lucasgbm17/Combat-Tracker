import CombatCard from "../CombatCard/CombatCard";
import "./Dashboard.css";

function Dashboard() {
  const combats = [
    {
      id: "1",
      name: "Lobisomens",
      description: "Combate contra lobisomens nas florestas de Baróvia.",
      participants: 7,
      monsters: 4,
      round: 1,
    },
    {
      id: "2",
      name: "Goblins",
      description: "Um encontro rápido durante a viagem do grupo.",
      participants: 5,
      monsters: 3,
      round: 2,
    },
    {
      id: "3",
      name: "Ataque das Aranhas",
      description: "Criaturas sombrias protegendo uma antiga fortaleza.",
      participants: 8,
      monsters: 5,
      round: 3,
    },
  ];

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

        <button className="dashboard__button" type="button">
          Novo combate
        </button>
      </section>

      <section className="dashboard__list">
        {combats.map((combat) => (
          <CombatCard key={combat.id} combat={combat} />
        ))}
      </section>
    </main>
  );
}

export default Dashboard;
