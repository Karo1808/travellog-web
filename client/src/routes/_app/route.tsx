import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth";
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { LogIn, LogOut } from "lucide-react";
import { locationOptions } from "@/api/queries/locationOptions";
import MyMap from "@/components/map";

export const Route = createFileRoute("/_app")({
  loader: (opts) => {
    opts.context.queryClient.ensureQueryData(
      locationOptions.locations(opts.context.auth?.isAuthenticated!),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const tabStyleLeft = {
    clipPath: `polygon(0% 0%, 100% 0%, calc(100% - 64px) 100%, 0% 100%)`,
  };

  const tabStyleRight = {
    clipPath: `polygon(0% 0%, 100% 0%, 100% 100%, 64px 100%)`,
  };

  const handleLogout = () => {
    logout();
    navigate({
      to: "/auth/login",
    });
  };

  return (
    <div className={`relative bg-background`}>
      <div
        style={tabStyleLeft}
        className="absolute left-[-20px] -top-0 flex w-max items-center gap-2 bg-background px-3 py-2 shadow-sm z-10"
      >
        <Link to="/">
          <Logo className="w-48" />
        </Link>
      </div>

      <div
        style={tabStyleRight}
        className="absolute right-0 -top-0 flex w-max items-start gap-2 bg-background px-5 py-2 shadow-sm z-10"
      >
        <Button
          onClick={handleLogout}
          size="icon"
          variant="ghost"
          className="bg-transparent text-5xl ml-8 hover:cursor-pointer"
        >
          {isAuthenticated ? (
            <LogOut width={50} color="#d97706" />
          ) : (
            <LogIn width={50} color="#d97706" />
          )}
        </Button>
      </div>

      <div className="p-3">
        <>
          <MyMap />
          <Outlet />
        </>
      </div>
    </div>
  );
}
