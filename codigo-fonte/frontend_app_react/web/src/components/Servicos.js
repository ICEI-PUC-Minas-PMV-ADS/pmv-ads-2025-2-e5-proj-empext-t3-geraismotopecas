import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/Servicos.css';
import { FaTrash, FaEdit } from 'react-icons/fa';

const Servicos = () => {
  const [servicos, setServicos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  // Buscar serviços
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

  // Filtrar serviços de forma segura
  const servicosFiltrados = servicos.filter(s =>
    s.nome_servico?.toLowerCase().includes(filtro.toLowerCase())
  );

  // Deletar serviço
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      await axios.delete(`http://localhost:3000/servicos/${id}`);
      setServicos(servicos.filter(s => s._id !== id));
    } catch (err) {
      console.error(err);
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
              placeholder="Filtrar serviços"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              className="filtro-input"
            />
            <button className="add-btn" onClick={() => navigate('/CadastroServicos')}>
              + Serviço
            </button>
          </div>
        </div>

        <div className="servicos-list">
          {servicosFiltrados.length > 0 ? (
            servicosFiltrados.map(servico => (
              <div className="servico-card" key={servico._id}>
                <div className="servico-detalhes">
                  <p className="servico-nome">{servico.nome_servico}</p>
                  <p className="servico-desc">{servico.desc}</p>
                  <p className="servico-valor">R$ {servico.valor?.toFixed(2)}</p>
                  <p className="servico-garantia">{servico.garantia_dias} dias de garantia</p>
                  <div className="servico-actions">
                    <button
                      className="btn-editar"
                      onClick={() => navigate(`/EditarServicos/${servico._id}`)}
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(servico._id)}
                    >
                      <FaTrash /> Excluir
                    </button>
                  </div>
                </div>
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
