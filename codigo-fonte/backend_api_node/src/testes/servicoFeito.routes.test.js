const request = require("supertest");
const app = require("../app");
const ServicoFeito = require("../models/servicoFeito");

// Os blocos de conexão e desconexão foram movidos para o arquivo de setup global do Jest (setup.js).
// Isso evita conflitos de conexão e mantém o código de teste mais limpo e focado.

describe("Teste de rotas de ServicoFeito", () => {
  it("POST /servicos-feitos - deve criar um serviço", async () => {
    const payload = {
      nome_cliente: "Maria Silva",
      contato_cliente: "11999998888",
      modelo_moto: "Honda CB 500",
      placa_moto: "XYZ-1234",
      cor_moto: "Preta",
      ano_moto: 2022,
      servico_feito: {
        id: null,
        nome: "Troca de óleo",
        quantidade: 1,
        precoUnit: 100,
        diasGarantia: 90,
      },
      pecas_utilizadas: [
        { id: null, nome: "Filtro de óleo", quantidade: 1, precoUnit: 25 },
      ],
    };

    const res = await request(app)
      .post("/servicos-feitos")
      .send(payload)
      .expect(201);

    expect(res.body.nome_cliente).toBe("Maria Silva");
    expect(res.body.valor_total).toBe(125);
    expect(res.body.servico_feito.nome).toBe("Troca de óleo");
  });

  it("GET /servicos-feitos - deve listar serviços", async () => {
    // Primeiro cria um serviço direto no banco
    await ServicoFeito.create({
      nome_cliente: "João",
      contato_cliente: "11999998877",
      servico_feito: {
        nome: "Revisão",
        quantidade: 1,
        precoUnit: 50,
        diasGarantia: 30,
      },
    });

    const res = await request(app).get("/servicos-feitos").expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0].nome_cliente).toBe("João");
  });
});
