import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/DetalhesServicos.css";
import html2pdf from "html2pdf.js";

const DetalhesServicos = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servico, setServico] = useState(null);
  const [pecaUsadaNome, setPecaUsadaNome] = useState("");
  const pdfRef = useRef();

  // Buscar dados do serviço
  useEffect(() => {
    const fetchServico = async () => {
      try {
        const res = await axios.get(
          `https://geraismotopecas-api.onrender.com/servicos/${id}`
        );
        setServico(res.data);

        if (res.data.peca_usada) {
          try {
            const pecaRes = await axios.get(
              `https://geraismotopecas-api.onrender.com/produtos/${res.data.peca_usada}`
            );
            setPecaUsadaNome(pecaRes.data.nome);
          } catch {
            setPecaUsadaNome("Peça não encontrada");
          }
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao buscar detalhes do serviço.");
      }
    };
    fetchServico();
  }, [id]);

  const handleExportPDF = () => {
    const opt = {
      margin: 0.5,
      filename: `${servico.nome_servico}_detalhes.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(pdfRef.current).save();
  };

  if (!servico) return <p>Carregando detalhes...</p>;

  return (
    <div className="home-container">
      <Sidebar />

      <main className="content">
        <div className="detalhes-servico-wrapper" ref={pdfRef}>
          <header className="detalhes-servico-header">
            <div>
              <h1 className="detalhes-servico-titulo">Detalhes do Serviço</h1>
              <p className="detalhes-servico-subtitulo">
                Visão geral do serviço realizado na oficina
              </p>
            </div>

            <div className="detalhes-servico-tag-valor">
              <span className="detalhes-servico-tag">Valor do serviço</span>
              <span className="detalhes-servico-valor">
                R$ {servico.valor?.toFixed(2)}
              </span>
            </div>
          </header>

          <section className="bloco-servico">
            <div className="bloco-servico-header">
              <h3>Informações do serviço</h3>
            </div>

            <div className="bloco-servico-body">
              <div className="linha-servico">
                <span className="col-label-servico">Nome do serviço</span>
                <span className="col-valor-servico">{servico.nome_servico}</span>
              </div>

              <div className="linha-servico">
                <span className="col-label-servico">Descrição</span>
                <span className="col-valor-servico">{servico.desc || "-"}</span>
              </div>

              <div className="linha-servico">
                <span className="col-label-servico">Peça usada</span>
                <span className="col-valor-servico">{pecaUsadaNome || "Nenhuma"}</span>
              </div>
            </div>
          </section>

          <section className="bloco-servico">
            <div className="bloco-servico-header">
              <h3>Garantia & Datas</h3>
            </div>

            <div className="bloco-servico-body">
              <div className="linha-servico">
                <span className="col-label-servico">Dias de garantia</span>
                <span className="col-valor-servico">{servico.garantia_dias} dia(s)</span>
              </div>

              <div className="linha-servico">
                <span className="col-label-servico">Cadastrado em</span>
                <span className="col-valor-servico">
                  {new Date(servico.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="linha-servico">
                <span className="col-label-servico">Última atualização</span>
                <span className="col-valor-servico">
                  {new Date(servico.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="botoes-detalhes-servico">
          <button className="btn-voltar" onClick={() => navigate("/servicos")}>
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

export default DetalhesServicos;
