// tests/produto.test.js
const request = require("supertest");
const express = require("express");
const produtoRoutes = require("../routes/produtoRoutes");

const app = express();
app.use(express.json());
app.use("/produtos", produtoRoutes);

jest.mock("../models/Produto");
const Produto = require("../models/Produto");

describe("Rotas de Produtos", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("POST /produtos - deve cadastrar um produto", async () => {
    const novoProduto = {
      id_peca: 1,
      nome: "Pneu Dianteiro",
      codigo: "PN-001",
      desc: "Pneu de alta performance",
      data_inicio_gestao: "2025-09-01",
      contem_servico: false,
      meta_controle: {
        qtd_min_fixa: 5,
        qtd_estoque: 10,
        qtd_vendido: 2,
      },
    };

    Produto.prototype.save = jest.fn().mockResolvedValue(novoProduto);

    const res = await request(app).post("/produtos").send(novoProduto);
    expect(res.statusCode).toBe(201);
    expect(res.body.nome).toBe("Pneu Dianteiro");
  });

  it("GET /produtos - deve listar todos os produtos", async () => {
    const produtos = [{ nome: "Pneu Dianteiro" }, { nome: "Óleo Lubrificante" }];
    Produto.find.mockResolvedValue(produtos);

    const res = await request(app).get("/produtos");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("GET /produtos/:id - deve buscar produto por ID", async () => {
    const produto = { nome: "Pneu Dianteiro" };
    Produto.findById.mockResolvedValue(produto);

    const res = await request(app).get("/produtos/123");
    expect(res.statusCode).toBe(200);
    expect(res.body.nome).toBe("Pneu Dianteiro");
  });

  it("PUT /produtos/:id - deve atualizar produto", async () => {
    const atualizado = { nome: "Pneu Traseiro" };
    Produto.findByIdAndUpdate.mockResolvedValue(atualizado);

    const res = await request(app).put("/produtos/123").send(atualizado);
    expect(res.statusCode).toBe(200);
    expect(res.body.nome).toBe("Pneu Traseiro");
  });

  it("DELETE /produtos/:id - deve deletar produto", async () => {
    Produto.findByIdAndDelete.mockResolvedValue({ _id: "123" });

    const res = await request(app).delete("/produtos/123");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Produto removido com sucesso");
  });
});
