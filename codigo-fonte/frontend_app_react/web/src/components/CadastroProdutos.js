import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/Servicos.css';

const CadastroProdutos = () => {
  const [nome, setNome] = useState('');
  const [desc, setDesc] = useState('');
  const [valor, setValor] = useState('');
  const [qtdEstoque, setQtdEstoque] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dados = {
      nome,
      desc,
      valor: parseFloat(valor) || 0,
      meta_controle: { qtd_estoque: parseInt(qtdEstoque) || 0 }
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
        <div className="cadastrar-container">
          <form className="form-card" onSubmit={handleSubmit}>
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
              Quantidade em estoque:
              <input
                type="number"
                value={qtdEstoque}
                onChange={(e) => setQtdEstoque(e.target.value)}
                min="0"
              />
            </label>

            <div className="form-buttons">
              <button type="submit" className="register-btn">Cadastrar</button>
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

export default CadastroProdutos;
