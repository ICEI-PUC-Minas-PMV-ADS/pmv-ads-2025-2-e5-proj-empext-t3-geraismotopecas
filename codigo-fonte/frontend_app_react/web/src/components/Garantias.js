import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/Servicos.css';
import { FaTrash, FaEdit } from 'react-icons/fa';

const Garantias = () => {
  const [garantias, setGarantias] = useState([]);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  const fetchGarantias = async () => {
    try {
      const res = await axios.get('http://localhost:3000/servicos-feitos');
      setGarantias(res.data);
    } catch (err) {
      console.error(err);
      alert('Erro ao buscar garantias');
    }
  };

  useEffect(() => {
    fetchGarantias();
  }, []);

  const garantiasFiltradas = garantias.filter(g =>
    g.nome_cliente?.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta garantia?')) return;
    try {
      await axios.delete(`http://localhost:3000/servicos-feitos/${id}`);
      setGarantias(garantias.filter(g => g._id !== id));
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar garantia');
    }
  };

  return (
    <div className="home-container">
      <Sidebar />
      <main className="content">
        <div className="header">
          <h2>Garantias</h2>
          <div className="header-actions">
            <input
              type="text"
              placeholder="Filtrar por cliente"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              className="filtro-input"
            />
            <button className="add-btn" onClick={() => navigate('/CadastroGarantias')}>
              + Garantia
            </button>
          </div>
        </div>

        <div className="servicos-list">
          {garantiasFiltradas.length > 0 ? (
            garantiasFiltradas.map(g => (
              <div className="servico-card" key={g._id}>
                <div className="servico-detalhes">
                  <p className="servico-nome">{g.nome_cliente}</p>
                  <p className="servico-desc">{g.modelo_moto} - {g.placa_moto}</p>
                  <p className="servico-valor">R$ {g.valor_total?.toFixed(2)}</p>
                  <p className="servico-garantia">
                    Validade: {g.data_validade ? new Date(g.data_validade).toLocaleDateString() : '-'} ({g.status})
                  </p>
                  <div className="servico-actions">
                    <button className="btn-editar" onClick={() => navigate(`/EditarGarantias/${g._id}`)}>
                      <FaEdit /> Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(g._id)}>
                      <FaTrash /> Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="nenhum-servico">Nenhuma garantia encontrada.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Garantias;
