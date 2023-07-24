import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./app.css";

const container = document.getElementById("xynity-blocks-main-container");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);
