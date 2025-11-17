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
  console.log("ID recebido:", id);
  const navigate = useNavigate();
  const [garantia, setGarantia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGarantia = async () => {
      try {
        const res = await axios.get(`https://geraismotopecas-api.onrender.com/servicos-feitos/${id}`);
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

  // ---- ADICIONAR LOGO AQUI ----
  const logoWidth = 30; // ajuste se quiser maior/menor
  const logoHeight = 20;
  const posLogoX = (larguraPagina - logoWidth) / 2;
  const posLogoY = 5;

  pdf.addImage(logo, "PNG", posLogoX, posLogoY, logoWidth, logoHeight);

  // Espaço do logo
  const offsetY = posLogoY + logoHeight + 5;

  const alturaPagina = pdf.internal.pageSize.getHeight();
  const proporcao = Math.min(
    larguraPagina / canvas.width,
    (alturaPagina - offsetY) / canvas.height
  );

  const larguraImg = canvas.width * proporcao;
  const alturaImg = canvas.height * proporcao;

  const posX = (larguraPagina - larguraImg) / 2;
  const posY = offsetY;

  pdf.addImage(imgData, "PNG", posX, posY, larguraImg, alturaImg);
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

  return (
    <div className="home-container">
      <Sidebar />
      <main className="content detalhes-container">
        <div style={{ display: "flex", gap: "10px", alignSelf: "flex-start" }}>
        <button className="voltar-btn" onClick={() => navigate("/garantias")}>
            <FaArrowLeft /> Voltar
        </button>

        <button onClick={gerarPDF} className="exportar-btn">
            Exportar em PDF
        </button>
        </div>


        {/* Conteúdo a ser exportado */}
        <div id="detalhes-garantia">
          <h2>Detalhes da Garantia</h2>

          <section className="detalhes-card">
            <h3>Cliente</h3>
            <p><strong>Nome:</strong> {garantia.nome_cliente}</p>
            <p><strong>Contato:</strong> {garantia.contato_cliente}</p>

            <h3>Moto</h3>
            <p><strong>Modelo:</strong> {garantia.modelo_moto || "-"}</p>
            <p><strong>Placa:</strong> {garantia.placa_moto || "-"}</p>
            <p><strong>Cor:</strong> {garantia.cor_moto || "-"}</p>
            <p><strong>Ano:</strong> {garantia.ano_moto || "-"}</p>

            <h3>Serviço Realizado</h3>
            <p><strong>Nome:</strong> {garantia.servico_feito?.nome}</p>
            <p><strong>Quantidade:</strong> {garantia.servico_feito?.quantidade}</p>
            <p><strong>Preço Unitário:</strong> R$ {garantia.servico_feito?.precoUnit?.toFixed(2)}</p>
            <p><strong>Dias de Garantia:</strong> {garantia.servico_feito?.diasGarantia || 0}</p>

            <h3>Peças Utilizadas</h3>
            {garantia.pecas_utilizadas?.length > 0 ? (
              <table className="pecas-tabela">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Quantidade</th>
                    <th>Preço Unitário (R$)</th>
                    <th>Subtotal (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {garantia.pecas_utilizadas.map((p, index) => (
                    <tr key={index}>
                      <td>{p.nome}</td>
                      <td>{p.quantidade}</td>
                      <td>{p.precoUnit?.toFixed(2)}</td>
                      <td>{(p.quantidade * p.precoUnit).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nenhuma peça utilizada.</p>
            )}

            <h3>Resumo</h3>
            <p><strong>Data do serviço:</strong> {formatarData(garantia.data_servico)}</p>
            <p>
              <strong>Validade:</strong>{" "}
              {formatarData(garantia.data_validade)}{" "}
              {garantia.status === "Expirada" && (
                <FaExclamationTriangle className="icone-alerta" title="Garantia expirada" />
              )}
              {estaPertoDeVencer() && garantia.status === "Ativa" && (
                <FaExclamationTriangle className="icone-alerta" title="Próxima do vencimento" />
              )}
            </p>
            <p><strong>Status:</strong> {garantia.status}</p>
            <p><strong>Valor Total:</strong> R$ {garantia.valor_total?.toFixed(2)}</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DetalhesGarantias;
