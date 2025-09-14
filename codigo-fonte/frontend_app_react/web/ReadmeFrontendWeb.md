Para criar o projeto React com as telas de **login**, **perfil** e **pesquisa de receitas** (com filtros de dados de receitas em `meta`), vou descrever os passos principais e fornecer exemplos de código para cada uma das telas. O projeto será baseado em uma estrutura simples utilizando **React** para o frontend e **Axios** para comunicação com o backend que você já possui (com as APIs de usuários e receitas).

### 1. **Estrutura do Projeto**

Primeiro, vamos criar a estrutura básica do projeto React:

```
my-recipe-app/
├── src/
│   ├── components/
│   │   ├── Login.js
│   │   ├── Profile.js
│   │   ├── RecipeSearch.js
│   ├── App.js
│   ├── api.js
│   └── index.js
├── package.json
└── .env
```

### 2. **Instalando Dependências**

Primeiro, crie o projeto React e instale as dependências necessárias:

```bash
npx create-react-app my-recipe-app
cd my-recipe-app
npm install axios react-router-dom
```

- **Axios**: Para fazer requisições HTTP.
- **react-router-dom**: Para a navegação entre as páginas (rotas) do React.

### 3. **Configuração da API**

Crie o arquivo `src/api.js` para centralizar as chamadas à API, utilizando o **Axios** para facilitar as requisições.

```javascript
// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',  // URL do backend
});

export const getRecipes = async () => {
  const response = await api.get('/receitas');
  return response.data;
};

export const getUserProfile = async (userId) => {
  const response = await api.get(`/usuarios/${userId}`);
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post('/usuarios', { email, senha: password });
  return response.data;
};
```

### 4. **Roteamento com React Router**

Em `src/App.js`, configure o roteamento com **React Router** para navegação entre as telas de login, perfil e pesquisa de receitas.

```javascript
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import RecipeSearch from './components/RecipeSearch';

const App = () => {
  return (
    <Router>
      <div>
        <h1>Cookbook App</h1>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/profile" component={Profile} />
          <Route path="/recipes" component={RecipeSearch} />
          <Route path="/" exact component={Login} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
```

### 5. **Tela de Login (Login.js)**

Crie um componente `Login` para que o usuário possa se autenticar com o e-mail e a senha.

```javascript
// src/components/Login.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { loginUser } from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);
      // Após login bem-sucedido, redireciona para o perfil
      history.push('/profile');
    } catch (error) {
      alert('Erro ao fazer login');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
```

### 6. **Tela de Perfil (Profile.js)**

A tela de perfil deve exibir as informações do usuário. Aqui, vamos obter o perfil do usuário com base no `userId`.

```javascript
// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getUserProfile } from '../api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const history = useHistory();
  const userId = 1; // Exemplo de ID de usuário (pode ser dinâmico)

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile(userId);
      setUser(data);
    };
    fetchProfile();
  }, [userId]);

  if (!user) {
    return <p>Carregando perfil...</p>;
  }

  return (
    <div>
      <h2>Perfil de {user.nome}</h2>
      <p>Email: {user.email}</p>
      <button onClick={() => history.push('/recipes')}>Pesquisar Receitas</button>
    </div>
  );
};

export default Profile;
```

### 7. **Tela de Pesquisa de Receitas (RecipeSearch.js)**

Agora, crie a tela de pesquisa de receitas. Aqui, vamos buscar as receitas e aplicar filtros com base nos campos da chave `meta` (como `dificuldade`, `tipo_receita`, etc.).

```javascript
// src/components/RecipeSearch.js
import React, { useEffect, useState } from 'react';
import { getRecipes } from '../api';

const RecipeSearch = () => {
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState({
    dificuldade: '',
    tipo_receita: '',
  });

  useEffect(() => {
    const fetchRecipes = async () => {
      const data = await getRecipes();
      setRecipes(data);
    };
    fetchRecipes();
  }, []);

  const applyFilters = () => {
    return recipes.filter((recipe) => {
      const matchDificuldade = filters.dificuldade ? recipe.meta_receita.dificuldade === filters.dificuldade : true;
      const matchTipoReceita = filters.tipo_receita ? recipe.meta_receita.tipo_receita === filters.tipo_receita : true;
      return matchDificuldade && matchTipoReceita;
    });
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredRecipes = applyFilters();

  return (
    <div>
      <h2>Pesquisa de Receitas</h2>
      <div>
        <label>Dificuldade: </label>
        <select name="dificuldade" onChange={handleChange}>
          <option value="">Selecione</option>
          <option value="Fácil">Fácil</option>
          <option value="Média">Média</option>
          <option value="Difícil">Difícil</option>
        </select>
      </div>
      <div>
        <label>Tipo de Receita: </label>
        <select name="tipo_receita" onChange={handleChange}>
          <option value="">Selecione</option>
          <option value="Doce">Doce</option>
          <option value="Salgado">Salgado</option>
        </select>
      </div>
      <h3>Receitas Encontradas</h3>
      <ul>
        {filteredRecipes.map((recipe) => (
          <li key={recipe.id_receita}>
            <h4>{recipe.nome_receita}</h4>
            <p>Tipo: {recipe.meta_receita.tipo_receita}</p>
            <p>Dificuldade: {recipe.meta_receita.dificuldade}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeSearch;
```

### 8. **Tela de Editar Perfil (EditProfile.js)**

```javascript
/ src/components/EditProfile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, putUserProfile } from '../api';
import Header from './Header';
import Footer from './Footer';
import snoopy1 from '../images/img2.jpg';
import '../styles/EditProfile.css';

const EditProfile = () => {
    const [formData, setFormData] = useState({ nome: '', email: '', idade: '', foto: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewFoto, setPreviewFoto] = useState(null);
    const navigate = useNavigate();
    const userId = 1; // ID fixo para simulação

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile(userId);
                setFormData(data);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
            }
        };
        fetchProfile();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'idade' ? Number(value) : value,
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
            const updated = await putUserProfile(userId, formData);
            console.log('Perfil atualizado:', updated);
            navigate('/profile'); // redireciona após salvar
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
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
                        {/* Exibe a prévia da foto se houver */}
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

                    <label htmlFor="idade">Idade:</label>
                    <input
                        type="number"
                        name="idade"
                        value={formData.idade}
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
```


### 9. **Iniciando o Projeto**

Agora, basta iniciar o servidor React e acessar as páginas que criamos.

```bash
npm start
```

O projeto estará rodando na URL `http://localhost:3000`. O usuário poderá acessar as páginas de **Login**, **Perfil** e **Pesquisa de Receitas** com filtros baseados em `meta`.

---

### Resumo do Fluxo:

- **Login**: O usuário entra com e-mail e senha.
- **Perfil**: Exibe as informações do usuário após o login.
- **Pesquisa de Receitas**: Permite que o usuário pesquise receitas e filtre por `dificuldade` e `tipo_receita`.

Esse exemplo de implementação cria uma base para o seu aplicativo de receitas com autenticação e filtros. Você pode expandir e melhorar conforme as necessidades do seu projeto. Se precisar de mais detalhes ou ajustes, é só avisar!