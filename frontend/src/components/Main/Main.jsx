import Login from "../Login/Login";
import "./Main.css";

function Main() {
  return (
    <main className="main">
      <section className="main__section">
        <div className="main__content">
          <p className="main__subtitle">A Ferramenta para os Mestres de RPG</p>

          <h2 className="main__title">Organize seus combates</h2>

          <p className="main__description">
            Controle iniciativa, pontos de vida, monstros e jogadores em uma
            única interface criada para facilitar a vida do Mestre durante as
            sessões de RPG.
          </p>

          <ul className="main__features">
            <li className="main__feature">Crie combates personalizados</li>
            <li className="main__feature">Adicione jogadores e monstros</li>
            <li className="main__feature">Controle HP, turnos e iniciativa</li>
            <li className="main__feature">
              Adicione monstros com todas informações
            </li>
          </ul>
        </div>

        <Login />
      </section>
    </main>
  );
}

export default Main;
