import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import "./index.css";

const GOOGLE_CLIENT_ID =
  "955841381765-v6evs9gqe6dpv8vp5e5t6unf7vb96rb6.apps.googleusercontent.com";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={GOOGLE_CLIENT_ID}
    >
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
