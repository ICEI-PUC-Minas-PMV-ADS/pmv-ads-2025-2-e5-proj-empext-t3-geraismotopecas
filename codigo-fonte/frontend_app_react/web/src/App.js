import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Profile from "./components/Profile";

import EditProfile from "./components/EditProfile";
import Cadastrar from "./components/Cadastrar";

import Home from "./components/Home";

import Servicos from "./components/Servicos";
import Produtos from "./components/Produtos";
import Garantias from "./components/Garantias";
import CadastroServicos from "./components/CadastroServicos";
import CadastroProdutos from "./components/CadastroProdutos";
import CadastroGarantias from "./components/CadastroGarantias";
import EditarServicos from "./components/EditarServicos";
import EditarProdutos from "./components/EditarProdutos";
import EditarGarantias from "./components/EditarGarantias";

import "./styles/Login.css";
import "./styles/Profile.css";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/cadastrar" element={<Cadastrar />} />
        <Route path="/Servicos" element={<Servicos />} />
        <Route path="/Produtos" element={<Produtos />} />
        <Route path="/Garantias" element={<Garantias />} />
        <Route path="/CadastroServicos" element={<CadastroServicos />} />
        <Route path="/CadastroProdutos" element={<CadastroProdutos />} />
        <Route path="/CadastroGarantias" element={<CadastroGarantias />} />
        <Route path="/EditarServicos/:id" element={<EditarServicos />} />
        <Route path="/EditarProdutos/:id" element={<EditarProdutos />} />
        <Route path="/EditarGarantias/:id" element={<EditarGarantias />} />




      </Routes>
    </Router>
  );
};

export default App;