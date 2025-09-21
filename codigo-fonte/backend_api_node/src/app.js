// app.js (versão corrigida)
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");
const sobreRoutes = require("./routes/sobreRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const servicoFeitoRoutes = require("./routes/servicoFeitoRoutes");
const servicoRoutes = require("./routes/servicoRoutes")
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/usuarios", userRoutes);
app.use("/auth", loginRoutes);
app.use("/sobre", sobreRoutes);
app.use("/produtos", produtoRoutes);
app.use("/servicos-feitos", servicoFeitoRoutes);
app.use("/servicos", servicoRoutes);

// Exporta app para testes
module.exports = app;

// Apenas a lógica para iniciar o servidor de produção fica aqui
if (require.main === module) {
  // A conexão com o banco de dados SÓ ACONTECE AQUI
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/geraismot_db";

  mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`Conectado ao MongoDB: ${mongoUri}`))
    .catch((err) => console.error("Erro ao conectar:", err));

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}
