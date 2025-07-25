import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client"; // ✅ ঠিক এখানেই মূল পার্থক্য

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";

import { base_path } from "./environment.jsx";
import "../src/style/css/feather.css";
import "../src/style/css/line-awesome.min.css";
import "../src/style/scss/main.scss";
import "../src/style/icons/fontawesome/css/fontawesome.min.css";
import "../src/style/icons/fontawesome/css/all.min.css";

import { Provider } from "react-redux";
import store from "./core/redux/store.jsx";
import AllRoutes from "./Router/router.jsx";
import { AuthProvider } from "./hooks/AuthProvider.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PosProvider } from "./hooks/PosProvider.jsx";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <PosProvider>
          <Provider store={store}>
            <BrowserRouter basename={base_path}>
              <>
                <AllRoutes />
                <ToastContainer
                  position="bottom-right"
                  autoClose={1500}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
              </>
            </BrowserRouter>
          </Provider>
        </PosProvider>
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error("Element with id 'root' not found.");
}
