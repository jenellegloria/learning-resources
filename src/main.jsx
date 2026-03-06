import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import KantApp from "./tools/kant-categorical-imperative/KantApp";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/kant-categorical-imperative" element={<KantApp />} />
        {/* Add future tools here:
        <Route path="/trolley-problem" element={<TrolleyApp />} />
        <Route path="/social-contract" element={<SocialContractApp />} />
        */}
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
