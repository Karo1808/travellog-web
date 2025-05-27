import { Button } from "./ui/button";
import { Popover, PopoverAnchor, PopoverContent } from "./ui/popover";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PopoverProps } from "@radix-ui/react-popover";
import { useMenuStore } from "@/hooks/useMenuStore";
import { cva, type VariantProps } from "class-variance-authority";

const menuVariants = cva("w-120 h-[80vh] flex flex-col overflow-y-hidden", {
  variants: {
    variant: {
      create: "p-10",
      view: "p-0 border-0",
    },
  },
});

const buttonVariants = cva(
  "absolute top-3 right-3 w-6 h-6 p-1 rounded-sm  [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        create: "hover:bg-gray-100 text-fg/50",
        view: "bg-black/40 text-background [&_svg:not([class*='size-'])]:size-3 h-7 w-7 rounded-full hover:bg-black/60 hover:text-background",
      },
    },
  },
);

type MenuVariant = VariantProps<typeof menuVariants>["variant"];
type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

interface MenuProps extends PopoverProps {
  menuVariant: MenuVariant;
  buttonVariant: ButtonVariant;
  buttonClass?: string;
  children: React.ReactNode;
  className?: string;
}

const Menu = ({
  menuVariant,
  buttonVariant,
  className,
  buttonClass,
  children,
  ...popoverProps
}: MenuProps) => {
  const isMenuOpen = useMenuStore((s) => s.isOpen);
  const closeMenu = useMenuStore((s) => s.close);

  return (
    <Popover open={isMenuOpen} onOpenChange={closeMenu} {...popoverProps}>
      <PopoverAnchor asChild>
        <div
          aria-hidden
          className="fixed bottom-[10%] right-30 z-50 min-w-max"
        />
      </PopoverAnchor>

      <PopoverContent
        side="right"
        align="end"
        className={cn(menuVariants({ variant: menuVariant, className }))}
      >
        <Button
          variant="ghost"
          className={cn(
            buttonVariants({ variant: buttonVariant, className: buttonClass }),
          )}
          onClick={closeMenu}
          type="button"
        >
          <X />
        </Button>
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default Menu;
