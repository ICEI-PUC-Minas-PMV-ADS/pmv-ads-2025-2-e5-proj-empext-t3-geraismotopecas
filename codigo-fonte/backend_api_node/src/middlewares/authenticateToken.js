const jwt = require("jsonwebtoken");

// Middleware para verificar se o token JWT é válido
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // pega o cabeçalho Authorization
  const token = authHeader && authHeader.split(" ")[1]; // pega só o token (sem o "Bearer ")

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Erro na verificação do token:", err);
      return res.status(403).json({ error: "Token inválido" });
    }

    req.user = user; // salva as infos do usuário dentro do request
    next(); // passa pra próxima função (a da rota mesmo)
  });
}

module.exports = authenticateToken;
