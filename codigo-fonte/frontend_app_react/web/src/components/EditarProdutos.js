import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import "../styles/Garantias.css";

const EditarProdutos = () => {
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
  const { id } = useParams();

  useEffect(() => {
    axios.get("http://localhost:3000/servicos")
      .then(res => setServicos(res.data))
      .catch(err => console.error("Erro ao carregar serviços:", err));
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/produtos/${id}`)
        .then(res => {
          const data = res.data;
          setNome(data.nome || '');
          setCodigo(data.codigo || '');
          setDesc(data.desc || '');
          setDataInicioGestao(data.data_inicio_gestao ? data.data_inicio_gestao.split('T')[0] : '');
          setServico(data.contem_servico || false);
          setServicoSelecionado(data.servico_relacionado || '');
          setQtdMin(data.meta_controle?.qtd_min_fixa ?? '');
          setDataCompra(data.meta_controle?.data_ultima_compra ? data.meta_controle.data_ultima_compra.split('T')[0] : '');
          setQtdEstoque(data.meta_controle?.qtd_estoque ?? '');
          setValor(data.valor ?? '');
        })
        .catch(err => {
          console.error(err);
          alert('Erro ao carregar produto');
        });
    }
  }, [id]);

  // Atualizar produto
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dados = {
      nome,
      codigo,
      desc,
      data_inicio_gestao: dataInicioGestao ? new Date(dataInicioGestao) : null,
      contem_servico: servico,
      servico_relacionado: servico ? servicoSelecionado : null,
      valor: parseFloat(valor) || 0,
      meta_controle: {
        qtd_min_fixa: parseInt(qtdMin) || 0,
        data_ultima_compra: dataCompra ? new Date(dataCompra) : null,
        qtd_estoque: parseInt(qtdEstoque) || 0,
      },
    };

    try {
      await axios.put(`http://localhost:3000/produtos/${id}`, dados);
      alert('Produto atualizado com sucesso!');
      navigate('/produtos');
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar produto');
    }
  };

  return (
    <div className="home-container">
      <Sidebar />
      <main className="content">
        <div className="garantias-container">
          <form className="garantia-card" onSubmit={handleSubmit}>
            <h2>Editar Produto</h2>

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
              <button type="submit" className="register-btn">Atualizar</button>
              <button type="button" className="cancel-btn" onClick={() => navigate('/produtos')}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditarProdutos;
