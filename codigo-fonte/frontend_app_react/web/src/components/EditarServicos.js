import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/cadastro.css';

const EditarServicos = () => {
  const [nomeServico, setNomeServico] = useState('');
  const [desc, setDesc] = useState('');
  const [valorMaoObra, setValorMaoObra] = useState(0);
  const [garantiaDias, setGarantiaDias] = useState('');
  const [pecasEstoque, setPecasEstoque] = useState([]);

  // Peças com quantidade + preço (mesmo sem array no schema)
  const [pecas, setPecas] = useState([{ nome: '', quantidade: 1, precoUnit: 0 }]);

  const navigate = useNavigate();
  const { id } = useParams();

  // ================================ CARREGA PRODUTOS ================================
  useEffect(() => {
    axios.get('https://geraismotopecas-api.onrender.com/produtos')
      .then(res => setPecasEstoque(res.data))
      .catch(() => alert('Erro ao carregar estoque de peças'));
  }, []);

  // ================================ CARREGA SERVIÇO PARA EDIÇÃO ================================
  useEffect(() => {
    if (!id) return;

    axios.get(`https://geraismotopecas-api.onrender.com/servicos/${id}`)
      .then(res => {
        const s = res.data;

        setNomeServico(s.nome_servico || '');
        setDesc(s.desc || '');
        setGarantiaDias(s.garantia_dias ?? '');
        setValorMaoObra(Number(s.valor) || 0);

        // Se tiver peca_usada salva em string → transforma em lista
        if (s.peca_usada) {
          try {
            const lista = s.peca_usada.split("|").map(txt => {
              const nome = txt.split("(")[0].trim();
              const quantidade = Number(txt.match(/\d+/)?.[0] ?? 1);
              const preco = Number(txt.replace(/[^\d.,]/g, "").replace(",", "."));
              return { nome, quantidade, precoUnit: preco / quantidade || 0 };
            });

            setPecas(lista);
          } catch {
            setPecas([{ nome: '', quantidade: 1, precoUnit: 0 }]);
          }

        } else {
          setPecas([{ nome: '', quantidade: 1, precoUnit: 0 }]);
        }
      })
      .catch(() => alert("Erro ao carregar serviço"));
  }, [id]);

  // ================================ MANIPULAÇÃO PEÇAS ================================
  const handlePecaSelect = (index, nome) => {
    const item = pecasEstoque.find(p => p.nome === nome);
    const clone = [...pecas];
    clone[index].nome = nome;
    if (item) clone[index].precoUnit = Number(item.valor);
    setPecas(clone);
  };

  const handlePecaChange = (index, campo, valor) => {
    let copia = [...pecas];
    copia[index][campo] = Number(valor) || 0;
    setPecas(copia);
  };

  const addPeca = () => setPecas([...pecas, { nome: '', quantidade: 1, precoUnit: 0 }]);
  const removePeca = (i) => setPecas(pecas.filter((_, index) => index !== i));

  // ================================ CÁLCULOS ================================
  const totalPecas = pecas.reduce((acc, p) => acc + p.quantidade * p.precoUnit, 0);
  const totalFinal = Number(valorMaoObra) + Number(totalPecas);

  // ================================ SALVAR ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const resumoPecas = pecas
      .filter(p => p.nome)
      .map(p => `${p.nome} (${p.quantidade}x) = R$ ${(p.quantidade * p.precoUnit).toFixed(2)}`)
      .join(" | ");

    const dados = {
      nome_servico: nomeServico,
      desc,
      garantia_dias: Number(garantiaDias),
      valor: totalFinal,
      peca_usada: resumoPecas || null, // 🚀 salvo mesmo sem array!
    };

    try {
      await axios.put(`https://geraismotopecas-api.onrender.com/servicos/${id}`, dados);
      alert("Serviço atualizado com sucesso!");
      navigate("/servicos");
    } catch (err) {
      console.log(err);
      alert("Erro ao atualizar serviço");
    }
  };

  // ================================ RENDER ================================
  return (
    <div className="home-container">
      <Sidebar />
      <main className="content">
        <div className="cadastro-container">
          <form className="cadastro-card" onSubmit={handleSubmit}>

            <h2>Editar Serviço</h2>

            <label>Nome</label>
            <input type="text" value={nomeServico} onChange={(e)=>setNomeServico(e.target.value)} required />

            <label>Descrição</label>
            <textarea value={desc} onChange={(e)=>setDesc(e.target.value)} />

            <label>Valor mão de obra</label>
            <input type="number" step="0.01" value={valorMaoObra} onChange={(e)=>setValorMaoObra(e.target.value)} />

            <label>Dias de garantia</label>
            <input type="number" value={garantiaDias} min="0" onChange={(e)=>setGarantiaDias(e.target.value)} />

            <h3>Peças utilizadas</h3>

            <div className="pecas-container">
              {pecas.map((p,i)=>(
                <div key={i} className="peca-item">
                  <div className="inputs-peca">

                    <select
                      className="peca-select-input"
                      value={p.nome}
                      onChange={(e)=>handlePecaSelect(i, e.target.value)}
                    >
                      <option value="">Selecione</option>
                      {pecasEstoque.map(prod=>(
                        <option key={prod._id} value={prod.nome}>{prod.nome}</option>
                      ))}
                    </select>

                    <input type="number" min="1" value={p.quantidade}
                      onChange={(e)=>handlePecaChange(i,"quantidade",e.target.value)}/>

                    <input type="number" step="0.01" value={p.precoUnit}
                      onChange={(e)=>handlePecaChange(i,"precoUnit",e.target.value)}/>

                    <button type="button" className="btn-remove-peca" onClick={()=>removePeca(i)}>X</button>
                  </div>
                </div>
              ))}

              <button type="button" className="btn-add-peca" onClick={addPeca}>+ Adicionar peça</button>
            </div>

            <div className="valor-total">
              <strong>Valor total:</strong> R$ {totalFinal.toFixed(2)}
            </div>

            <div className="form-buttons">
              <button type="submit" className="register-btn">Salvar</button>
              <button onClick={()=>navigate("/servicos")} type="button" className="cancel-btn">
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
