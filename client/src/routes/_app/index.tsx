import { locationOptions } from "@/api/queries/locationOptions";
import CreateMenu from "@/components/create-menu";
import MyMap from "@/components/map";
import Menu from "@/components/menu";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_app/")({
  loader: (opts) =>
    opts.context.queryClient.ensureQueryData(locationOptions.locations()),
  component: App,
});

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [location, setLocation] = useState<string | undefined>();

  return (
    <>
      <MyMap setIsMenuOpen={setIsMenuOpen} setLocation={setLocation} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <CreateMenu
          location={location}
          onClose={() => {
            setIsMenuOpen(false);
          }}
        />
      </Menu>
    </>
  );
}
