import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BannerImage from "../images/banner.jpg";
import "../styles/SobreApp.css";

function SobreApp() {
  const [perguntas, setPerguntas] = useState([]);
  const [respostaVisivel, setRespostaVisivel] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/sobre")
      .then((res) => setPerguntas(res.data))
      .catch((err) => console.error("Erro ao buscar perguntas:", err));
  }, []);

  const toggleResposta = (index) => {
    setRespostaVisivel((prev) => (prev === index ? null : index));
  };

  return (
    <>
      <Header />

      <div
        className="sobre-banner"
        style={{ backgroundImage: `url(${BannerImage})` }}
      ></div>

      <div className="sobre-texto">
        <h2>Bem-vindo(a) ao CookBook!</h2>
        <p>
          Este é o espaço para você conhecer ainda mais sobre nossa solução. É
          só selecionar a pergunta com sua dúvida abaixo e aproveitar!
        </p>
      </div>

      <div className="sobre-conteudo">

        <div className="sobre-dropdown">
          {perguntas.map((item, index) => (
            <div key={index}>
              <button onClick={() => toggleResposta(index)}>
                {item.pergunta}
              </button>
              {respostaVisivel === index && (
                <div className="sobre-resposta">{item.resposta}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default SobreApp;
