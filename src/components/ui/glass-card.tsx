import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative bg-slate-950/40 border border-white/10 rounded-xl backdrop-blur-xl",
          "shadow-[0_0_15px_rgba(0,0,0,0.5)]",
          "[box-shadow:_inset_0_0_20px_rgba(255,255,255,0.02)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
