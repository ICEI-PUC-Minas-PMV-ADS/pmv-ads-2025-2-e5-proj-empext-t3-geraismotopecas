const request = require("supertest");
const mongoose = require("mongoose");
const Servico = require("../models/servico");
const app = require("../app");

jest.setTimeout(30000);

beforeEach(async () => {
  // Limpa a coleção antes de cada teste
  await Servico.deleteMany({});
});

describe("Serviço - Rotas", () => {
  test("POST /servicos - cria serviço", async () => {
    const response = await request(app)
      .post("/servicos")
      .send({
        nome_servico: "Troca de óleo",
        desc: "Troca de óleo sintético até 5L",
        valor: 150,
        garantia_dias: 30,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.nome_servico).toBe("Troca de óleo");
  });

  test("GET /servicos/:id - busca serviço", async () => {
    const servico = await Servico.create({
      nome_servico: "Troca de óleo",
      desc: "Troca de óleo sintético até 5L",
      valor: 150,
      garantia_dias: 30,
    });

    const response = await request(app).get(`/servicos/${servico._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(servico._id.toString());
  });

  test("PUT /servicos/:id - atualiza serviço", async () => {
    const servico = await Servico.create({
      nome_servico: "Troca de óleo",
      desc: "Troca de óleo sintético até 5L",
      valor: 150,
      garantia_dias: 30,
    });

    const response = await request(app)
      .put(`/servicos/${servico._id}`)
      .send({ valor: 200 });

    expect(response.statusCode).toBe(200);
    expect(response.body.valor).toBe(200);
  });

  test("DELETE /servicos/:id - deleta serviço", async () => {
    const servico = await Servico.create({
      nome_servico: "Troca de óleo",
      desc: "Troca de óleo sintético até 5L",
      valor: 150,
      garantia_dias: 30,
    });

    const response = await request(app).delete(`/servicos/${servico._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Serviço deletado com sucesso");

    const deleted = await Servico.findById(servico._id);
    expect(deleted).toBeNull();
  });
});

afterAll(async () => {
  // Fecha a conexão do mongoose depois de todos os testes
  await mongoose.connection.close();
});
