const mongoose = require('mongoose');

const servicoSchema = new mongoose.Schema({
    nome_servico: { type: String, required: true },
    desc: { type: String, required: true },
    peca_usada: { type: String, default: null },
    garantia_dias: { type: Number, required: true },
    valor: { type: Number, required: true }
}, { timestamps: true }); 

module.exports = mongoose.model('Servico', servicoSchema); 