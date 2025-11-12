import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import Cadastrar from "./components/Cadastrar";
import Home from "./components/Home";
import PrivateRoute from "./components/PrivateRouter";

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
import DetalhesGarantias from "./components/DetalhesGarantias";
import DetalhesProdutos from "./components/DetalhesProdutos";
import DetalhesServicos from "./components/DetalhesServicos";

import "./styles/Login.css";
import "./styles/Profile.css";

import { Outlet } from "react-router-dom";

const LayoutWrapper = () => <Outlet />;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastrar" element={<Cadastrar />} />

        <Route path="/home" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>} />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>} />
        <Route
          path="/editProfile"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />

        {/* Produtos */}
        <Route path="/produtos" element={<LayoutWrapper />}>
          <Route index element={
            <PrivateRoute>
              <Produtos />
            </PrivateRoute>
          } />
          <Route path="cadastro" element={
            <PrivateRoute>
              <CadastroProdutos />
            </PrivateRoute>
          } />
          <Route path="editar/:id" element={
            <PrivateRoute>
              <EditarProdutos />
            </PrivateRoute>
          } />
          <Route path=":id" element={
            <PrivateRoute>
              <DetalhesProdutos />
            </PrivateRoute>
          } />
        </Route>

        {/* Serviços */}
        <Route path="/servicos" element={<LayoutWrapper />}>
          <Route index element={
            <PrivateRoute>
              <Servicos />
            </PrivateRoute>
          } />
          <Route path="cadastro" element={
            <PrivateRoute>
              <CadastroServicos />
            </PrivateRoute>
          } />
          <Route path="editar/:id" element={
            <PrivateRoute>
              <EditarServicos />
            </PrivateRoute>
          } />
          <Route path=":id" element={
            <PrivateRoute>
              <DetalhesServicos />
            </PrivateRoute>
          } />
        </Route>

        {/* Garantias */}
        <Route path="/garantias" element={<LayoutWrapper />}>
          <Route index element={
            <PrivateRoute>
              <Garantias />
            </PrivateRoute>
          } />
          <Route path="cadastro" element={
            <PrivateRoute>
              <CadastroGarantias />
            </PrivateRoute>
          } />
          <Route path="editar/:id" element={
            <PrivateRoute>
              <EditarGarantias />
            </PrivateRoute>
          } />
          <Route path=":id" element={
            <PrivateRoute>
              <DetalhesGarantias />
            </PrivateRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
