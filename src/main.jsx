import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import KantApp from "./tools/kant-categorical-imperative/KantApp";
import UtilityCalculator from "./tools/utility-calculator/utility-calculator-plain";
import GoldenMeanActivity from "./tools/aristotle-golden-mean/golden-mean-activity";
import TrolleyProblemLab from "./tools/trolley-problem/trolley-problem-lab";
import AristotleApp from "./tools/aristotle-final-end/aristotle-final-end";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/kant-categorical-imperative" element={<KantApp />} />
        <Route path="/utility-calculator" element={<UtilityCalculator />} />
        <Route path="/aristotle-golden-mean" element={<GoldenMeanActivity />} />
        <Route path="/trolley-problem" element={<TrolleyProblemLab />} />
        <Route path="/aristotle-final-end" element={<AristotleApp />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
