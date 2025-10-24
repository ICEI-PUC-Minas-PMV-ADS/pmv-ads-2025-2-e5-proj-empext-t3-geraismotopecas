import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/cadastro.css';

const EditarServicos = () => {
  const [nomeServico, setNomeServico] = useState('');
  const [desc, setDesc] = useState('');
  const [valor, setValor] = useState('');
  const [garantiaDias, setGarantiaDias] = useState('');
  const [pecaId, setPecaId] = useState('');
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios.get('http://localhost:3000/produtos')
      .then(res => setProdutos(res.data))
      .catch(err => {
        console.error(err);
        alert('Erro ao buscar produtos');
      });
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/servicos/${id}`)
        .then(res => {
          const data = res.data;
          setNomeServico(data.nome_servico || '');
          setDesc(data.desc || '');
          setValor(data.valor ?? '');
          setGarantiaDias(data.garantia_dias ?? '');
          setPecaId(data.pecaId || '');
        })
        .catch(err => {
          console.error(err);
          alert('Erro ao carregar serviço');
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dados = {
      nome_servico: nomeServico,
      desc,
      valor: parseFloat(valor) || 0,
      garantia_dias: parseInt(garantiaDias) || 0,
      pecaId: pecaId || null
    };

    try {
      if (id) {
        await axios.put(`http://localhost:3000/servicos/${id}`, dados);
        alert('Serviço atualizado com sucesso!');
      } else {
        await axios.post('http://localhost:3000/servicos', dados);
        alert('Serviço criado com sucesso!');
      }
      navigate('/Servicos');
    } catch (err) {
      console.error(err.response?.data || err);
      alert('Erro ao salvar serviço: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="home-container">
      <Sidebar />
      <main className="content">
        <div className="cadastro-container">
          <form className="cadastro-card" onSubmit={handleSubmit}>
            <h2>{id ? 'Editar Serviço' : 'Novo Serviço'}</h2>

            <label>
              Nome:
              <input
                type="text"
                value={nomeServico}
                onChange={(e) => setNomeServico(e.target.value)}
                required
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
              Preço:
              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                step="0.01"
                required
              />
            </label>

            <label>
              Dias de garantia:
              <input
                type="number"
                value={garantiaDias}
                onChange={(e) => setGarantiaDias(e.target.value)}
                min="0"
              />
            </label>

            <label>
              Peça usada:
              <select
                value={pecaId}
                onChange={(e) => setPecaId(e.target.value)}
              >
                <option value="">-- Selecione uma peça --</option>
                {produtos.map(produto => (
                  <option key={produto._id} value={produto._id}>
                    {produto.nome}
                  </option>
                ))}
              </select>
            </label>

            <div className="form-buttons">
              <button type="submit" className="register-btn">
                {id ? 'Atualizar' : 'Cadastrar'}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate('/Servicos')}
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

export default EditarServicos;
