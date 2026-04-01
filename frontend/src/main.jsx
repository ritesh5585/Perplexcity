import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.jsx";
import { Provider } from "react-redux";
import {store} from "./app/app.store.js";
import { ThemeProvider } from "./features/Theme/Theme.jsx";
import applyTheme from "./features/Theme/Theme.jsx";
import "./index.css";

const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme !== "light"); // default dark

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
