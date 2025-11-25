import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.js";
import { AuthProvider } from "./context/AuthContext.jsx"; // ⬅ import

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider theme={theme}>
    <AuthProvider> 
      <App />
    </AuthProvider>
  </ChakraProvider>
);