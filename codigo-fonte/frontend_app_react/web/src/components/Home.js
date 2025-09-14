import React from "react";
import { Link } from "react-router-dom";
import BannerImage from '../images/banner.jpg';
import Header from "./Header";
import Footer from "./Footer";
import '../styles/Home.css';

function getImagePath(categoria, index) {
  try {
    return require(`../images/${categoria}${index}.jpg`);
  } catch (error) {
    console.error(`Imagem não encontrada: ${categoria}${index}.jpg`);
    return null;
  }
}

const categorias = ['Doces', 'Carnes', 'Massas', 'Vegetariano'];

function Home() {
  return (
    <div className="Home">
      <Header />

      <div
        className="headerContainer"
        style={{
          backgroundImage: `url(${BannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
        }}
      >
        <h1>CookBook</h1>
        <Link to="/Resultados">
          <button>Categorias</button>
        </Link>
      </div>


      <div className="Receitas">
        {categorias.map((categoria) => (
          <div className="receitasContainer" key={categoria}>
            <div className="receitasHeader">
              <h2>{categoria}</h2>
              <Link to={`/Resultados?tipo_receita=${categoria}`}>
                <p>Ver mais →</p>
              </Link>
            </div>
            <ul className="receitas_items">
              {[1, 2, 3, 4].map((index) => {
                const imgSrc = getImagePath(categoria, index);
                return (
                  <li className="receitas_item" key={index}>
                    <Link to="">
                      {imgSrc ? (
                        <img src={imgSrc} alt={`receita ${categoria} ${index}`} />
                      ) : (
                        <p>Imagem não encontrada</p>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default Home;
