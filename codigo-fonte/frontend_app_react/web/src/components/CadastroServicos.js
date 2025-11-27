import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/cadastro.css";

export default function ServicoForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nomeServico, setNomeServico] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valorMaoObra, setValorMaoObra] = useState(0);
  const [garantia, setGarantia] = useState(0);

  // Estoque que vem do banco
  const [pecasEstoque, setPecasEstoque] = useState([]);

  // Lista editável utilizada no serviço
  const [pecas, setPecas] = useState([{ nome:"", quantidade:1, precoUnit:0 }]);

  // Carrega peças do estoque
  useEffect(() => {
    axios.get("https://geraismotopecas-api.onrender.com/produtos")
      .then(res => setPecasEstoque(res.data))
      .catch(() => alert("Erro ao carregar estoque"));
  }, []);

  // Carrega dados ao editar
  useEffect(() => {
    if (!id) return;

    axios.get(`https://geraismotopecas-api.onrender.com/servicos/${id}`)
      .then(res => {
        const s = res.data;

        setNomeServico(s.nome_servico || "");
        setDescricao(s.desc || "");
        setGarantia(s.garantia_dias || 0);
        setValorMaoObra(Number(s.valor_mao_obra) || Number(s.valor) || 0);

        setPecas(
          s.pecas?.length
          ? s.pecas.map(p => ({
              nome: p.nome,
              quantidade: Number(p.qtd ?? p.quantidade ?? 1),
              precoUnit: Number(p.precoUnit ?? p.preco ?? 0)
            }))
          : [{ nome:"", quantidade:1, precoUnit:0 }]
        );
      })
      .catch(() => alert("Erro ao carregar serviço para edição"));
  }, [id]);

  // Seleção puxa peça + valor do estoque automaticamente
  const handlePecaSelect = (index, nome) => {
    const item = pecasEstoque.find(p => p.nome === nome);
    let nova = [...pecas];
    nova[index].nome = nome;
    if (item) nova[index].precoUnit = Number(item.valor);
    setPecas(nova);
  };

  // Edição de quantidade e preço
  const handlePecaChange = (index, campo, valor) => {
    let nova = [...pecas];
    nova[index][campo] = Number(valor);
    setPecas(nova);
  };

  const addPeca = () => setPecas([...pecas, { nome:"", quantidade:1, precoUnit:0 }]);
  const removePeca = i => setPecas(pecas.filter((_, idx) => idx !== i));

  const totalPecas = pecas.reduce((acc,p)=> acc + p.quantidade*p.precoUnit ,0);
  const totalFinal = totalPecas + Number(valorMaoObra);

  const salvar = async e => {
    e.preventDefault();

    const data = {
      nome_servico: nomeServico,
      desc: descricao,
      garantia_dias: Number(garantia),
      valor: Number(totalFinal),
      pecas: pecas.map(p => ({
        nome:p.nome,
        qtd:p.quantidade,
        precoUnit:p.precoUnit,
        total: p.quantidade * p.precoUnit
      }))
    };

    try {
      if (id) {
        await axios.put(`https://geraismotopecas-api.onrender.com/servicos/${id}`, data);
      } else {
        await axios.post("https://geraismotopecas-api.onrender.com/servicos", data);
      }

      alert("Serviço salvo com sucesso!");
      navigate("/servicos");

    } catch {
      alert("Erro ao salvar");
    }
  };

  return (
    <div className="home-container">
      <Sidebar />

      <main className="content">
        <div className="cadastro-container">
          <form className="cadastro-card" onSubmit={salvar}>

            <h2>{id ? "Editar Serviço" : "Cadastrar Serviço"}</h2>

            <label>Nome do serviço</label>
            <input value={nomeServico} onChange={e=>setNomeServico(e.target.value)} required />

            <label>Descrição</label>
            <textarea value={descricao} onChange={e=>setDescricao(e.target.value)} />

            <label>Garantia (dias)</label>
            <input type="number" value={garantia} onChange={e=>setGarantia(e.target.value)} />

            <label>Valor mão de obra</label>
            <input type="number" step="0.01" value={valorMaoObra} onChange={e=>setValorMaoObra(e.target.value)} />

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
              <strong>Valor total:</strong> R$ {totalFinal.toFixed(2)}
            </div>

            <div className="form-buttons">
              <button type="submit" className="register-btn">
                Cadastrar
              </button>
              <button type="button" className="cancel-btn" onClick={() => navigate("/Servicos")}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
