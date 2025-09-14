import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import snoopy1 from '../images/img2.jpg';
import '../styles/EditProfile.css';

const EditProfile = () => {
    const [formData, setFormData] = useState({ nome: '', email: '', foto: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewFoto, setPreviewFoto] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/usuarios/${userId}`);
                setFormData({
                    nome: response.data.name || '',
                    email: response.data.email || '',
                    foto: response.data.foto || '',
                });
                setPreviewFoto(response.data.foto || null);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, foto: reader.result }));
                setPreviewFoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setFormData(prev => ({ ...prev, foto: '' }));
        setPreviewFoto(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await axios.put(`http://localhost:3000/auth/users/${userId}`, {
                name: formData.nome,
                email: formData.email,
                foto: formData.foto,
            });


            console.log('Perfil atualizado:', response.data);
            navigate('/profile');
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            alert('Erro ao salvar perfil.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Carregando perfil...</p>;

    return (
        <>
            <Header />
            <img src={snoopy1} alt="Banner" className="profile-banner" />
            <div className="edit-profile-container">
                <form onSubmit={handleSubmit} className="edit-profile-form">
                    <h2>Editar Perfil</h2>

                    <label htmlFor="foto">Foto de Perfil:</label>
                    <div className="profile-picture-container">
                        <input
                            type="file"
                            accept="image/*"
                            name="foto"
                            onChange={handleFileChange}
                        />
                        {previewFoto && (
                            <div className="preview-container">
                                <img
                                    src={previewFoto}
                                    alt="Prévia da Foto"
                                    className="profile-preview"
                                />
                                <button
                                    type="button"
                                    className="remove-icon"
                                    onClick={handleRemovePhoto}
                                >
                                    X
                                </button>
                            </div>
                        )}
                    </div>

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

                    <button type="submit" disabled={saving}>
                        {saving ? 'Salvando...' : 'Salvar'}
                    </button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default EditProfile;
