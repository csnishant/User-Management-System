import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom"; // ✅ Add this import
import { UserProvider } from "./context/UserContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <UserProvider>
      <StrictMode>
        <BrowserRouter>
          {" "}
          {/* Wrap App with Router */}
          <App />
        </BrowserRouter>
      </StrictMode>
    </UserProvider>
  </AuthProvider>,
);
