import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ETLPipelineDashboard from "@/pages/ETLPipelineDashboard";
import "@/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ETLPipelineDashboard />} />
        {/* add more routes later if needed */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
