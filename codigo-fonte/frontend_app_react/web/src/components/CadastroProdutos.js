import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import "../styles/cadastro.css";

const CadastroProdutos = () => {
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [desc, setDesc] = useState('');
  const [dataInicioGestao, setDataInicioGestao] = useState('');
  const [servicos, setServicos] = useState([]);
  const [servico, setServico] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState('');
  const [qtdMin, setQtdMin] = useState('');
  const [dataCompra, setDataCompra] = useState('');
  const [qtdEstoque, setQtdEstoque] = useState('');
  const [valor, setValor] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/servicos")
      .then(res => setServicos(res.data))
      .catch(err => console.error("Erro ao carregar serviços:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dados = {
      nome,
      codigo,
      desc,
      data_inicio_gestao: dataInicioGestao ? new Date(dataInicioGestao) : new Date(),
      contem_servico: servico,
      valor: parseFloat(valor) || 0,
      meta_controle: {
        qtd_min_fixa: parseInt(qtdMin) || 0,
        data_ultima_compra: dataCompra ? new Date(dataCompra) : null,
        qtd_estoque: parseInt(qtdEstoque) || 0,
      },
    };


    try {
      await axios.post('http://localhost:3000/produtos', dados);
      alert('Produto cadastrado com sucesso!');
      navigate('/produtos');
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar produto');
    }
  };

  return (
    <div className="home-container">
      <Sidebar />
      <main className="content">
        <div className="cadastro-container">
          <form className="cadastro-card" onSubmit={handleSubmit}>
            <h2>Novo Produto</h2>

            <label>
              Nome:
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </label>

            <label>
              Código do produto:
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </label>

            <label>
              Descrição:
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </label>

            <label>
              Data de início da gestão:
              <input
                type="date"
                value={dataInicioGestao}
                onChange={(e) => setDataInicioGestao(e.target.value)}
              />
            </label>

            <label className="checkbox-label">
              Produto ligado a um serviço?
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  checked={servico}
                  onChange={(e) => setServico(e.target.checked)}
                />
                <span>Sim</span>
              </div>
            </label>

            {servico && (
              <label>
                Selecione o serviço:
                <select
                  className="servico-select"
                  value={servicoSelecionado}
                  onChange={(e) => setServicoSelecionado(e.target.value)}
                >
                  <option value="">-- Selecione --</option>
                  {servicos.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.nome_servico}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label>
              Quantidade mínima em estoque:
              <input
                type="number"
                value={qtdMin}
                onChange={(e) => setQtdMin(e.target.value)}
                min="0"
              />
            </label>

            <label>
              Quantidade em estoque:
              <input
                type="number"
                value={qtdEstoque}
                onChange={(e) => setQtdEstoque(e.target.value)}
                min="0"
              />
            </label>

            <label>
              Data da última compra:
              <input
                type="date"
                value={dataCompra}
                onChange={(e) => setDataCompra(e.target.value)}
              />
            </label>

            <label>
              Valor do produto:
              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                min="0"
                step="0.01"
              />
            </label>

            <div className="form-buttons">
              <button type="submit" className="register-btn">Salvar</button>
              <button type="button" className="cancel-btn" onClick={() => navigate('/produtos')}>Cancelar</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CadastroProdutos;
