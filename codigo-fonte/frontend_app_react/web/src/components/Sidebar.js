import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";
import logoImage from "../images/logolivro.png";

function Sidebar({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const produtosPaths = ["/Produtos", "/CadastroProdutos", "/EditarProdutos"];
  const garantiasPaths = ["/Garantias", "/CadastroGarantias", "/EditarGarantias"];
  const servicosPaths = ["/Servicos", "/CadastroServicos", "/EditarServicos"];
  const perfilPaths = ["/Profile"];

  const handleLogout = () => {
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

        <nav className="menu-buttons">
          <button
            onClick={() => navigate("/Produtos")}
            className={produtosPaths.includes(currentPath) ? "active" : ""}
          >
            Produtos
          </button>

          <button
            onClick={() => navigate("/Garantias")}
            className={garantiasPaths.includes(currentPath) ? "active" : ""}
          >
            Garantias
          </button>

          <button
            onClick={() => navigate("/Servicos")}
            className={servicosPaths.includes(currentPath) ? "active" : ""}
          >
            Serviços
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button
            onClick={() => navigate("/Profile")}
            className={perfilPaths.includes(currentPath) ? "active" : ""}
          >
            Perfil
          </button>

          <button onClick={handleLogout}>Sair</button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="content">{children}</main>
    </div>
  );
}

export default Sidebar;
