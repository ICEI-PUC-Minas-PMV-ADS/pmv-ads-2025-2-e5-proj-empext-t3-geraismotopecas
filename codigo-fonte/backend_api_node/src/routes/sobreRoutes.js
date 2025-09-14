const express = require("express");
const router = express.Router();
const SobreApp = require("../models/sobreApp"); // importa o model corretamente

// GET - busca todas as perguntas/respostas
router.get("/", async (req, res) => {
  try {
    const perguntas = await SobreApp.find();
    res.json(perguntas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - adiciona nova pergunta/resposta
router.post("/", async (req, res) => {
  try {
    const novaPergunta = new SobreApp({
      pergunta: req.body.pergunta,
      resposta: req.body.resposta,
    });
    const salva = await novaPergunta.save();
    res.status(201).json(salva);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await SobreApp.findByIdAndDelete(id);
    res.json({ message: "Pergunta deletada com sucesso!" });
  } catch (error) {
    console.error("Erro capturado:", error);
    res.status(500).json({ error: "Erro ao deletar a pergunta." });
  }
});

module.exports = router;
