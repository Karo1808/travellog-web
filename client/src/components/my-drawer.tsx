import { useLocationStore } from "@/hooks/useLocationStore";
import { useMenuStore } from "@/hooks/useMenuStore";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useEffect } from "react";
import { Drawer, type ContentProps } from "vaul";

const menuVariants = cva(
  "bg-background fixed z-50 flex  flex-col max-h-[90vh] rounded-t-[10px] mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none z-100 w-full",
  {
    variants: {
      variant: {
        create: "p-10",
        view: "p-0 border-0",
      },
    },
  },
);

type MenuVariant = VariantProps<typeof menuVariants>["variant"];

interface MyDrawerProps extends ContentProps {
  menuVariant: MenuVariant;
  thumbClassName?: string;
}

const MyDrawer = ({
  className,
  children,
  menuVariant,
  thumbClassName,
  ...props
}: MyDrawerProps) => {
  const isOpen = useMenuStore((s) => s.isOpen);
  const closeMenu = useMenuStore((s) => s.toggle);
  const menu = useMenuStore((state) => state.mode);
  const selectedId = useLocationStore((state) => state.currentLocationId);

  return (
    <Drawer.Root
      open={isOpen}
      key={`${menu}:${selectedId}`}
      onOpenChange={closeMenu}
      modal={false}
    >
      <Drawer.Portal>
        <Drawer.Title className="hidden"></Drawer.Title>

        <Drawer.Content
          className={cn(menuVariants({ variant: menuVariant, className }))}
          {...props}
        >
          <div
            className={cn(
              "bg-muted absolute left-1/2 top-2  h-2 w-[100px] -translate-x-1/2 rounded-full block z-1000",
              thumbClassName,
            )}
          />
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default MyDrawer;
