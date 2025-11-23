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

  const formatarData = (data) =>
    data ? new Date(data).toLocaleDateString("pt-BR") : "—";

  if (!produto) return <p>Carregando detalhes...</p>;

  return (
    <div className="home-container">
      <Sidebar />

      <main className="content">
        {/* conteúdo que vai pro PDF */}
        <div className="detalhes-produto-wrapper" ref={pdfRef}>
          <header className="detalhes-produto-header">
            <div>
              <h1 className="detalhes-produto-titulo">Detalhes do Produto</h1>
              <p className="detalhes-produto-subtitulo">
                Informações do produto, vínculo com serviço e controle de estoque.
              </p>
            </div>

            <div className="detalhes-produto-tag-valor">
              <span className="detalhes-produto-tag">Valor do produto</span>
              <span className="detalhes-produto-valor">
                {produto.valor ? `R$ ${produto.valor.toFixed(2)}` : "—"}
              </span>
            </div>
          </header>

          <section className="bloco-produto">
            <div className="bloco-produto-header">
              <h3>Informações do produto</h3>
            </div>
            <div className="bloco-produto-body">
              <div className="linha-produto">
                <span className="col-label-produto">Nome</span>
                <span className="col-valor-produto">{produto.nome || "—"}</span>
              </div>

              <div className="linha-produto">
                <span className="col-label-produto">Código</span>
                <span className="col-valor-produto">{produto.codigo || "—"}</span>
              </div>

              <div className="linha-produto">
                <span className="col-label-produto">Descrição</span>
                <span className="col-valor-produto">{produto.desc || "—"}</span>
              </div>

              <div className="linha-produto">
                <span className="col-label-produto">Ligado a serviço</span>
                <span className="col-valor-produto">
                  {produto.contem_servico ? "Sim" : "Não"}
                </span>
              </div>
            </div>
          </section>

          <section className="bloco-produto">
            <div className="bloco-produto-header">
              <h3>Gestão do produto</h3>
            </div>
            <div className="bloco-produto-body">
              <div className="linha-produto">
                <span className="col-label-produto">Início da gestão</span>
                <span className="col-valor-produto">
                  {formatarData(produto.data_inicio_gestao)}
                </span>
              </div>
            </div>
          </section>

          <section className="bloco-produto">
            <div className="bloco-produto-header">
              <h3>Controle de estoque</h3>
            </div>
            <div className="bloco-produto-body">
              <div className="linha-produto">
                <span className="col-label-produto">Quantidade mínima</span>
                <span className="col-valor-produto">
                  {produto.meta_controle?.qtd_min_fixa ?? "—"}
                </span>
              </div>

              <div className="linha-produto">
                <span className="col-label-produto">Quantidade em estoque</span>
                <span className="col-valor-produto">
                  {produto.meta_controle?.qtd_estoque ?? "—"}
                </span>
              </div>

              <div className="linha-produto">
                <span className="col-label-produto">Última compra</span>
                <span className="col-valor-produto">
                  {produto.meta_controle?.data_ultima_compra
                    ? formatarData(produto.meta_controle.data_ultima_compra)
                    : "—"}
                </span>
              </div>
            </div>
          </section>
        </div>

      
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
