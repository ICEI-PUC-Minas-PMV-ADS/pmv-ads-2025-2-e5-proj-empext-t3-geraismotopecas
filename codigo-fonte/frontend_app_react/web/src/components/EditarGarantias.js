import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/Garantias.css";

const EditarGarantias = () => {
  const [garantia, setGarantia] = useState(null);
  const [pecas, setPecas] = useState([]);
  const [pecasEstoque, setPecasEstoque] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const buscarPecas = async () => {
      try {
        const res = await axios.get("http://localhost:3000/produtos");
        setPecasEstoque(res.data);
      } catch (err) {
        console.error("Erro ao carregar peças do estoque:", err);
      }
    };
    buscarPecas();
  }, []);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/servicos-feitos/${id}`)
        .then((res) => {
          const g = res.data;
          setGarantia(g);
          setPecas(g.pecas_utilizadas || []);
        })
        .catch((err) => {
          console.error(err);
          alert("Erro ao carregar garantia");
        });
    }
  }, [id]);

  const handlePecaChange = (index, field, value) => {
    const novasPecas = [...pecas];
    novasPecas[index][field] = field === "nome" ? value : Number(value);
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
    try {
      await axios.put(`http://localhost:3000/servicos-feitos/${id}`, {
        ...garantia,
        pecas_utilizadas: pecas,
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
        <div className="garantias-container">
          <form className="garantia-card" onSubmit={handleSubmit}>
            <h2>Editar Garantia</h2>

            <label>Nome do cliente:</label>
            <input
              type="text"
              value={garantia.nome_cliente}
              onChange={(e) =>
                setGarantia({ ...garantia, nome_cliente: e.target.value })
              }
              required
            />

            <label>Contato:</label>
            <input
              type="text"
              value={garantia.contato_cliente}
              onChange={(e) =>
                setGarantia({ ...garantia, contato_cliente: e.target.value })
              }
              required
            />

            <label>Modelo:</label>
            <input
              type="text"
              value={garantia.modelo_moto}
              onChange={(e) =>
                setGarantia({ ...garantia, modelo_moto: e.target.value })
              }
            />

            <label>Placa:</label>
            <input
              type="text"
              value={garantia.placa_moto}
              onChange={(e) =>
                setGarantia({ ...garantia, placa_moto: e.target.value })
              }
            />

            <label>Cor:</label>
            <input
              type="text"
              value={garantia.cor_moto}
              onChange={(e) =>
                setGarantia({ ...garantia, cor_moto: e.target.value })
              }
            />

            <label>Ano:</label>
            <input
              type="number"
              value={garantia.ano_moto}
              onChange={(e) =>
                setGarantia({ ...garantia, ano_moto: e.target.value })
              }
            />

            <h3>Serviço realizado</h3>
            <label>Nome:</label>
            <input
              type="text"
              value={garantia.servico_feito.nome}
              onChange={(e) =>
                setGarantia({
                  ...garantia,
                  servico_feito: {
                    ...garantia.servico_feito,
                    nome: e.target.value,
                  },
                })
              }
            />

            <label>Quantidade:</label>
            <input
              type="number"
              value={garantia.servico_feito.quantidade}
              onChange={(e) =>
                setGarantia({
                  ...garantia,
                  servico_feito: {
                    ...garantia.servico_feito,
                    quantidade: e.target.value,
                  },
                })
              }
            />

            <label>Preço unitário:</label>
            <input
              type="number"
              value={garantia.servico_feito.precoUnit}
              onChange={(e) =>
                setGarantia({
                  ...garantia,
                  servico_feito: {
                    ...garantia.servico_feito,
                    precoUnit: e.target.value,
                  },
                })
              }
            />

            <label>Dias de garantia:</label>
            <input
              type="number"
              value={garantia.servico_feito.diasGarantia}
              onChange={(e) =>
                setGarantia({
                  ...garantia,
                  servico_feito: {
                    ...garantia.servico_feito,
                    diasGarantia: e.target.value,
                  },
                })
              }
            />
            <h3>Peças utilizadas</h3>
            <div className="pecas-container">
              {" "}
              {pecas.map((p, i) => (
                <div key={i} className="peca-item">
                  {" "}
                  <div className="inputs-peca">
                    {" "}
                    <select
                      className="peca-select-input"
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
                  </div>{" "}
                </div>
              ))}
            </div>

            <button type="button" onClick={addPeca}>
              Adicionar peça
            </button>

            <div className="form-buttons">
              <button type="submit" className="register-btn">
                Salvar
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
