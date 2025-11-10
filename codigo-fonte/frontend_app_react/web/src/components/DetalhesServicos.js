import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/DetalhesProduto.css"; // Pode reaproveitar o mesmo CSS
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
        const res = await axios.get(`https://geraismotopecas-api.onrender.com/servicos/${id}`);
        setServico(res.data);

        // Buscar nome da peça usada (se houver)
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

  // Função para exportar PDF
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
        <div className="detalhes-container" ref={pdfRef}>
          <h2>Detalhes do Serviço</h2>

          <div className="detalhes-card">
            <p><strong>Nome do Serviço:</strong> {servico.nome_servico}</p>
            <p><strong>Descrição:</strong> {servico.desc}</p>
            <p><strong>Peça usada:</strong> {pecaUsadaNome || "Nenhuma"}</p>
            <p><strong>Dias de garantia:</strong> {servico.garantia_dias}</p>
            <p><strong>Valor:</strong> R$ {servico.valor?.toFixed(2)}</p>
            <p><strong>Cadastrado em:</strong> {new Date(servico.createdAt).toLocaleDateString()}</p>
            <p><strong>Última atualização:</strong> {new Date(servico.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="botoes-acao">
          <button className="btn-voltar" onClick={() => navigate("/servicos")}>Voltar</button>
          <button className="btn-exportar" onClick={handleExportPDF}>Exportar PDF</button>
        </div>
      </main>
    </div>
  );
};

export default DetalhesServicos;
