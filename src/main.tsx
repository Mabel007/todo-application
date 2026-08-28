import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";

import { env } from "./config/env";

import "./index.css";
import { AppProviders } from "./providers/AppProviders";
import router from "./routes";

console.info("Runtime configuration validated successfully", {
  apiBaseUrl: env.apiBaseUrl,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </React.StrictMode>,
);
