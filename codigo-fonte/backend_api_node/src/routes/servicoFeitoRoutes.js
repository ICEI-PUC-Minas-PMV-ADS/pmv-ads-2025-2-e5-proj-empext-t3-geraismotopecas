const express = require("express");
const router = express.Router();
const ServicoFeito = require("../models/servicoFeito");

// CREATE
router.post("/", async (req, res) => {
  try {
    const newServicoFeito = new ServicoFeito(req.body);
    await newServicoFeito.save();
    res.status(201).json(newServicoFeito);
  } catch (error) {
    res.status(400).json({ message: "Erro ao cadastrar garantia", error });
  }
});

// READ - buscar todos os serviços feitos (garantias)
router.get("/", async (req, res) => {
  try {
    const lista = await ServicoFeito.find().sort({ data_servico: -1 });
    res.status(200).json(lista);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar garantias", error });
  }
});

// READ - buscar os serviços feitos (garantias) por Id
router.get("/:id", async (req, res) => {
  try {
    const servico = await ServicoFeito.findById(req.params.id);
    if (!servico)
      return res.status(404).json({ message: "Garantia não encontrada" });
    res.status(200).json(servico);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar garantia", error });
  }
});

// UPDATE - editar serviço feito por Id
router.put("/:id", async (req, res) => {
  try {
    const servico = await ServicoFeito.findById(req.params.id);
    if (!servico)
      return res.status(404).json({ message: "Garantia não encontrada" });

    Object.assign(servico, req.body); // atualiza campos
    await servico.save(); // dispara hooks pre-save

    res.status(200).json(servico);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar garantia", error });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const servico = await ServicoFeito.findByIdAndDelete(req.params.id);
    if (!servico)
      return res.status(404).json({ message: "Garantia não encontrada" });
    res.status(200).json({ message: "Garantia deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar garantia", error });
  }
});

module.exports = router;
