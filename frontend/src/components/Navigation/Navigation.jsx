import { NavLink } from "react-router-dom";
import "./Navigation.css";

function Navigation() {
  return (
    <nav className="navigation">
      <NavLink className="navigation__link" to="/">
        Início
      </NavLink>

      <NavLink className="navigation__link" to="/combat">
        Combate
      </NavLink>

      <NavLink className="navigation__link" to="/about">
        Sobre
      </NavLink>
    </nav>
  );
}

export default Navigation;
