import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/cadastro.css";

const EditarGarantias = () => {
  const [garantia, setGarantia] = useState(null);
  const [pecas, setPecas] = useState([]);
  const [pecasEstoque, setPecasEstoque] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [servicoQuantidade, setServicoQuantidade] = useState(1);
  const [valorTotal, setValorTotal] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const buscarPecas = async () => {
      try {
        const res = await axios.get("https://geraismotopecas-api.onrender.com/produtos");
        setPecasEstoque(res.data);
      } catch (err) {
        console.error("Erro ao carregar peças:", err);
      }
    };

    const buscarServicos = async () => {
      try {
        const res = await axios.get("https://geraismotopecas-api.onrender.com/servicos");
        setServicos(res.data);
      } catch (err) {
        console.error("Erro ao carregar serviços:", err);
      }
    };

    buscarPecas();
    buscarServicos();
  }, []);

  useEffect(() => {
    if (id) {
      axios
        .get(`https://geraismotopecas-api.onrender.com/servicos-feitos/${id}`)
        .then((res) => {
          const g = res.data;
          setGarantia(g);
          setPecas(g.pecas_utilizadas || []);
          setServicoQuantidade(g.servico_feito?.quantidade || 1);
        })
        .catch((err) => {
          console.error(err);
          alert("Erro ao carregar garantia");
        });
    }
  }, [id]);

  useEffect(() => {
    if (!garantia || !garantia.servico_feito) return;

    const valorServico =
      (garantia.servico_feito.precoUnit || 0) * (servicoQuantidade || 0);

    const valorPecas = pecas.reduce((total, peca) => {
      const qtd = Number(peca.quantidade) || 0;
      const val = Number(peca.precoUnit) || 0;
      return total + qtd * val;
    }, 0);

    setValorTotal(valorServico + valorPecas);
  }, [garantia, servicoQuantidade, pecas]);

  const handleServicoChange = (nomeSelecionado) => {
    const servicoSelecionado = servicos.find((s) => s.nome_servico === nomeSelecionado);

    if (!servicoSelecionado) {
      setGarantia({
        ...garantia,
        servico_feito: { nome: "", quantidade: 1, precoUnit: 0, diasGarantia: 0 },
      });
      return;
    }

    setGarantia({
      ...garantia,
      servico_feito: {
        nome: servicoSelecionado.nome_servico,
        quantidade: servicoSelecionado.quantidade || 1,
        precoUnit: servicoSelecionado.valor || 0,
        diasGarantia: servicoSelecionado.garantia_dias || 0,
      },
    });

    if (servicoSelecionado.pecaId) {
      const pecaVinculada = pecasEstoque.find((p) => p._id === servicoSelecionado.pecaId);
      if (pecaVinculada) {
        setPecas([
          {
            nome: pecaVinculada.nome,
            quantidade: 1,
            precoUnit: pecaVinculada.valor || 0,
          },
        ]);
      }
    }
  };

  const handlePecaChange = (index, field, value) => {
    const novasPecas = [...pecas];
    novasPecas[index][field] = field === "nome" ? value : Number(value);
    setPecas(novasPecas);
  };

  const handlePecaSelect = (index, nomeSelecionado) => {
    const produtoSelecionado = pecasEstoque.find((item) => item.nome === nomeSelecionado);
    handlePecaChange(index, "nome", nomeSelecionado);
    if (produtoSelecionado) handlePecaChange(index, "precoUnit", produtoSelecionado.valor);
  };

  const addPeca = () => setPecas([...pecas, { nome: "", quantidade: 1, precoUnit: 0 }]);
  const removePeca = (index) => setPecas(pecas.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://geraismotopecas-api.onrender.com/servicos-feitos/${id}`, {
        ...garantia,
        pecas_utilizadas: pecas,
        servico_feito: {
          ...garantia.servico_feito,
          quantidade: Number(servicoQuantidade),
        },
      });
      alert("Garantia atualizada com sucesso!");
      navigate("/Garantias");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar garantia");
    }
  };

  if (!garantia) return <p>Carregando...</p>;

  return (
    <div className="home-container">
      <Sidebar />
      <main className="content">
        <div className="cadastro-container">
          <form className="cadastro-card" onSubmit={handleSubmit}>
            <h2>Editar Garantia</h2>

            <label>Nome do cliente:</label>
            <input
              type="text"
              value={garantia.nome_cliente || ""}
              onChange={(e) =>
                setGarantia({ ...garantia, nome_cliente: e.target.value })
              }
              required
            />

            <label>Contato:</label>
            <input
              type="text"
              value={garantia.contato_cliente || ""}
              onChange={(e) =>
                setGarantia({ ...garantia, contato_cliente: e.target.value })
              }
              required
            />

            <label>Modelo da moto:</label>
            <input
              type="text"
              value={garantia.modelo_moto || ""}
              onChange={(e) =>
                setGarantia({ ...garantia, modelo_moto: e.target.value })
              }
            />

            <label>Placa:</label>
            <input
              type="text"
              value={garantia.placa_moto || ""}
              onChange={(e) =>
                setGarantia({ ...garantia, placa_moto: e.target.value })
              }
            />

            <label>Cor:</label>
            <input
              type="text"
              value={garantia.cor_moto || ""}
              onChange={(e) =>
                setGarantia({ ...garantia, cor_moto: e.target.value })
              }
            />

            <label>Ano:</label>
            <input
              type="number"
              value={garantia.ano_moto || ""}
              onChange={(e) =>
                setGarantia({ ...garantia, ano_moto: e.target.value })
              }
            />

            <h3>Serviço realizado</h3>

            <select
              className="peca-select-input"
              value={garantia.servico_feito?.nome || ""}
              onChange={(e) => handleServicoChange(e.target.value)}
            >
              <option value="">Selecione o serviço</option>
              {servicos.map((servico) => (
                <option key={servico._id} value={servico.nome_servico}>
                  {servico.nome_servico}
                </option>
              ))}
            </select>

            <label>Quantidade:</label>
            <input
              type="number"
              min="1"
              value={servicoQuantidade}
              onChange={(e) => setServicoQuantidade(e.target.value)}
            />

            <label>Preço unitário do serviço:</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={garantia.servico_feito?.precoUnit || ""}
              onChange={(e) =>
                setGarantia({
                  ...garantia,
                  servico_feito: {
                    ...garantia.servico_feito,
                    precoUnit: Number(e.target.value),
                  },
                })
              }
            />

            <label>Dias de garantia:</label>
            <input
              type="number"
              value={garantia.servico_feito?.diasGarantia || ""}
              onChange={(e) =>
                setGarantia({
                  ...garantia,
                  servico_feito: {
                    ...garantia.servico_feito,
                    diasGarantia: Number(e.target.value),
                  },
                })
              }
            />

            <h3>Peças utilizadas</h3>

            <div className="pecas-container">
              {pecas.map((p, i) => (
                <div key={i} className="peca-item">
                  <div className="inputs-peca">
                    <select
                      className="peca-select-input"
                      value={p.nome}
                      onChange={(e) => handlePecaSelect(i, e.target.value)}
                      required
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
                      onChange={(e) =>
                        handlePecaChange(i, "quantidade", e.target.value)
                      }
                    />

                    <input
                      type="number"
                      placeholder="Preço unitário"
                      min="0"
                      step="0.01"
                      value={p.precoUnit}
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

              <button type="button" className="btn-add-peca" onClick={addPeca}>
                Adicionar peça
              </button>
            </div>

            <div className="valor-total">
              <strong>Valor total:</strong> R$ {valorTotal.toFixed(2)}
            </div>

            <div className="form-buttons">
              <button type="submit" className="register-btn">
                Atualizar
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/Garantias")}
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

export default EditarGarantias;
