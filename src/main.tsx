import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Ensure root element fills viewport
const root = document.getElementById("root");
if (root) {
  root.style.width = '100vw';
  root.style.height = '100vh';
  root.style.margin = '0';
  root.style.padding = '0';
  root.style.overflow = 'hidden';
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
