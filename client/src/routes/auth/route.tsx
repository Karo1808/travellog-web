import { authMeOptions } from "@/api/queries/authOptions";
import { getToken } from "@/lib/token";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  beforeLoad: async ({ context }) => {
    const token = getToken();
    if (!token) return;
    const user = await context.queryClient.ensureQueryData(authMeOptions());
    if (user) throw redirect({ to: "/" });
  },
  component: () => <Outlet />,
});
