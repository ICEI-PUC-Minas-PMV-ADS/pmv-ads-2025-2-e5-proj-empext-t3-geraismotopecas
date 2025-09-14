const mongoose = require("mongoose");

const sobreAppSchema = new mongoose.Schema({
  pergunta: {
    type: String,
    required: true,
  },
  resposta: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("SobreApp", sobreAppSchema);
