const ServicoFeito = require("../models/servicoFeito");

describe("Model ServicoFeito", () => {
  it("deve calcular valor_total corretamente", async () => {
    const doc = new ServicoFeito({
      nome_cliente: "Maria Souza",
      contato_cliente: "31988887777",
      modelo_moto: "Yamaha Factor",
      placa_moto: "XYZ-9876",
      cor_moto: "Preta",
      ano_moto: 2021,
      data_servico: new Date(),
      servico_feito: {
        nome: "Troca de óleo",
        quantidade: 1,
        precoUnit: 50,
        diasGarantia: 30,
      },
      pecas_utilizadas: [
        { nome: "Filtro de óleo", quantidade: 1, precoUnit: 25 },
      ],
    });

    await doc.save();

    expect(doc.valor_total).toBe(75);
    expect(doc.status).toBe("Ativa");
    expect(doc.data_validade).not.toBeNull();
  });
});
