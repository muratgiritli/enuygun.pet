import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Remove prerendered SEO shell when React hydrates so content is not duplicated on screen
const pre = document.getElementById("seo-pre");
if (pre) pre.remove();

createRoot(document.getElementById("root")!).render(<App />);
