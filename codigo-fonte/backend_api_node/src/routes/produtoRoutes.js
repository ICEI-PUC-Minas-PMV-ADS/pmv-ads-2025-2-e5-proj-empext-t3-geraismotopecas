const express = require("express");
const router = express.Router();
const Produto = require("../models/Produto");

// CREATE 
router.post("/", async (req, res) => {
  try {
    const newProduto = new Produto(req.body);
    await newProduto.save();
    res.status(201).json(newProduto);
  } catch (error) {
    res.status(400).json({ message: "Erro ao cadastrar produto", error });
  }
});

// READ - buscar todas as peças
router.get("/", async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produtos", error });
  }
});

// READ - buscar peça por ID      
router.get("/:id", async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
    res.json(produto);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produto", error });
  }
});

// UPDATE 
router.put("/:id", async (req, res) => {
  try {
    const updatedProduto = await Produto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduto) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
    res.json(updatedProduto);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar produto", error });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
    try {
        const deletedProduto = await Produto.findByIdAndDelete(req.params.id);
        if (!deletedProduto) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        res.json({ message: "Produto removido com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao remover produto", error });
    }
});

// Rota dos metadados

// Filtro por nome do produto
router.get("/filtro/nome/:nome", async (req, res) => {
    try {
        const produtos = await Produto.find({
            nome: { $regex: req.params.nome, $options: "i" }
        });
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar produtos por nome", error });
    }
});

// Buscar produtos com estoque baixo
router.get("/filtro/estoque/baixo", async (req, res) => {
    try {
        const produtos = await Produto.find({ "meta_controle.qtd_estoque": { $lt: 5 } });
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar produtos com estoque baixo", error });
    }
});

module.exports = router;