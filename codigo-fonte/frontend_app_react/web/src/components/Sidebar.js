import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";
import logoImage from "../images/logolivro.png";

function Sidebar({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

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

  const isActive = (basePath) => currentPath.startsWith(basePath.toLowerCase());

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
            onClick={() => navigate("/produtos")}
            className={isActive("/produtos") ? "active" : ""}
          >
            Produtos
          </button>

          <button
            onClick={() => navigate("/garantias")}
            className={isActive("/garantias") ? "active" : ""}
          >
            Garantias
          </button>

          <button
            onClick={() => navigate("/servicos")}
            className={isActive("/servicos") ? "active" : ""}
          >
            Serviços
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button
            onClick={() => navigate("/profile")}
            className={isActive("/profile") ? "active" : ""}
          >
            Perfil
          </button>

          <button onClick={handleLogout}>Sair</button>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}

export default Sidebar;
