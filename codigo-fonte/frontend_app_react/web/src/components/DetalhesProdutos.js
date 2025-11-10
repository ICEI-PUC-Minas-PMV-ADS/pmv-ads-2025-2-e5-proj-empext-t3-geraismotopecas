import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/DetalhesProduto.css";
import html2pdf from "html2pdf.js";

const DetalhesProdutos = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const pdfRef = useRef(null);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const res = await axios.get(
          `https://geraismotopecas-api.onrender.com/produtos/${id}`
        );
        setProduto(res.data);
      } catch (err) {
        console.error("Erro ao buscar produto:", err);
        alert("Erro ao buscar detalhes do produto.");
      }
    };

    fetchProduto();
  }, [id]);

  const handleExportPDF = () => {
    if (!pdfRef.current || !produto) return;

    const opt = {
      margin: 0.5,
      filename: `${produto.nome?.replace(/\s+/g, "_") || "produto"}_detalhes.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(pdfRef.current).save();
  };

  if (!produto) return <p>Carregando detalhes...</p>;

  return (
    <div className="home-container">
      <Sidebar />

      <main className="content">
        {/* conteúdo que será exportado */}
        <div className="detalhes-container" ref={pdfRef}>
          <h2>Detalhes do Produto</h2>

          <div className="detalhes-card">
            <p>
              <strong>Nome:</strong> {produto.nome || "—"}
            </p>
            <p>
              <strong>Código:</strong> {produto.codigo || "—"}
            </p>
            <p>
              <strong>Descrição:</strong> {produto.desc || "—"}
            </p>
            <p>
              <strong>Data de início da gestão:</strong>{" "}
              {produto.data_inicio_gestao
                ? new Date(produto.data_inicio_gestao).toLocaleDateString("pt-BR")
                : "—"}
            </p>
            <p>
              <strong>Ligado a serviço:</strong>{" "}
              {produto.contem_servico ? "Sim" : "Não"}
            </p>
            <p>
              <strong>Valor:</strong>{" "}
              {produto.valor ? `R$ ${produto.valor.toFixed(2)}` : "—"}
            </p>

            <h3>Controle de Estoque</h3>
            <p>
              <strong>Quantidade mínima:</strong>{" "}
              {produto.meta_controle?.qtd_min_fixa ?? "—"}
            </p>
            <p>
              <strong>Quantidade em estoque:</strong>{" "}
              {produto.meta_controle?.qtd_estoque ?? "—"}
            </p>
            <p>
              <strong>Data da última compra:</strong>{" "}
              {produto.meta_controle?.data_ultima_compra
                ? new Date(
                    produto.meta_controle.data_ultima_compra
                  ).toLocaleDateString("pt-BR")
                : "—"}
            </p>
          </div>
        </div>

        {/* botões */}
        <div className="botoes-acao">
          <button className="btn-voltar" onClick={() => navigate("/produtos")}>
            Voltar
          </button>
          <button className="btn-exportar" onClick={handleExportPDF}>
            Exportar PDF
          </button>
        </div>
      </main>
    </div>
  );
};

export default DetalhesProdutos;
