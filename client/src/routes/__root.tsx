import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import type { QueryClient } from "@tanstack/react-query";
import type { useAuth } from "@/providers/auth";

interface MyRouterContext {
  queryClient: QueryClient;
  auth: ReturnType<typeof useAuth> | undefined;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      {/* <TanStackRouterDevtools />
      <ReactQueryDevtools buttonPosition="bottom-right" /> */}
    </>
  ),
});
