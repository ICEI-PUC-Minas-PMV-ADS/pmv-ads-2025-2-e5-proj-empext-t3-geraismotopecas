const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/users');

const app = express();
app.use(express.json());
app.use('/auth', userRoutes);

jest.mock('../models/User');
const User = require('../models/User');
jest.mock('bcryptjs', () => ({
  compare: jest.fn().mockResolvedValue(true),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'fake-token'),
}));

describe('Rotas de Usuários', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POST /auth/register - deve registrar um usuário', async () => {
    const novoUsuario = { name: 'Ana', email: 'ana@email.com', password: '123' };
    User.prototype.save = jest.fn().mockResolvedValue(novoUsuario);

    const res = await request(app).post('/auth/register').send(novoUsuario);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Usuário registrado com sucesso!');
  });

  it('POST /auth/login - deve logar com sucesso', async () => {
    User.findOne.mockResolvedValue({ email: 'ana@email.com', password: 'hash', _id: 'id123', name: 'Ana' });

    const res = await request(app).post('/auth/login').send({ email: 'ana@email.com', password: '123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe('fake-token');
  });

  it('PUT /auth/users/:id - deve atualizar um usuário', async () => {
    const id = '123';
    const atualizacao = { name: 'Ana Atualizada' };
    User.findByIdAndUpdate.mockResolvedValue(atualizacao);

    const res = await request(app).put(`/auth/users/${id}`).send(atualizacao);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Ana Atualizada');
  });

  it('DELETE /auth/users/:id - deve deletar um usuário', async () => {
    const id = '123';
    User.findByIdAndDelete.mockResolvedValue({ _id: id });

    const res = await request(app).delete(`/auth/users/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Usuário deletado com sucesso!');
  });
});
