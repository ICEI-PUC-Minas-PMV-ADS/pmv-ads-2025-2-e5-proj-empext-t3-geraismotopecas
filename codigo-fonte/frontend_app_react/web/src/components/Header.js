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
        <Link to="/#" className="logo-placeholder">
          <img src={logoImage} alt="Logo CookBook" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
