import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  return (
    <form className="login">
      <h3 className="login__title">Acesse sua mesa</h3>

      <label className="login__label">
        E-mail
        <input
          className="login__input"
          type="email"
          placeholder="seuemail@email.com"
        />
      </label>

      <label className="login__label">
        Senha
        <input
          className="login__input"
          type="password"
          placeholder="Digite sua senha"
        />
      </label>

      <Link className="login__button" to="/dashboard">
        Entrar
      </Link>

      <p className="login__text">
        Ainda não tem conta?{" "}
        <button className="login__register-button" type="button">
          Criar conta
        </button>
      </p>
    </form>
  );
}

export default Login;
