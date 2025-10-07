const mongoose = require("mongoose");

const ProdutoSchema = new mongoose.Schema({
    nome: {
    type: String,
    required: true,
  },
  codigo: {
    type: String,
    default: null,
  },
  desc: {
    type: String,
    required: true,
  },
  data_inicio_gestao: {
    type: Date,
    required: true,
  },
  contem_servico: {
    type: Boolean,
    default: false, 
  },
  valor:{
    type: Number,
    required: true,
  },
  
  meta_controle: {
    qtd_min_fixa: {
      type: Number,
      required: true,
    },
    data_ultima_compra: {
      type: Date,
      default: null,
    },
    qtd_estoque: {
      type: Number,
      required: true,
    },
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Produto", ProdutoSchema);
