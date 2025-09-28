import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/Servicos.css';

const EditarProdutos = () => {
  const [nome, setNome] = useState('');
  const [desc, setDesc] = useState('');
  const [valor, setValor] = useState('');
  const [qtdEstoque, setQtdEstoque] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/produtos/${id}`)
        .then(res => {
          const data = res.data;
          setNome(data.nome || '');
          setDesc(data.desc || '');
          setValor(data.valor ?? '');
          setQtdEstoque(data.meta_controle?.qtd_estoque ?? '');
        })
        .catch(err => {
          console.error(err);
          alert('Erro ao carregar produto');
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dados = {
      nome,
      desc,
      valor: parseFloat(valor) || 0,
      meta_controle: { qtd_estoque: parseInt(qtdEstoque) || 0 }
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
        <div className="cadastrar-container">
          <form className="form-card" onSubmit={handleSubmit}>
            <h2>Editar Produto</h2>

            <label>
              Nome:
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
            </label>

            <label>
              Descrição:
              <textarea value={desc} onChange={e => setDesc(e.target.value)} />
            </label>

            <label>
              Preço:
              <input type="number" value={valor} onChange={e => setValor(e.target.value)} step="0.01" required />
            </label>

            <label>
              Quantidade em estoque:
              <input type="number" value={qtdEstoque} onChange={e => setQtdEstoque(e.target.value)} min="0" />
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
