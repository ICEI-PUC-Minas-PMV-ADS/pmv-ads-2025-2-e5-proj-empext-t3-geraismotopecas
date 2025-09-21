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