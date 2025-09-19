require("dotenv").config();
console.log("JWT_SECRET carregado:", process.env.JWT_SECRET);
console.log("MONGODB_URI carregado:", process.env.MONGODB_URI);

const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

const loginRoutes = require("./routes/loginRoutes");
const sobreRoutes = require("./routes/sobreRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const servicoFeitoRoutes = require("./routes/servicoFeitoRoutes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Conexão com MongoDB
const mongoUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/geraismot_db";

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Conectado ao MongoDB: ${mongoUri}`))
  .catch((err) => console.error("Erro ao conectar:", err));

// Rotas
app.use("/usuarios", userRoutes);
app.use("/auth", loginRoutes);
app.use("/sobre", sobreRoutes);
app.use("/produtos", produtoRoutes);
app.use("/servicos-feitos", servicoFeitoRoutes);

// Exporta app para testes
module.exports = app;

// Se o arquivo for executado diretamente (não por teste), roda o servidor
if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}
