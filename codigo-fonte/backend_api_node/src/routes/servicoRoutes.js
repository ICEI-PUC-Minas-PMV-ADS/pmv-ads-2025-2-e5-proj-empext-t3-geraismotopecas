const express = require('express');
const router = express.Router();
const Servico = require("../models/servico")



// CRIAR UM NOVO SERVIÇO

router.post("/", async (req, res) => {
    try {
        const novoServico = new Servico(req.body);
        await novoServico.save();
        res.status(201).json(novoServico);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// LISTAR TODOS OS SERVIÇOS

router.get("/", async (req, res) => {
    try {
        const servicos = await Servico.find();
        res.json(servicos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// BUSCAR SERVIÇO POR ID

router.get("/:id", async (req, res) => {
  try {
    const servico = await Servico.findById(req.params.id);
    if (!servico) return res.status(404).json({ message: "Serviço não encontrado" });
    res.json(servico);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});