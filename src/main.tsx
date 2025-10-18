import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

const queryClient = new QueryClient();

async function prepare() {
  // ✅ Check if we're NOT in production (works for both dev and preview)
  if (typeof window !== 'undefined' && (import.meta.env.DEV || window.location.hostname === 'localhost')) {
    try {
      const { worker } = await import("./api/mswServer");
      await worker.start({
        serviceWorker: {
          url: "/mockServiceWorker.js",
        },
        onUnhandledRequest: "bypass",
        quiet: false, // Show MSW logs
      });
      console.log("✅ MSW worker started successfully");
    } catch (error) {
      console.error("❌ Failed to start MSW:", error);
    }
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