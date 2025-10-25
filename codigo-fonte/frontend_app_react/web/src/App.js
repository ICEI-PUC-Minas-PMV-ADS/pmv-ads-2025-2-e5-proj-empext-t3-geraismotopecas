import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import Cadastrar from "./components/Cadastrar";
import Home from "./components/Home";

// Paginas principais
import Servicos from "./components/Servicos";
import Produtos from "./components/Produtos";
import Garantias from "./components/Garantias";

// Subpaginas
import CadastroServicos from "./components/CadastroServicos";
import CadastroProdutos from "./components/CadastroProdutos";
import CadastroGarantias from "./components/CadastroGarantias";
import EditarServicos from "./components/EditarServicos";
import EditarProdutos from "./components/EditarProdutos";
import EditarGarantias from "./components/EditarGarantias";

import "./styles/Login.css";
import "./styles/Profile.css";

import { Outlet } from "react-router-dom";

const LayoutWrapper = () => <Outlet />;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/cadastrar" element={<Cadastrar />} />

        {/* Produtos */}
        <Route path="/produtos" element={<LayoutWrapper />}>
          <Route index element={<Produtos />} /> 
          <Route path="cadastro" element={<CadastroProdutos />} /> 
          <Route path="editar/:id" element={<EditarProdutos />} /> 
        </Route>

        {/* Serviços */}
        <Route path="/servicos" element={<LayoutWrapper />}>
          <Route index element={<Servicos />} /> 
          <Route path="cadastro" element={<CadastroServicos />} /> 
          <Route path="editar/:id" element={<EditarServicos />} /> 
        </Route>

        {/* Garantias */}
        <Route path="/garantias" element={<LayoutWrapper />}>
          <Route index element={<Garantias />} />
          <Route path="cadastro" element={<CadastroGarantias />} /> 
          <Route path="editar/:id" element={<EditarGarantias />} /> 
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
