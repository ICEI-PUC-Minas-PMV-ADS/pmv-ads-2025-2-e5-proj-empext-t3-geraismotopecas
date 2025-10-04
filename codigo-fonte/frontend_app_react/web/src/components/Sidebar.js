import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import logoImage from "../images/logolivro.png";

function Sidebar({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove dados do usuário
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');

    navigate('/');
  };

  return (
    <div className="home-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div 
          className="logo" 
          style={{ cursor: "pointer" }} 
          onClick={() => navigate("/home")}
        >
          <img src={logoImage} alt="Logo" />
        </div>
        <nav>
          <ul>
            <li onClick={() => navigate("/produtos")}>Produtos</li>
            <li onClick={() => navigate("/garantias")}>Garantias</li>
            <li onClick={() => navigate("/servicos")}>Serviços</li>
          </ul>
        </nav>
        <div className="sidebar-bottom">
          <ul>
            <li onClick={() => navigate("/profile")}>Perfil</li>
            <li onClick={handleLogout}>Sair</li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <main className="content">{children}</main>
    </div>
  );
}

export default Sidebar;
