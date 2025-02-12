import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./styles/tailwind.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {" "}
        {/* ✅ Envolvemos la app con el contexto */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
