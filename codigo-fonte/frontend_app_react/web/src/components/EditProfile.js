import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/EditProfile.css';

const EditProfile = () => {
    const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`https://geraismotopecas-api.onrender.com/usuarios/${userId}`);
                setFormData({
                    nome: response.data.name || '',
                    email: response.data.email || '',
                    senha: '',
                });
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
                alert('Erro ao carregar o perfil.');
                navigate('/');
            }
        };
        fetchProfile();
    }, [userId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                name: formData.nome,
                email: formData.email,
            };
            if (formData.senha) {
                payload.password = formData.senha;
            }

            await axios.put(`https://geraismotopecas-api.onrender.com/auth/users/${userId}`, payload);
            alert('Perfil atualizado com sucesso!');
            navigate('/profile');
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            alert('Erro ao salvar perfil.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Tem certeza que deseja excluir seu usuário?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`https://geraismotopecas-api.onrender.com/auth/users/${userId}`);
            alert('Usuário excluído com sucesso!');
            localStorage.removeItem('userId');
            navigate('/');
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            alert('Erro ao excluir usuário.');
        }
    };

    if (loading) return <p>Carregando perfil...</p>;

    return (
        <Sidebar>
            <div className="edit-profile-container">
                <form onSubmit={handleSubmit} className="edit-profile-form">
                    <h2>Editar Perfil</h2>

                    <label htmlFor="nome">Nome:</label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="senha">Nova Senha:</label>
                    <input
                        type="password"
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        placeholder="Digite para alterar a senha"
                    />

                    <button type="submit" disabled={saving}>
                        {saving ? 'Salvando...' : 'Salvar'}
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        style={{
                            marginTop: '10px',
                            backgroundColor: '#FF0000',
                            color: 'white',
                            width: '100%',
                            padding: '12px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Excluir Usuário
                    </button>
                </form>
            </div>
        </Sidebar>
    );
};

export default EditProfile;
