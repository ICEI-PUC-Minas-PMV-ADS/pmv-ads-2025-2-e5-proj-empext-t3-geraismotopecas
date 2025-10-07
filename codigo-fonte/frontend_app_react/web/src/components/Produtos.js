import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/Servicos.css';
import { FaTrash, FaEdit, FaArrowAltCircleDown } from 'react-icons/fa';

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  const fetchProdutos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/produtos');
      setProdutos(res.data);
    } catch (err) {
      console.error(err);
      alert('Erro ao buscar produtos');
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const produtosFiltrados = produtos.filter(p =>
    p.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este produto?')) return;
    try {
      await axios.delete(`http://localhost:3000/produtos/${id}`);
      setProdutos(produtos.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar produto');
    }
  };

  async function darBaixa(id, quantidade) {
    try {
      const response = await axios.put(`http://localhost:3000/produtos/${id}/baixa`, {
        quantidade: quantidade,
      });
      alert("Baixa realizada com sucesso!");
      console.log(response.data.produto);
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao dar baixa no estoque.");
    }
  }

  return (
    <div className="home-container">
      <Sidebar />
      <main className="content">
        <div className="header">
          <h2>Produtos</h2>
          <div className="header-actions">
            <input
              type="text"
              placeholder="Filtrar produtos"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              className="filtro-input"
            />
            <button className="add-btn" onClick={() => navigate('/CadastroProdutos')}>
              + Produto
            </button>
          </div>
        </div>

        <div className="servicos-list">
          {produtosFiltrados.length > 0 ? (
            produtosFiltrados.map(produto => (
              <div className="servico-card" key={produto._id}>
                <div className="servico-detalhes">
                  <p className="servico-nome">{produto.nome}</p>
                  <p className="servico-desc">{produto.desc}</p>
                  <p className="servico-valor">R$ {produto.valor?.toFixed(2)}</p>
                  <p className="servico-garantia">
                    Estoque: {produto.meta_controle?.qtd_estoque ?? 0}
                  </p>
                  <div className="servico-actions">
                    <button
                      className="btn-editar"
                      onClick={() => navigate(`/EditarProdutos/${produto._id}`)}
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      className="btn-baixa"
                      onClick={() => {
                        const qtd = prompt("Digite a quantidade para dar baixa:");
                        if (qtd) {
                          darBaixa(produto._id, parseInt(qtd));
                        }
                      }}
                    >
                      <FaArrowAltCircleDown /> Baixa
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(produto._id)}
                    >
                      <FaTrash /> Excluir
                    </button>

                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="nenhum-servico">Nenhum produto encontrado.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Produtos;
