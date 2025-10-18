import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

const queryClient = new QueryClient();

async function prepare() {
  // ✅ Only enable MSW in development/localhost
  const isDevelopment = import.meta.env.DEV || 
                        window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
  
  if (isDevelopment) {
    try {
      const { worker } = await import("./api/mswServer");
      await worker.start({
        serviceWorker: {
          url: "/mockServiceWorker.js",
        },
        onUnhandledRequest: "bypass",
        quiet: false,
      });
      console.log("✅ MSW worker started");
    } catch (error) {
      console.error("❌ MSW failed to start:", error);
    }
  } else {
    console.log("ℹ️ Running in production mode - MSW disabled");
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  );
}

prepare();
