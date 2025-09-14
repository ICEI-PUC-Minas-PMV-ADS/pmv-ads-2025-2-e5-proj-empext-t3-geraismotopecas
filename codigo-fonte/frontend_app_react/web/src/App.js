import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Profile from "./components/Profile";

import EditProfile from "./components/EditProfile";
import Cadastrar from "./components/Cadastrar";

import Home from "./components/Home";
import SobreApp from "./components/SobreApp";


import "./styles/Login.css";
import "./styles/Profile.css";

import "./styles/SobreApp.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/cadastrar" element={<Cadastrar />} />


        <Route path="/sobre" element={<SobreApp />} />
   >
      </Routes>
    </Router>
  );
};

export default App;