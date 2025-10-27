import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import logoImage from "../images/logolivro.png";
import Sidebar from './Sidebar';
import garantiaImage from "../images/garantia.png";
import produtoImage from "../images/produtos.png";
import servicoImage from "../images/servicos.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Sidebar />

      {/* Main content */}
      <main className="content">
        <h2>Atalhos</h2>
        <div className="cards">
          <div className="card" onClick={() => navigate("/produtos")}>
            <img src={produtoImage} alt="Produtos" className="card-icon" />
            <button className="card-btn">Produtos</button>
          </div>
          <div className="card" onClick={() => navigate("/garantias")}>
            <img src={garantiaImage} alt="Garantias" className="card-icon" />
            <button className="card-btn">Garantias</button>
          </div>
          <div className="card" onClick={() => navigate("/servicos")}>
            <img src={servicoImage} alt="Serviços" className="card-icon" />
            <button className="card-btn">Serviços</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
