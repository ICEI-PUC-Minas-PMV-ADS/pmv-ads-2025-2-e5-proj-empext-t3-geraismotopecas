import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/cadastro.css";

const CadastroGarantias = () => {
  const [nomeCliente, setNomeCliente] = useState("");
  const [contatoCliente, setContatoCliente] = useState("");
  const [modeloMoto, setModeloMoto] = useState("");
  const [placaMoto, setPlacaMoto] = useState("");
  const [corMoto, setCorMoto] = useState("");
  const [anoMoto, setAnoMoto] = useState("");

  const [pecasEstoque, setPecasEstoque] = useState([]);
  const [servicos, setServicos] = useState([]);

  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [servicoQuantidade, setServicoQuantidade] = useState(1);
  const [servicoPreco, setServicoPreco] = useState(0); // editável

  const [pecas, setPecas] = useState([{ nome: "", quantidade: 1, precoUnit: 0 }]);
  const [valorTotal, setValorTotal] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const buscarPecas = async () => {
      try {
        const res = await axios.get("https://geraismotopecas-api.onrender.com/produtos");
        setPecasEstoque(res.data || []);
      } catch (err) {
        console.error("Erro ao carregar peças:", err);
      }
    };

    const buscarServicos = async () => {
      try {
        const res = await axios.get("https://geraismotopecas-api.onrender.com/servicos");
        setServicos(res.data || []);
      } catch (err) {
        console.error("Erro ao carregar serviços:", err);
      }
    };

    buscarPecas();
    buscarServicos();
  }, []);

  // recalcula total sempre com números
  useEffect(() => {
    const valorServ = (Number(servicoPreco) || 0) * (Number(servicoQuantidade) || 0);

    const valorPecas = pecas.reduce((total, p) => {
      const qtd = Number(p.quantidade) || 0;
      const val = Number(p.precoUnit) || 0;
      return total + qtd * val;
    }, 0);

    setValorTotal(valorServ + valorPecas);
  }, [servicoPreco, servicoQuantidade, pecas]);

  const handleServicoChange = (nome) => {
    if (!nome) {
      setServicoSelecionado(null);
      setServicoPreco(0);
      return;
    }

    const serv = servicos.find((s) => s.nome_servico === nome) || null;
    setServicoSelecionado(serv);

    // preenche o price (editável)
    setServicoPreco(Number(serv?.valor || 0));
  };

  const handlePecaChange = (index, field, value) => {
    const novas = [...pecas];
    novas[index][field] = field === "nome" ? value : Number(value) || 0;
    setPecas(novas);
  };

  const handlePecaSelect = (index, nomeSelecionado) => {
    const produto = pecasEstoque.find((p) => p.nome === nomeSelecionado);
    handlePecaChange(index, "nome", nomeSelecionado);
    if (produto) handlePecaChange(index, "precoUnit", produto.valor);
  };

  const addPeca = () => setPecas([...pecas, { nome: "", quantidade: 1, precoUnit: 0 }]);
  const removePeca = (index) => setPecas(pecas.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // construir objeto sem enviar servico_feito como null
    const servicoObj = servicoSelecionado
      ? {
          nome: servicoSelecionado.nome_servico || "",
          quantidade: Number(servicoQuantidade) || 1,
          precoUnit: Number(servicoPreco) || 0,
          diasGarantia: Number(servicoSelecionado?.garantia_dias) || 0,
        }
      : undefined; // omitiremos o campo se undefined

    const pecasEnviadas = pecas
      .filter((p) => p.nome && p.nome.trim() !== "")
      .map((p) => ({
        nome: p.nome,
        quantidade: Number(p.quantidade) || 1,
        precoUnit: Number(p.precoUnit) || 0,
      }));

    const dados = {
      nome_cliente: nomeCliente,
      contato_cliente: contatoCliente,
      modelo_moto: modeloMoto || undefined,
      placa_moto: placaMoto || undefined,
      cor_moto: corMoto || undefined,
      ano_moto: anoMoto ? Number(anoMoto) : undefined,
      // somente incluir servico_feito se houver serviço selecionado
      ...(servicoObj ? { servico_feito: servicoObj } : {}),
      // sempre enviar pecas_utilizadas (array vazio se não houver)
      pecas_utilizadas: pecasEnviadas,
    };

    try {
      const res = await axios.post("https://geraismotopecas-api.onrender.com/servicos-feitos", dados);
      alert("Garantia cadastrada com sucesso!");
      navigate("/Garantias");
    } catch (err) {
      // mostrar resposta detalhada para debugging
      console.error("Erro ao cadastrar garantia:", err);
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Resposta da API:", err.response.data);
        alert("Erro ao cadastrar garantia: " + (err.response.data?.message || JSON.stringify(err.response.data)));
      } else {
        alert("Erro ao cadastrar garantia. Veja o console para mais detalhes.");
      }
    }
  };

  return (
    <div className="home-container">
      <Sidebar />
      <main className="content">
        <div className="cadastro-container">
          <form className="cadastro-card" onSubmit={handleSubmit}>
            <h2>Cadastrar garantia</h2>

            <label>Nome do cliente:</label>
            <input type="text" value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} required />

            <label>Contato:</label>
            <input type="text" value={contatoCliente} onChange={(e) => setContatoCliente(e.target.value)} required />

            <label>Modelo da moto:</label>
            <input type="text" value={modeloMoto} onChange={(e) => setModeloMoto(e.target.value)} />

            <label>Placa:</label>
            <input type="text" value={placaMoto} onChange={(e) => setPlacaMoto(e.target.value)} />

            <label>Cor:</label>
            <input type="text" value={corMoto} onChange={(e) => setCorMoto(e.target.value)} />

            <label>Ano:</label>
            <input type="number" value={anoMoto} onChange={(e) => setAnoMoto(e.target.value)} />

            <h3>Serviço realizado</h3>
            <select
              className="peca-select-input"
              value={servicoSelecionado?.nome_servico || ""}
              onChange={(e) => handleServicoChange(e.target.value)}
            >
              <option value="">Nenhum serviço</option>
              {servicos.map((serv) => (
                <option key={serv._id} value={serv.nome_servico}>
                  {serv.nome_servico}
                </option>
              ))}
            </select>

            {servicoSelecionado && (
              <>
                <label>Quantidade:</label>
                <input
                  type="number"
                  min="1"
                  value={servicoQuantidade}
                  onChange={(e) => setServicoQuantidade(Number(e.target.value) || 1)}
                />

                <label>Preço unitário do serviço (editável):</label>
                <input
                  type="number"
                  value={servicoPreco}
                  step="0.01"
                  onChange={(e) => setServicoPreco(Number(e.target.value) || 0)}
                />

                <label>Dias de garantia:</label>
                <input type="number" readOnly value={Number(servicoSelecionado?.garantia_dias) || ""} />
              </>
            )}

            <h3>Peças utilizadas</h3>
            <div className="pecas-container">
              {pecas.map((p, i) => (
                <div key={i} className="peca-item">
                  <div className="inputs-peca">
                    <select
                      className="peca-select-input"
                      value={p.nome}
                      onChange={(e) => handlePecaSelect(i, e.target.value)}
                    >
                      <option value="">Selecione a Peça</option>
                      {pecasEstoque.map((produto) => (
                        <option key={produto._id} value={produto.nome}>
                          {produto.nome}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Quantidade"
                      value={p.quantidade}
                      min="1"
                      onChange={(e) => handlePecaChange(i, "quantidade", Number(e.target.value) || 0)}
                    />

                    <input
                      type="number"
                      placeholder="Preço unitário"
                      value={p.precoUnit}
                      step="0.01"
                      onChange={(e) => handlePecaChange(i, "precoUnit", Number(e.target.value) || 0)}
                    />

                    <button type="button" onClick={() => removePeca(i)} className="btn-remove-peca">
                      X
                    </button>
                  </div>
                </div>
              ))}

              <button type="button" className="btn-add-peca" onClick={addPeca}>
                Adicionar peça
              </button>
            </div>

            <div className="valor-total">
              <strong>Valor total:</strong> R$ {valorTotal.toFixed(2)}
            </div>

            <div className="form-buttons">
              <button type="submit" className="register-btn">
                Cadastrar
              </button>
              <button type="button" className="cancel-btn" onClick={() => navigate("/Garantias")}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CadastroGarantias;
