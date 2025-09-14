const request = require('supertest');
const app = require('../app'); // caminho para o seu app.js
const mongoose = require('mongoose');

describe('Testes de integração - Usuários', () => {
  let server;

  beforeAll(async () => {
    // Aqui você pode conectar a um banco de teste, se quiser
    server = app.listen(4000); // Usa uma porta específica para testes
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Fecha a conexão com o MongoDB
    await server.close(); // Encerra o servidor
  });

  let userId;

  test('Deve criar um novo usuário', async () => {
    const resposta = await request(app)
      .post('/usuarios') // substitua pela sua rota real
      .send({
        nome: 'Usuário Teste',
        email: 'teste@example.com',
        senha: '123456',
      });

    expect(resposta.statusCode).toBe(201);
    expect(resposta.body).toHaveProperty('_id');
    userId = resposta.body._id;
  });

  test('Deve buscar todos os usuários', async () => {
    const resposta = await request(app).get('/usuarios');
    expect(resposta.statusCode).toBe(200);
    expect(Array.isArray(resposta.body)).toBe(true);
  });

  test('Deve buscar um usuário específico pelo ID', async () => {
    const resposta = await request(app).get(`/usuarios/${userId}`);
    expect(resposta.statusCode).toBe(200);
    expect(resposta.body).toHaveProperty('_id', userId);
  });

  test('Deve deletar o usuário', async () => {
    const resposta = await request(app).delete(`/usuarios/${userId}`);
    expect(resposta.statusCode).toBe(200);
  });
});
