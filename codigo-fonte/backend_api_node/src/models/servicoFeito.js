const mongoose = require("mongoose");
const { Schema } = mongoose;

const PecasUtilizadasSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, ref: "Peca", required: false },
    nome: { type: String, required: true, trim: true },
    quantidade: { type: Number, required: true, min: 1, default: 1 },
    precoUnit: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const ServicoFeitoSubSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, ref: "Servico", required: false },
    nome: { type: String, required: true, trim: true },
    quantidade: { type: Number, required: true, min: 1, default: 1 },
    precoUnit: { type: Number, required: false, min: 0 },
    diasGarantia: { type: Number, required: false, min: 0 },
  },
  { _id: false }
);

const ServicoFeitoSchema = new Schema(
  {
    nome_cliente: { type: String, required: true, trim: true },
    contato_cliente: { type: String, required: true, trim: true },

    modelo_moto: { type: String, trim: true },
    placa_moto: { type: String, trim: true, uppercase: true },
    cor_moto: { type: String, trim: true },
    ano_moto: { type: Number, min: 1900, max: 2100 },

    data_servico: { type: Date, required: true, default: Date.now },

    servico_feito: { type: ServicoFeitoSubSchema, required: true },

    pecas_utilizadas: { type: [PecasUtilizadasSchema], default: [] },

    valor_total: { type: Number, required: true, min: 0, default: 0 },

    // calculado a partir de data_servico + servico_feito.diasGarantia
    data_validade: { type: Date },

    status: {
      type: String,
      enum: ["Ativa", "Expirada", "Cancelada"],
      default: "Ativa",
    },
  },
  { timestamps: true, collection: "servicos_feitos" }
);

// Hook para calcular valor_total, data_validade e status antes de salvar
ServicoFeitoSchema.pre("save", function (next) {
  try {
    // calcula valor das peças
    let total = 0;
    if (Array.isArray(this.pecas_utilizadas)) {
      for (const p of this.pecas_utilizadas) {
        const qty = Number(p.quantidade || 0);
        const price = Number(p.precoUnit || 0);
        total += qty * price;
      }
    }

    // adiciona preço do serviço se informado
    if (this.servico_feito && this.servico_feito.precoUnit) {
      const svcQty = Number(this.servico_feito.quantidade || 1);
      total += svcQty * Number(this.servico_feito.precoUnit || 0);
    }

    this.valor_total = total;

    // calcula data_validade se diasGarantia estiver presente
    if (
      this.data_servico &&
      this.servico_feito &&
      typeof this.servico_feito.diasGarantia === "number"
    ) {
      const dias = Number(this.servico_feito.diasGarantia || 0);
      const data = new Date(this.data_servico);
      data.setUTCDate(data.getUTCDate() + dias);
      data.setUTCHours(23, 59, 59, 999);
      this.data_validade = data;
    } else {
      this.data_validade = undefined;
    }

    if (this.status !== "Cancelada") {
      if (this.data_validade) {
        const now = new Date();
        this.status = now <= this.data_validade ? "Ativa" : "Expirada";
      } else {
        this.status = "Ativa";
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("ServicoFeito", ServicoFeitoSchema);
