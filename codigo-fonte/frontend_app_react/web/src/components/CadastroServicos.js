import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/cadastro.css';

const ServicoForm = () => {
  const [nomeServico, setNomeServico] = useState('');
  const [desc, setDesc] = useState('');
  const [valor, setValor] = useState('');
  const [garantiaDias, setGarantiaDias] = useState('');
  const [pecasEstoque, setPecasEstoque] = useState([]);
  const [pecas, setPecas] = useState([{ id: '', precoUnit: 0 }]);

  const navigate = useNavigate();
  const { id } = useParams();

  // Buscar produtos para select
  useEffect(() => {
    axios.get('https://geraismotopecas-api.onrender.com/produtos')
      .then(res => setPecasEstoque(res.data))
      .catch(err => {
        console.error(err);
        alert('Erro ao buscar produtos');
      });
  }, []);

 
  useEffect(() => {
    if (id) {
      axios.get(`https://geraismotopecas-api.onrender.com/servicos/${id}`)
        .then(res => {
          const data = res.data;
          setNomeServico(data.nome_servico || '');
          setDesc(data.desc || '');
          setValor(data.valor ?? '');
          setGarantiaDias(data.garantia_dias ?? '');
          if (data.pecas && data.pecas.length) {
            setPecas(data.pecas.map(p => ({
              id: p.id || '',
              precoUnit: p.precoUnit ?? 0
            })));
          }
        })
        .catch(err => {
          console.error(err);
          alert('Erro ao carregar serviço');
        });
    }
  }, [id]);


  const handlePecaChange = (index, field, value) => {
    const novasPecas = [...pecas];
    if (field === 'id') {
      novasPecas[index].id = value;
      const produtoSelecionado = pecasEstoque.find(p => p._id === value);
      novasPecas[index].precoUnit = produtoSelecionado ? produtoSelecionado.valor : 0;
    } else {
      novasPecas[index][field] = value;
    }
    setPecas(novasPecas);
  };

  const addPeca = () => setPecas([...pecas, { id: '', precoUnit: 0 }]);
  const removePeca = (index) => setPecas(pecas.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dados = {
      nome_servico: nomeServico,
      desc,
      valor: parseFloat(valor) || 0,
      garantia_dias: parseInt(garantiaDias) || 0,
      pecas: pecas.map(p => ({
        id: p.id || null,
        precoUnit: p.precoUnit ? Number(p.precoUnit).toFixed(2) : 0
      }))
    };

    try {
      if (id) {
        await axios.put(`https://geraismotopecas-api.onrender.com/servicos/${id}`, dados);
        alert('Serviço atualizado com sucesso!');
      } else {
        await axios.post('https://geraismotopecas-api.onrender.com/servicos', dados);
        alert('Serviço criado com sucesso!');
      }
      navigate('/servicos');
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

            <h3>Peças utilizadas</h3>
            <div className="pecas-container">
              {pecas.map((p, i) => (
                <div key={i} className="peca-item">
                  <div className="inputs-peca">
                    <select
                      className="peca-select-input"
                      value={p.id}
                      onChange={(e) => handlePecaChange(i, 'id', e.target.value)}
                    >
                      <option value="">-- Selecione a peça --</option>
                      {pecasEstoque.map(produto => (
                        <option key={produto._id} value={produto._id}>
                          {produto.nome}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Preço unitário"
                      value={p.id ? Number(p.precoUnit).toFixed(2) : ''}
                      readOnly
                      disabled={!p.id}
                      className="input-bloqueado"
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
                Adicionar Peça
              </button>
            </div>

            <div className="form-buttons">
              <button type="submit" className="register-btn">
                {id ? 'Atualizar' : 'Cadastrar'}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate('/servicos')}
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

export default ServicoForm;
