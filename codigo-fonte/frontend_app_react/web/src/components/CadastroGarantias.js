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
  const [servicoNome, setServicoNome] = useState("");
  const [servicoQuantidade, setServicoQuantidade] = useState(1);
  const [servicoPreco, setServicoPreco] = useState("");
  const [diasGarantia, setDiasGarantia] = useState("");

  const [pecasEstoque, setPecasEstoque] = useState([]);

  const [pecas, setPecas] = useState([
    { nome: "", quantidade: 1, precoUnit: 0 },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const buscarPecas = async () => {
      try {
        // Rota que deve retornar todos os itens do seu Produto.js
        const res = await axios.get("http://localhost:3000/produtos");
        setPecasEstoque(res.data);
      } catch (err) {
        console.error("Erro ao carregar peças do estoque:", err);
      }
    };

    buscarPecas();
  }, []);

  // Atualiza os campos das peças
  const handlePecaChange = (index, field, value) => {
    const novasPecas = [...pecas];
    novasPecas[index][field] = field === "nome" ? value : Number(value) || 0;
    setPecas(novasPecas);
  };

  const handlePecaSelect = (index, nomeSelecionado) => {
    const produtoSelecionado = pecasEstoque.find(
      (item) => item.nome === nomeSelecionado
    );

    handlePecaChange(index, "nome", nomeSelecionado);

    if (produtoSelecionado) {
      handlePecaChange(index, "precoUnit", produtoSelecionado.valor);
    }
  };
  const addPeca = () =>
    setPecas([...pecas, { nome: "", quantidade: 1, precoUnit: 0 }]);
  const removePeca = (index) => setPecas(pecas.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dados = {
      nome_cliente: nomeCliente,
      contato_cliente: contatoCliente,
      modelo_moto: modeloMoto || undefined,
      placa_moto: placaMoto || undefined,
      cor_moto: corMoto || undefined,
      ano_moto: anoMoto ? Number(anoMoto) : undefined,
      servico_feito: {
        nome: servicoNome,
        quantidade: servicoQuantidade ? Number(servicoQuantidade) : 1,
        precoUnit: servicoPreco ? Number(servicoPreco) : undefined,
        diasGarantia: diasGarantia ? Number(diasGarantia) : undefined,
      },
      pecas_utilizadas: pecas.map((p) => ({
        nome: p.nome,
        quantidade: p.quantidade ? Number(p.quantidade) : 1,
        precoUnit: p.precoUnit ? Number(p.precoUnit) : 0,
      })),
    };

    try {
      await axios.post("http://localhost:3000/servicos-feitos", dados);
      alert("Garantia cadastrada com sucesso!");
      navigate("/Garantias");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Erro ao cadastrar garantia: " + err.response?.data?.message);
    }
  };

  return (
    <div className="home-container">
      <Sidebar />
      <main className="content">
        <div className="cadastro-container">
          <form className="cadastro-card" onSubmit={handleSubmit}>
            <h2>Cadastrar garantia</h2>

            <label>Nome do cliente</label>
            <input
              type="text"
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
              required
            />

            <label>Contato do cliente</label>
            <input
              type="text"
              value={contatoCliente}
              onChange={(e) => setContatoCliente(e.target.value)}
              required
            />

            <label>Modelo da moto</label>
            <input
              type="text"
              value={modeloMoto}
              onChange={(e) => setModeloMoto(e.target.value)}
            />

            <label>Placa da moto</label>
            <input
              type="text"
              value={placaMoto}
              onChange={(e) => setPlacaMoto(e.target.value)}
            />

            <label>Cor da moto</label>
            <input
              type="text"
              value={corMoto}
              onChange={(e) => setCorMoto(e.target.value)}
            />

            <label>Ano da moto</label>
            <input
              type="number"
              value={anoMoto}
              onChange={(e) => setAnoMoto(e.target.value)}
            />

            <h3>Serviço realizado</h3>
            <label>Nome</label>
            <input
              type="text"
              value={servicoNome}
              onChange={(e) => setServicoNome(e.target.value)}
              required
            />

            <label>Quantidade</label>
            <input
              type="number"
              value={servicoQuantidade}
              min="1"
              onChange={(e) => setServicoQuantidade(e.target.value)}
            />

            <label>Preço unitário</label>
            <input
              type="number"
              value={servicoPreco}
              step="0.01"
              onChange={(e) => setServicoPreco(e.target.value)}
            />

            <label>Dias de garantia</label>
            <input
              type="number"
              value={diasGarantia}
              min="0"
              onChange={(e) => setDiasGarantia(e.target.value)}
            />

            <h3>Peças utilizadas</h3>
            <div className="pecas-container">
              {pecas.map((p, i) => (
                <div key={i} className="peca-item">
                  <div className="inputs-peca">
                    <select
                      className="peca-select-input"
                      placeholder="Nome"
                      value={p.nome}
                      onChange={(e) => handlePecaSelect(i, e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Selecione a Peça
                      </option>
                      {pecasEstoque.map((produto) => (
                        <option key={produto._id} value={produto.nome}>
                          {produto.nome} - R${" "}
                          {produto.valor?.toFixed(2) || "0.00"}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Qtd"
                      value={p.quantidade}
                      min="1"
                      onChange={(e) =>
                        handlePecaChange(i, "quantidade", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      placeholder="Preço unit"
                      value={p.precoUnit}
                      min="0"
                      step="0.01"
                      onChange={(e) =>
                        handlePecaChange(i, "precoUnit", e.target.value)
                      }
                    />

                    <button
                      type="button"
                      className="btn-remove-peca"
                      onClick={() => removePeca(i)}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addPeca}>
                Adicionar peça
              </button>
            </div>

            <div className="form-buttons">
              <button type="submit" className="register-btn">
                Salvar
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/garantias")}
              >
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
