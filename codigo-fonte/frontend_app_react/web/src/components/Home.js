import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import logoImage from "../images/logolivro.png";
import garantiaImage from "../images/garantia.png";
import produtoImage from "../images/produtos.png";
import servicoImage from "../images/servicos.png";

function Home() {
  const navigate = useNavigate(); // hook para navegar entre páginas

  return (
    <div className="home-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logoImage} alt="Logo" />
        </div>
        <nav>
          <ul>
            <li onClick={() => navigate("/Produtos")}>Produtos</li>
            <li onClick={() => navigate("/garantias")}>Garantias</li>
            <li onClick={() => navigate("/Servicos")}>Serviços</li>
          </ul>
        </nav>
        <div className="sidebar-bottom">
          <ul>
            <li onClick={() => navigate("/Profile")}>Perfil</li>
            <li onClick={() => navigate("/sair")}>Sair</li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <main className="content">
        <h2>Atalhos</h2>
        <div className="cards">
          <div className="card" onClick={() => navigate("/Produtos")}>
            <img src={produtoImage} alt="Produtos" className="card-icon" />
            <button className="card-btn">Produtos</button>
          </div>
          <div className="card" onClick={() => navigate("/garantias")}>
            <img src={garantiaImage} alt="Garantias" className="card-icon" />
            <button className="card-btn">Garantias</button>
          </div>
          <div className="card" onClick={() => navigate("/Servicos")}>
            <img src={servicoImage} alt="Serviços" className="card-icon" />
            <button className="card-btn">Serviços</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
