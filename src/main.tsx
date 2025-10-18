import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

const queryClient = new QueryClient();

async function prepare() {
  // ✅ ALWAYS enable MSW (even in production for demo purposes)
  try {
    const { worker } = await import("./api/mswServer");
    await worker.start({
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
      onUnhandledRequest: "bypass",
      quiet: false,
    });
    console.log("✅ MSW worker started successfully");
  } catch (error) {
    console.error("❌ MSW failed to start:", error);
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