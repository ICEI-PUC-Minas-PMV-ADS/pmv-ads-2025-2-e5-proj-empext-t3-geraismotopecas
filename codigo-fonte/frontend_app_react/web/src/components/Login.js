import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import Footer from './Footer';
import Header from './Header.js';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/auth/login', {
                email,
                password
            });
            
            console.log('RESPOSTA DO LOGIN:', response.data); // TESTE
            localStorage.setItem('userId', response.data.user._id);
            localStorage.setItem('userName', response.data.user.name);

            toast.success('Login bem-sucedido!');
            navigate('/home');
            console.log('Login bem-sucedido!', response.data);
        } catch (error) {
            if (error.response) {
                toast.error('Erro no login: ' + error.response.data.message);
            } else if (error.request) {
                toast.error('Erro na requisição!');
            } else {
                toast.error('Erro desconhecido: ' + error.message);
            }
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/Cadastrar');
    };

    return (
        <>
            <Header />

            <div className="login-container">
                <div className="login-background">
                    <div className="login-card">
                        <h2>Faça login ou cadastre-se</h2>
                        <form onSubmit={handleLogin}>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <label>Senha:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <div className="login-buttons">
                                <button type="submit">Login</button>
                                <button type="button" onClick={handleRegisterRedirect}>
                                    Cadastre-se
                                </button>
                            </div>
                        </form>
                        <ToastContainer />
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Login;
