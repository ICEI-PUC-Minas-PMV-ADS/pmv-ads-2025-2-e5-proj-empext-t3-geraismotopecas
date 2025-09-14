import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../styles/Cadastrar.css';

const Cadastrar = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', isAdmin: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setForm({ ...form, isAdmin: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3000/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
        isAdmin: form.isAdmin,
      });

      console.log("Dados recebidos:", response.data); //TESTE
      localStorage.setItem('userId', response.data.user._id); //TESTE

      alert('Usuário cadastrado com sucesso!');
      navigate('/');
    } catch (error) {
      alert('Erro ao cadastrar: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <>
      <Header />
      <div className="cadastrar-container">
        <div className="form-card">
          <h2>Cadastro</h2>
          <form onSubmit={handleSubmit}>
            <label>Nome</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required />

            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />

            <label>Senha</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />

            <label>Confirmar Senha</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />

            {/* Caixa de seleção para Administrador */}
            <label className="checkbox-label">
              <input type="checkbox" name="isAdmin" checked={form.isAdmin} onChange={handleCheckboxChange} />
              Administrador
            </label>

            <button type="submit">Cadastrar</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cadastrar;
