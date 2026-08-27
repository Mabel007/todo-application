import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";

import "./index.css";
import { AppProviders } from "./providers/AppProviders";
import router from "./routes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </React.StrictMode>,
);
