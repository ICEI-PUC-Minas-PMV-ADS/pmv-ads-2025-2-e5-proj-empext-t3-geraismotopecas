const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Teste de Sistema - Rota /usuarios", () => {
  it("Deve criar, listar e deletar um usuário", async () => {
    const novoUsuario = {
      nome: "Maria",
      email: "maria@email.com",
      senha: "123456"
    };

    // Criar usuário
    const resPost = await request(app)
      .post("/usuarios")
      .send(novoUsuario)
      .expect(201);

    expect(resPost.body).toHaveProperty("_id");
    expect(resPost.body.nome).toBe(novoUsuario.nome);

    const usuarioId = resPost.body._id;

    // Listar usuários
    const resGet = await request(app).get("/usuarios").expect(200);
    expect(resGet.body.length).toBe(1);
    expect(resGet.body[0]._id).toBe(usuarioId);

    // Deletar usuário
    await request(app).delete(`/usuarios/${usuarioId}`).expect(200);

    const resFinal = await request(app).get("/usuarios").expect(200);
    expect(resFinal.body.length).toBe(0);
  });
});
