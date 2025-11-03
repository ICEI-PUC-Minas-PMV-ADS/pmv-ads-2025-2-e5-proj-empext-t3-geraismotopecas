import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Garantias.css";
import { FaTrash, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";

const Garantias = () => {
  const [garantias, setGarantias] = useState([]);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();


  const fetchGarantias = async () => {
    try {
      const res = await axios.get("https://geraismotopecas-api.onrender.com/servicos-feitos");
      setGarantias(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar garantias");
    }
  };

  useEffect(() => {
    fetchGarantias();
  }, []);


  const removeAcentos = (str) =>
    str?.normalize?.("NFD").replace(/[\u0300-\u036f]/g, "") ?? "";

  const garantiasFiltradas = garantias.filter((g) =>
    removeAcentos(g.nome_cliente?.toLowerCase() || "").includes(
      removeAcentos(filtro.toLowerCase())
    )
  );


  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta garantia?")) return;

    try {
      await axios.delete(`https://geraismotopecas-api.onrender.com/servicos-feitos/${id}`);
      setGarantias((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar garantia");
    }
  };


  const estaPertoDeVencer = (data_validade) => {
    if (!data_validade) return false;
    const hoje = new Date();
    const validade = new Date(data_validade);
    const diffDias = (validade - hoje) / (1000 * 60 * 60 * 24);
    return diffDias <= 15 && diffDias >= 0;
  };

  return (
    <div className="home-container">
      <Sidebar />
      <main className="content">
        <div className="garantias-lista">
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
              onClick={() => navigate("/garantias/cadastro")}>
              + Garantia
            </button>
          </div>

          {garantiasFiltradas.length > 0 ? (
            garantiasFiltradas.map((g) => (
              <div className="garantia-linha" key={g._id}>
                <div className="garantia-info">
                  <div className="garantia-img-placeholder" />
                  <div className="garantia-detalhes">
                    <p className="garantia-nome">
                      {g.nome_cliente}
                      {g.status === "Expirada" && (
                        <FaExclamationTriangle
                          className="icone-alerta"
                          title="Garantia expirada"
                        />
                      )}
                      {estaPertoDeVencer(g.data_validade) && (
                        <FaExclamationTriangle
                          className="icone-alerta"
                          title="Próximo do vencimento"
                        />
                      )}
                    </p>

                    <p className="garantia-desc">
                      {g.modelo_moto} — {g.placa_moto}
                    </p>

                    <p className="garantia-validade">
                      Validade:{" "}
                      {g.data_validade
                        ? new Date(g.data_validade).toLocaleDateString()
                        : "-"}{" "}
                      ({g.status})
                    </p>

                    <p className="garantia-valor">
                      Valor total: R$ {g.valor_total?.toFixed(2)}
                    </p>

                    <div className="garantia-acoes">
                      <button
                        className="btn-edit"
                        onClick={() => navigate(`/garantias/editar/${g._id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-acoes"
                        onClick={() => navigate(`/DetalhesGarantia/${g._id}`)}
                      >
                        Detalhes
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  className="delete-button"
                  onClick={() => handleDelete(g._id)}
                  title="Excluir garantia"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          ) : (
            <p className="nenhuma-garantia">Nenhuma garantia encontrada.</p>
          )}
        </div>

      </main>
    </div>
  );
};

export default Garantias;
