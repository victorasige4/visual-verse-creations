import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StudioConsole } from "./console/StudioConsole";
import "./tt-travels.css";
import "./console/console.css";

const root = document.getElementById("vv-console-root");
if (root) createRoot(root).render(<StrictMode><StudioConsole /></StrictMode>);
