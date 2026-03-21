import { StrictMode } from "react";
import { Chart as ChartJS, LinearScale, LineElement, PointElement, CategoryScale, Tooltip } from 'chart.js';
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./api/interceptors";
import App from "./App.tsx";

ChartJS.register(LinearScale, LineElement, PointElement, CategoryScale, Tooltip);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
