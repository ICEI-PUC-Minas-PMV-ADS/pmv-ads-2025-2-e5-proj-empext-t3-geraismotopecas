import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import '../styles/Home.css';

function Home() {
  return (
    <div className="Home">
      <Header />
      <div className="development-container">
        <h1>Em desenvolvimento</h1>
      </div>

    </div>
  );
}

export default Home;
