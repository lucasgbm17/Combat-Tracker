import "./About.css";

function About() {
  return (
    <main className="about">
      <section className="about__container">
        <p className="about__subtitle">Sobre o projeto</p>

        <h2 className="about__title">Uma ferramenta para Mestres de RPG</h2>

        <p className="about__text">
          O DnD Combat Tracker é uma aplicação web criada, como projeto final da
          TripleTen, para auxiliar Mestres de RPG no gerenciamento de combates,
          organizando jogadores, monstros, pontos de vida, iniciativa e turnos
          em uma única interface.
        </p>

        <p className="about__text">
          Nesta primeira fase, o projeto está focado na estruturação do
          front-end. Nas próximas etapas, a aplicação será integrada a uma API
          de monstros de D&D e ganhará funcionalidades completas de
          gerenciamento de combate.
        </p>

        <div className="about__cards">
          <article className="about__card">
            <h3 className="about__card-title">Objetivo</h3>
            <p className="about__card-text">
              Facilitar a vida do Mestre durante sessões de RPG. diminuindo a
              sua queda de cabelo.
            </p>
          </article>

          <article className="about__card">
            <h3 className="about__card-title">Tecnologia</h3>
            <p className="about__card-text">
              Projeto desenvolvido com React, Vite, React Router e CSS modular.
            </p>
          </article>

          <article className="about__card">
            <h3 className="about__card-title">Próximas fases</h3>
            <p className="about__card-text">
              Integração com API externa, criação de combates e controle de
              participantes.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default About;
