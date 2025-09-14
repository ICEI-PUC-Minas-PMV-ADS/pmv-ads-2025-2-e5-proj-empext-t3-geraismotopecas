import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import logoImage from "../images/logolivro.png";

function Header() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <header className="custom-header">
      <div className="custom-header-left">
        <Link to="/home" className="logo-placeholder">
          <img src={logoImage} alt="Logo CookBook" />
        </Link>
      </div>
      <nav className="custom-header-nav">
        <Link to="/profile" className="nav-link-button">Perfil</Link>
        <Link to="/MinhasReceitas" className="nav-link-button">Suas Receitas</Link>
        <Link to="/sobre" className="nav-link-button">Dúvidas </Link>

        {userId ? (
          <button onClick={handleLogout} className="nav-logout-button">Sair</button>
        ) : (
          <Link to="/" className="nav-link-button">Login</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
