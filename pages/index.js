"use client"
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";
import { FocusProvider } from "./contexts/FocusContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <FocusProvider>
    <App />
  </FocusProvider>
);
