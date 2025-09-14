// src/components/Footer.js
import React from "react";
import "../styles/Footer.css";
import logoImage from "../images/logolivro.png"; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="logo">
        <img src={logoImage} alt="Logo do CookBook" />
      </div>

      <div className="footer-center">
        <div className="footer-info">
          <span className="dot"></span>
          <div>
            <strong>Entre em contato</strong>
            <br />
            <span>danielasoares@gmail.com</span>
          </div>
        </div>
        <div className="footer-info">
          <span className="dot"></span>
          <div>
            <span>Rua Bonfica, bairro Jaçanã nº15</span>
            <br />
            <span>cep: 03589-000</span>
          </div>
        </div>
      </div>

      <div className="footer-right">
        <i className="fa-brands fa-instagram"></i>
        <i className="fa-brands fa-facebook"></i>
        <i className="fa-brands fa-pinterest"></i>
        <i className="fa-brands fa-tiktok"></i>
      </div>
    </footer>
  );
};

export default Footer;
