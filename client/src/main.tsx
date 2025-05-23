import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import { getContext } from "./providers/react-query.tsx";
import { AuthProvider, useAuth } from "./providers/auth.tsx";
import { Toaster } from "@/components/ui/sonner";

import TanstackQuery from "@/providers/react-query.tsx";
import { MapProvider } from "react-map-gl/mapbox";

export const router = createRouter({
  routeTree,
  context: {
    ...getContext(),
    auth: undefined!,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  const rqCtx = getContext();
  return <RouterProvider router={router} context={{ auth, ...rqCtx }} />;
}

function App() {
  return (
    <TanstackQuery>
      <AuthProvider>
        <MapProvider>
          <InnerApp />
        </MapProvider>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </TanstackQuery>
  );
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
