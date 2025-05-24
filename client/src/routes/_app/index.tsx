import CreateMenu from "@/components/create-menu";
import Menu from "@/components/menu";
import ViewMenu from "@/components/view-menu";
import ViewMenuSkeleton from "@/components/view-menu-skeleton";
import { useMenuStore } from "@/hooks/useMenuStore";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const mode = useMenuStore((state) => state.mode);

  return (
    <>
      {mode === "create" && (
        <Menu menuVariant={"create"} buttonVariant={"create"}>
          <CreateMenu />
        </Menu>
      )}
      {mode == "view" && (
        <Menu menuVariant={"view"} buttonVariant={"view"}>
          <Suspense fallback={<ViewMenuSkeleton />}>
            <ViewMenu />
          </Suspense>
        </Menu>
      )}
    </>
  );
}
