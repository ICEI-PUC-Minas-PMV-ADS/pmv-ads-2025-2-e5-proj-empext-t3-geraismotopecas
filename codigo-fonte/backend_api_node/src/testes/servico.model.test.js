const mongoose = require('mongoose');
const Servico = require('../models/servico'); 



jest.setTimeout(10000);

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect("mongodb://127.0.0.1:27017/test_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
});

describe("Servico - model", () => {
  test("cria e salva um serviço", async () => {
    const servico = new Servico({
      nome_servico: "Troca de óleo",
      desc: "Troca de óleo sintético até 5L",
      valor: 150,
      garantia_dias: 30,
    });

    const salvo = await servico.save();

    expect(salvo._id).toBeDefined();
    expect(salvo.nome_servico).toBe("Troca de óleo");
    expect(salvo.valor).toBe(150);
    expect(salvo.garantia_dias).toBe(30);
  });
});