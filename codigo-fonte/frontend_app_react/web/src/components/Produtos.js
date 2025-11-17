import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/Produtos.css";
import { FaTrash, FaExclamationTriangle } from "react-icons/fa";
import produtoImage from "../images/produtos.png";


const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [baixoEstoque, setBaixoEstoque] = useState(false);
  const navigate = useNavigate();

  const fetchProdutos = async () => {
    try {
      const res = await axios.get("https://geraismotopecas-api.onrender.com/produtos");
      setProdutos(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar produtos");
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const removeAcentos = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const produtosFiltrados = produtos
    .filter((p) =>
      removeAcentos(p.nome?.toLowerCase() || "").includes(removeAcentos(filtro.toLowerCase()))
    )
    .filter(
      (p) =>
        !baixoEstoque ||
        (p.meta_controle?.qtd_estoque ?? 0) < (p.meta_controle?.qtd_min_fixa ?? 0)
    );

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este produto?")) return;
    try {
      await axios.delete(`https://geraismotopecas-api.onrender.com/produtos/${id}`);
      setProdutos((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Erro ao deletar produto");
    }
  };

  const darBaixa = async (id, quantidade) => {
    try {
      if (!quantidade || quantidade <= 0) {
        alert("Digite uma quantidade válida.");
        return;
      }

      const response = await axios.put(
        `https://geraismotopecas-api.onrender.com/produtos/${id}/baixa`,
        { quantidade }
      );
      alert("Baixa realizada com sucesso!");
      console.log(response.data.produto);
      fetchProdutos(); // 🔁 Atualiza a lista automaticamente após a baixa
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao dar baixa no estoque.");
    }
  };

  return (
    <div className="home-container">
      <Sidebar />
      <main className="content">
        <div className="produtos-lista">
          <h2>Produtos</h2>

          <div className="header-actions">
            <input
              type="text"
              placeholder="Filtrar produtos..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="filtro-input"
            />
            <button className="add-btn" onClick={() => navigate("/produtos/cadastro")}>
              + Produto
            </button>
          </div>

          <label className="checkbox-label">
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={baixoEstoque}
                onChange={() => setBaixoEstoque(!baixoEstoque)}
              />
              <span>Produtos com estoque baixo</span>
            </div>
          </label>

          {produtosFiltrados.length > 0 ? (
            produtosFiltrados.map((produto) => (
              <div className="produto-linha" key={produto._id}>
                <div className="produto-info">
                  <img
                    src={produtoImage}
                    alt="Produto"
                    className="produto-img"
                  />
                  <div className="produto-detalhes">
                    <p className="produto-nome">
                      {produto.nome}
                      {produto.meta_controle?.qtd_estoque <
                        produto.meta_controle?.qtd_min_fixa && (
                        <FaExclamationTriangle
                          className="icone-alerta"
                          title="Estoque abaixo do mínimo"
                        />
                      )}
                    </p>
                    <p className="produto-desc">{produto.desc}</p>
                    <p className="produto-estoque">
                      Estoque: {produto.meta_controle?.qtd_estoque ?? "—"}
                    </p>
                    <div className="produto-acoes">
                      <button
                        className="btn-edit"
                        onClick={() => navigate(`/produtos/editar/${produto._id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-acoes"
                        onClick={() => navigate(`/produtos/${produto._id}`)}
                      >
                        Detalhes
                      </button>
                      <button
                        className="btn-acoes"
                        onClick={() => {
                          const qtd = prompt("Digite a quantidade para dar baixa:");
                          if (qtd) darBaixa(produto._id, parseInt(qtd));
                        }}
                      >
                        Dar baixa
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(produto._id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))
          ) : (
            <p className="nenhum-produto">Nenhum produto encontrado.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Produtos;
