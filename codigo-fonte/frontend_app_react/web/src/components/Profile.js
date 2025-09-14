import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';
import Header from './Header';
import Footer from './Footer';
import Avatar from '../images/avatar.png';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const userId = localStorage.getItem('userId'); // pega ID salvo no login
            if (!userId) {
                alert("Usuário não está logado!");
                navigate('/');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3000/usuarios/${userId}`);
                setUser(response.data);
            } catch (error) {
                console.error("Erro ao buscar o perfil do usuário:", error);
                alert("Erro ao carregar o perfil.");
            }
        };

        fetchProfile();
    }, [navigate]);

    if (!user) {
        return <p>Carregando perfil...</p>;
    }

    return (
        <>
            <Header />
            <div className="login-container">
                <div className="login-card">
                    <img src={Avatar} alt="Avatar" className="avatar" />
                    <h2>Perfil de {user.name}</h2>
                    <p>Email: {user.email}</p>

                    <button onClick={() => navigate('/Resultados')}>Pesquisar Receitas</button>
                    <button onClick={() => navigate('/editProfile')}>Editar Perfil</button>
                </div>
            </div>
            <Footer />
        </>

    );
};

export default Profile;