import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import "../styles/DetalhesGarantias.css";
import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../images/logolivro.png";

const DetalhesGarantias = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [garantia, setGarantia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGarantia = async () => {
      try {
        const res = await axios.get(
          `https://geraismotopecas-api.onrender.com/servicos-feitos/${id}`
        );
        setGarantia(res.data);
      } catch (err) {
        console.error(err);
        alert("Erro ao buscar detalhes da garantia");
      } finally {
        setLoading(false);
      }
    };

    fetchGarantia();
  }, [id]);

  const formatarData = (data) =>
    data ? new Date(data).toLocaleDateString("pt-BR") : "-";

  const gerarPDF = async () => {
    const elemento = document.getElementById("detalhes-garantia");
    const canvas = await html2canvas(elemento, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const larguraPagina = pdf.internal.pageSize.getWidth();

    const logoWidth = 30;
    const logoHeight = 20;
    const posLogoX = (larguraPagina - logoWidth) / 2;
    const posLogoY = 5;

    pdf.addImage(logo, "PNG", posLogoX, posLogoY, logoWidth, logoHeight);

    const offsetY = posLogoY + logoHeight + 5;
    const alturaPagina = pdf.internal.pageSize.getHeight();

    const proporcao = Math.min(
      larguraPagina / canvas.width,
      (alturaPagina - offsetY) / canvas.height
    );

    const larguraImg = canvas.width * proporcao;
    const alturaImg = canvas.height * proporcao;
    const posX = (larguraPagina - larguraImg) / 2;

    pdf.addImage(imgData, "PNG", posX, offsetY, larguraImg, alturaImg);
    pdf.save("detalhes_garantia.pdf");
  };

  if (loading) return <div className="carregando">Carregando...</div>;
  if (!garantia) return <div className="erro">Garantia não encontrada</div>;

  const estaPertoDeVencer = () => {
    if (!garantia.data_validade) return false;
    const hoje = new Date();
    const validade = new Date(garantia.data_validade);
    const diffDias = (validade - hoje) / (1000 * 60 * 60 * 24);
    return diffDias <= 15 && diffDias >= 0;
  };

  const statusClass =
    garantia.status === "Ativa"
      ? "status-ativa"
      : garantia.status === "Expirada"
      ? "status-expirada"
      : "status-cancelada";

  return (
    <div className="home-container">
      <Sidebar />

      <main className="content">
        {/* CONTEÚDO QUE VAI PARA O PDF */}
        <div id="detalhes-garantia" className="detalhes-garantia-wrapper">
          <header className="detalhes-garantia-header">
            <div>
              <h1 className="detalhes-garantia-titulo">Detalhes da Garantia</h1>
              <p className="detalhes-garantia-subtitulo">
                Informações completas do cliente, moto, serviço e validade da garantia.
              </p>
            </div>

            {/* VALOR + STATUS */}
            <div className="detalhes-garantia-tag-valor">
              <span className="detalhes-garantia-tag">Valor total</span>

              <span className="detalhes-garantia-valor">
                R$ {garantia.valor_total?.toFixed(2)}
              </span>

              <span className={`detalhes-garantia-status ${statusClass}`}>
                {garantia.status}
              </span>
            </div>
          </header>

          {/* BLOCO CLIENTE */}
          <section className="bloco-garantia">
            <div className="bloco-garantia-header">
              <h3>Cliente</h3>
            </div>
            <div className="bloco-garantia-body">
              <div className="linha-garantia">
                <span className="col-label-garantia">Nome</span>
                <span className="col-valor-garantia">{garantia.nome_cliente}</span>
              </div>

              <div className="linha-garantia">
                <span className="col-label-garantia">Contato</span>
                <span className="col-valor-garantia">{garantia.contato_cliente}</span>
              </div>
            </div>
          </section>

          {/* BLOCO MOTO */}
          <section className="bloco-garantia">
            <div className="bloco-garantia-header">
              <h3>Moto</h3>
            </div>
            <div className="bloco-garantia-body">
              <div className="linha-garantia">
                <span className="col-label-garantia">Modelo</span>
                <span className="col-valor-garantia">
                  {garantia.modelo_moto || "-"}
                </span>
              </div>

              <div className="linha-garantia">
                <span className="col-label-garantia">Placa</span>
                <span className="col-valor-garantia">
                  {garantia.placa_moto || "-"}
                </span>
              </div>

              <div className="linha-garantia">
                <span className="col-label-garantia">Cor</span>
                <span className="col-valor-garantia">
                  {garantia.cor_moto || "-"}
                </span>
              </div>

              <div className="linha-garantia">
                <span className="col-label-garantia">Ano</span>
                <span className="col-valor-garantia">
                  {garantia.ano_moto || "-"}
                </span>
              </div>
            </div>
          </section>

          {/* BLOCO SERVIÇO */}
          <section className="bloco-garantia">
            <div className="bloco-garantia-header">
              <h3>Serviço realizado</h3>
            </div>
            <div className="bloco-garantia-body">
              <div className="linha-garantia">
                <span className="col-label-garantia">Nome</span>
                <span className="col-valor-garantia">
                  {garantia.servico_feito?.nome}
                </span>
              </div>

              <div className="linha-garantia">
                <span className="col-label-garantia">Quantidade</span>
                <span className="col-valor-garantia">
                  {garantia.servico_feito?.quantidade}
                </span>
              </div>

              <div className="linha-garantia">
                <span className="col-label-garantia">Preço unitário</span>
                <span className="col-valor-garantia">
                  R$ {garantia.servico_feito?.precoUnit?.toFixed(2)}
                </span>
              </div>

              <div className="linha-garantia">
                <span className="col-label-garantia">Dias de garantia</span>
                <span className="col-valor-garantia">
                  {garantia.servico_feito?.diasGarantia || 0} dia(s)
                </span>
              </div>
            </div>
          </section>

          {/* BLOCO PEÇAS */}
          <section className="bloco-garantia">
            <div className="bloco-garantia-header">
              <h3>Peças utilizadas</h3>
            </div>

            <div className="bloco-garantia-body bloco-garantia-body-tabela">
              {garantia.pecas_utilizadas?.length > 0 ? (
                <table className="pecas-tabela">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Quantidade</th>
                      <th>Preço unitário (R$)</th>
                      <th>Subtotal (R$)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {garantia.pecas_utilizadas.map((p, i) => (
                      <tr key={i}>
                        <td>{p.nome}</td>
                        <td>{p.quantidade}</td>
                        <td>{p.precoUnit?.toFixed(2)}</td>
                        <td>{(p.quantidade * p.precoUnit).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="texto-sem-pecas">Nenhuma peça utilizada.</p>
              )}
            </div>
          </section>

          {/* BLOCO RESUMO */}
          <section className="bloco-garantia">
            <div className="bloco-garantia-header">
              <h3>Resumo</h3>
            </div>

            <div className="bloco-garantia-body">
              <div className="linha-garantia">
                <span className="col-label-garantia">Data do serviço</span>
                <span className="col-valor-garantia">
                  {formatarData(garantia.data_servico)}
                </span>
              </div>

              <div className="linha-garantia">
                <span className="col-label-garantia">Validade</span>
                <span className="col-valor-garantia">
                  {formatarData(garantia.data_validade)}{" "}
                  {garantia.status === "Expirada" && (
                    <FaExclamationTriangle className="icone-alerta" />
                  )}

                  {estaPertoDeVencer() && garantia.status === "Ativa" && (
                    <FaExclamationTriangle className="icone-alerta" />
                  )}
                </span>
              </div>

              <div className="linha-garantia">
                <span className="col-label-garantia">Status</span>
                <span className={`col-valor-garantia ${statusClass}`}>
                  {garantia.status}
                </span>
              </div>
            </div>
          </section>
        </div>

             
        <div className="botoes-acao-garantia">
          <button className="voltar-btn" onClick={() => navigate("/garantias")}>
            <FaArrowLeft /> Voltar
          </button>

          <button onClick={gerarPDF} className="exportar-btn">
            Exportar PDF
          </button>
        </div>
      </main>
    </div>
  );
};

export default DetalhesGarantias;
