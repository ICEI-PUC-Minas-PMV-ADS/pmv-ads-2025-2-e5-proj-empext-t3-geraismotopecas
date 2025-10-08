import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/Produtos.css';
import { FaTrash, FaEdit, FaArrowAltCircleDown, FaExclamationTriangle } from 'react-icons/fa';

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

  const removeAcentos = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };
  const produtosFiltrados = produtos.filter(p =>
    removeAcentos(p.nome?.toLowerCase()).includes(removeAcentos(filtro.toLowerCase()))
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
      <div className="produto-linha" key={produto._id}>
        <div className="produto-info">
          <div className="produto-img-placeholder" />

          <div className="produto-detalhes">
            <p className="produto-nome">
              {produto.nome}
              {produto.meta_controle.qtd_estoque < produto.meta_controle.qtd_min_fixa && (
                <FaExclamationTriangle className="icone-alerta" title="Estoque abaixo do mínimo" />
              )}
            </p>
            <p className="produto-desc">{produto.desc}</p>
            <p className="produto-estoque">
              Estoque: {produto.meta_controle?.qtd_estoque ?? 0}
            </p>

            <div className="produto-acoes">
              <button className="btn-azul" onClick={() => navigate(`/EditarProdutos/${produto._id}`)}>Editar</button>
              <button className="btn-cinza" onClick={() => navigate(`/DetalhesProduto/${produto._id}`)}>Detalhes</button>
            </div>
          </div>
        </div>

        <button className="delete-button" onClick={() => handleDelete(produto._id)}>
          <FaTrash />
        </button>
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
