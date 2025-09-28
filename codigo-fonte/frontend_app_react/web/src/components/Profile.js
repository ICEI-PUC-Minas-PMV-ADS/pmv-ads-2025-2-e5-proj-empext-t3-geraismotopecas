// Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';
import Sidebar from './Sidebar';
import Avatar from '../images/avatar.png';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const userId = localStorage.getItem('userId'); 
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
        <Sidebar>
            <div className="login-container">
                <div className="login-card">
                    <img src={Avatar} alt="Avatar" className="avatar" />
                    <h2>Perfil de {user.name}</h2>
                    <p>Email: {user.email}</p>

                    <button onClick={() => navigate('/editProfile')}>Editar Perfil</button>
                </div>
            </div>
        </Sidebar>
    );
};

export default Profile;
