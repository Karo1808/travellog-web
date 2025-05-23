import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

interface CapsuleProps extends ComponentPropsWithoutRef<"div"> {}

const Capsule = ({ children, className, ...props }: CapsuleProps) => {
  return (
    <div
      {...props}
      className={cn(
        "bg-background flex flex-col shadow-md rounded-md text-primary w-8",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Capsule;
