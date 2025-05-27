import CreateMenu from "@/components/create-menu";
import EditMenu from "@/components/edit-menu";
import Menu from "@/components/menu";
import MobileMenu from "@/components/mobile-menu";
import ViewMenu from "@/components/view-menu";
import ViewMenuSkeleton from "@/components/view-menu-skeleton";
import { useMenuStore } from "@/hooks/useMenuStore";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { useMediaQuery } from "react-responsive";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const mode = useMenuStore((state) => state.mode);
  const isMobile = useMediaQuery({ maxWidth: 1000 });

  return (
    <>
      {isMobile ? (
        <>
          {mode === "create" && (
            <MobileMenu menuVariant={"create"}>
              <CreateMenu />
            </MobileMenu>
          )}

          {mode === "view" && (
            <MobileMenu thumbClassName="bg-muted/50" menuVariant={"view"}>
              <Suspense fallback={<ViewMenuSkeleton />}>
                <ViewMenu />
              </Suspense>
            </MobileMenu>
          )}

          {mode === "edit" && (
            <MobileMenu menuVariant={"create"}>
              <Suspense fallback={<ViewMenuSkeleton />}>
                <EditMenu />
              </Suspense>
            </MobileMenu>
          )}
        </>
      ) : (
        <>
          {mode === "create" && (
            <Menu menuVariant="create" buttonVariant="create">
              <CreateMenu />
            </Menu>
          )}

          {mode === "view" && (
            <Menu menuVariant="view" buttonVariant="view">
              <Suspense fallback={<ViewMenuSkeleton />}>
                <ViewMenu />
              </Suspense>
            </Menu>
          )}

          {mode === "edit" && (
            <Menu menuVariant="create" buttonVariant="create">
              <Suspense fallback={<ViewMenuSkeleton />}>
                <EditMenu />
              </Suspense>
            </Menu>
          )}
        </>
      )}
    </>
  );
}
