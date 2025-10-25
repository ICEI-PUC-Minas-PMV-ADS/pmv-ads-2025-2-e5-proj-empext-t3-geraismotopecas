import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/Servicos.css';
import { FaTrash } from 'react-icons/fa';

const Servicos = () => {
  const [servicos, setServicos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  const fetchServicos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/servicos');
      setServicos(res.data);
    } catch (err) {
      console.error(err);
      alert('Erro ao buscar serviços');
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  const removeAcentos = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const servicosFiltrados = servicos.filter(s =>
    removeAcentos(s.nome_servico?.toLowerCase()).includes(removeAcentos(filtro.toLowerCase()))
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este serviço?')) return;
    try {
      await axios.delete(`http://localhost:3000/servicos/${id}`);
      setServicos(servicos.filter(s => s._id !== id));
    } catch {
      alert('Erro ao deletar serviço');
    }
  };

  return (
    <div className="home-container">
      <Sidebar />
      <main className="content">
        <div className="header">
          <h2>Serviços</h2>
          <div className="header-actions">
            <input
              type="text"
              placeholder="Filtrar serviços..."
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              className="filtro-input"
            />
            <button className="add-btn" onClick={() => navigate('/servicos/cadastro')}>
              + Serviço
            </button>
          </div>
        </div>

        <div className="servicos-lista">
          {servicosFiltrados.length > 0 ? (
            servicosFiltrados.map(servico => (
              <div className="servico-linha" key={servico._id}>
                <div className="servico-info">
                  <div className="servico-img-placeholder" />
                  <div className="servico-detalhes">
                    <p className="servico-nome">{servico.nome_servico}</p>
                    <p className="servico-desc">{servico.desc}</p>
                    <p className="servico-valor">Valor: R$ {servico.valor?.toFixed(2)}</p>
                    <p className="servico-garantia">Garantia: {servico.garantia_dias} dias</p>
                    <div className="servico-acoes">
                      <button className="btn-azul" onClick={() => navigate(`/servicos/editar/${servico._id}`)}>Editar</button>
                      <button className="btn-cinza" onClick={() => navigate(`/DetalhesServico/${servico._id}`)}>Detalhes</button>
                    </div>
                  </div>
                </div>
                <button className="delete-button" onClick={() => handleDelete(servico._id)}>
                  <FaTrash />
                </button>
              </div>
            ))
          ) : (
            <p className="nenhum-servico">Nenhum serviço encontrado.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Servicos;
