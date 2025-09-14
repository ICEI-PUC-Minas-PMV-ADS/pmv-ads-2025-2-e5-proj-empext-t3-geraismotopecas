// sobreBanco.js
// Script manual para popular o banco de dados com as perguntas e respostas do Sobre o App.
// Rode este script uma única vez com: `node sobreBanco.js`
// NÃO deve ser incluído no deploy ou execução automática do projeto.

const mongoose = require("mongoose");
const SobreApp = require("./models/sobreApp");

// Conexão com o banco
mongoose.connect(
  "mongodb+srv://admintd:cookbook123@projreceitas.bficb.mongodb.net/cookbook?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const dados = [
  {
    pergunta: "O que é o CookBook?",
    resposta:
      "O CookBook é um espaço digital gratuito para encontrar, compartilhar e organizar receitas de forma prática e personalizada.",
  },
  {
    pergunta: "Quais filtros posso usar na busca?",
    resposta:
      "Você pode filtrar por tipo de receita (como café da manhã, almoço, sobremesa, etc) e por nível de dificuldade (fácil, médio ou difícil).",
  },
  {
    pergunta: "Preciso de conta para ver receitas?",
    resposta:
      "Não! Você pode explorar todas as receitas mesmo sem estar logado(a).",
  },
  {
    pergunta: "Como faço para cadastrar uma receita?",
    resposta:
      "Basta criar uma conta, fazer login e preencher o formulário de cadastro de receita corretamente.",
  },
  {
    pergunta: "Consigo editar minhas receitas?",
    resposta:
      "Sim! Acesse seu perfil, encontre suas receitas cadastradas e clique na opção de editar. Então, é só alterar a informação desejada e, em seguida, salvar.",
  },
  {
    pergunta: "Onde vejo as receitas que eu criei?",
    resposta:
      "Acesse a área do usuário e você poderá ver todas as suas receitas.",
  },
  {
    pergunta: "O login é obrigatório para usar o app?",
    resposta:
      "Apenas para cadastrar ou editar receitas. Para buscar e visualizar, não é necessário login.",
  },
  {
    pergunta: "Minhas receitas ficam visíveis para todo mundo?",
    resposta:
      "Sim! Todas as receitas cadastradas ficam públicas, visíveis até mesmo para quem não está logado.",
  },
  {
    pergunta: "Posso acessar as receitas sem conexão com a internet?",
    resposta:
      "Atualmente, o acesso às receitas requer conexão com a internet. No entanto, você pode baixar suas receitas favoritas em formato PDF para consultá-las offline a qualquer momento.",
  },
];

async function popularBanco() {
  try {
    await SobreApp.deleteMany();
    await SobreApp.insertMany(dados);
    console.log("Banco populado com sucesso!");
  } catch (error) {
    console.error("Erro ao popular o banco:", error);
  } finally {
    mongoose.connection.close();
  }
}

popularBanco();
