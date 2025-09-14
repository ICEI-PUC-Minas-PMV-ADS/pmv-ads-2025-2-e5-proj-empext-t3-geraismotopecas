// src/api.js//  
/**import axios from 'axios';

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
**/
// src/api.js
export const loginUser = async (email, password) => {
    // Função para autenticar o usuário
    if (email === 'user@example.com' && password === 'senha123') {
      return { nome: 'João', email: 'user@example.com', idade: 30 };
    }
    throw new Error('Credenciais inválidas');
  };
  
  export const getUserProfile = async (userId) => {
    // Simulação de dados de perfil
    if (userId === 1) {
      return { nome: 'João', email: 'user@example.com', idade: 30 };
    }
    throw new Error('Usuário não encontrado');
};

export const putUserProfile = async (userId, newData) => {
    // Simulação de atualização do perfil
    if (userId === 1) {
        // merge dos dados antigos com os novos
        return { nome: newData.nome, email: newData.email, idade: newData.idade };
    }
    throw new Error('Usuário não encontrado');
};
  
  export const getRecipes = async () => {
  return [
    {
      id_receita: 3,
      nome_receita: 'Bolo de Cenoura com Cobertura de Chocolate',
      meta_receita: { tipo_receita: 'Doces', dificuldade: 'Fácil' },
      tempo_preparo: 40,
    },
    {
      id_receita: 4,
      nome_receita: 'Estrogonofe de Frango',
      meta_receita: { tipo_receita: 'Carnes', dificuldade: 'Média' },
      tempo_preparo: 30,
    },
    {
      id_receita: 5,
      nome_receita: 'Salada Vegana Colorida',
      meta_receita: { tipo_receita: 'Vegano', dificuldade: 'Fácil' },
      tempo_preparo: 15,
    },
    {
      id_receita: 6,
      nome_receita: 'Macarrão à Bolonhesa',
      meta_receita: { tipo_receita: 'Massas', dificuldade: 'Fácil' },
      tempo_preparo: 25,
    },
    {
      id_receita: 7,
      nome_receita: 'Torta de Legumes',
      meta_receita: { tipo_receita: 'Vegetariano', dificuldade: 'Média' },
      tempo_preparo: 35,
    },
  ];
};