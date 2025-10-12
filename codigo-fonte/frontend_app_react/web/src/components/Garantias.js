import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Produtos.css"; // reutiliza o mesmo estilo da página de produtos
import { FaTrash, FaExclamationTriangle } from "react-icons/fa";

const Garantias = () => {
  const [garantias, setGarantias] = useState([]);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  // ===============================
  // MOCK (dados simulados)
  // ===============================
  const mockGarantias = [
    {
      _id: "1",
      nome_cliente: "João Silva",
      modelo_moto: "Honda CG 160",
      placa_moto: "ABC-1234",
      valor_total: 350.0,
      data_validade: "2025-12-20",
      status: "Ativa",
    },
    {
      _id: "2",
      nome_cliente: "Maria Oliveira",
      modelo_moto: "Yamaha Fazer 250",
      placa_moto: "XYZ-9876",
      valor_total: 420.5,
      data_validade: "2025-08-10",
      status: "Expirada",
    },
    {
      _id: "3",
      nome_cliente: "Carlos Souza",
      modelo_moto: "Honda Bros 160",
      placa_moto: "KLM-4455",
      valor_total: 280.75,
      data_validade: "2026-01-05",
      status: "Ativa",
    },
  ];

  const fetchGarantias = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    setGarantias(mockGarantias);
  };

  useEffect(() => {
    fetchGarantias();
  }, []);

  const removeAcentos = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const garantiasFiltradas = garantias.filter((g) =>
    removeAcentos(g.nome_cliente.toLowerCase()).includes(
      removeAcentos(filtro.toLowerCase())
    )
  );

  const handleDelete = (id) => {
    if (!window.confirm("Deseja realmente excluir esta garantia?")) return;
    setGarantias(garantias.filter((g) => g._id !== id));
  };

  const estaPertoDeVencer = (data_validade) => {
    const hoje = new Date();
    const validade = new Date(data_validade);
    const diffDias = (validade - hoje) / (1000 * 60 * 60 * 24);
    return diffDias <= 15;
  };

  return (
    <div className="home-container">
      <Sidebar />
      <main className="content">
        {/* HEADER com título Garantias */}
        <div className="header">
          <h2>Garantias</h2>
          <div className="header-actions">
            <input
              type="text"
              placeholder="Filtrar garantias..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="filtro-input"
            />
            <button
              className="add-btn"
              onClick={() => navigate("/CadastroGarantias")}
            >
              + Garantia
            </button>
          </div>
        </div>

        {/* LISTAGEM */}
        <div className="produtos-lista">
          {garantiasFiltradas.length > 0 ? (
            garantiasFiltradas.map((g) => (
              <div className="produto-linha" key={g._id}>
                <div className="produto-info">
                  <div className="produto-img-placeholder" />
                  <div className="produto-detalhes">
                    <p className="produto-nome">
                      {g.nome_cliente}
                      {estaPertoDeVencer(g.data_validade) && (
                        <FaExclamationTriangle
                          className="icone-alerta"
                          title="Garantia próxima do vencimento"
                        />
                      )}
                    </p>
                    <p className="produto-desc">
                      {g.modelo_moto} — {g.placa_moto}
                    </p>
                    <p className="produto-estoque">
                      Validade:{" "}
                      {g.data_validade
                        ? new Date(g.data_validade).toLocaleDateString()
                        : "-"}{" "}
                      ({g.status})
                    </p>
                    <p className="produto-estoque">
                      Valor total: R$ {g.valor_total?.toFixed(2)}
                    </p>
                    <div className="produto-acoes">
                      <button
                        className="btn-azul"
                        onClick={() => navigate(`/EditarGarantias/${g._id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-cinza"
                        onClick={() =>
                          navigate(`/DetalhesGarantia/${g._id}`)
                        }
                      >
                        Detalhes
                      </button>
                    </div>
                  </div>
                </div>

                {/* BOTÃO DE LIXO */}
                <button
                  className="delete-button"
                  onClick={() => handleDelete(g._id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))
          ) : (
            <p className="nenhum-produto">Nenhuma garantia encontrada.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Garantias;
