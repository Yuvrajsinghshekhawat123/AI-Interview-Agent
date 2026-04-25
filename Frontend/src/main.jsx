import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux"; // ✅ IMPORTANT
import "./index.css";
import App from "./App.jsx";
import { store, persistor } from "./00-app/00-store.js";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </StrictMode>
  </Provider>,
);
