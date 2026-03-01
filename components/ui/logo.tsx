/**
 * Application logo component with icon and text
 * Supports various sizes and orientations
 */

import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

/**
 * Props for the Logo component
 */
interface LogoProps {
  /** Size of the logo */
  size?: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "xxxxl";
  /** Whether to show only the icon */
  iconOnly?: boolean;
  /** Additional class names for the container */
  className?: string;
  /** Whether the logo is a link */
  isLink?: boolean;
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * Main Logo component
 */
export function Logo({
  size = "md",
  iconOnly = false,
  className,
  onClick,
}: LogoProps) {
  const sizeClasses = {
    sm: {
      icon: "w-6 h-6 text-lg",
      text: "text-lg",
      container: "gap-2",
    },
    md: {
      icon: "w-8 h-8 text-xl",
      text: "text-xl",
      container: "gap-2",
    },
    lg: {
      icon: "w-12 h-12 text-2xl",
      text: "text-2xl",
      container: "gap-3",
    },
    xl: {
      icon: "w-16 h-16 text-3xl",
      text: "text-3xl",
      container: "gap-4",
    },
    xxl: {
      icon: "w-20 h-20 text-4xl",
      text: "text-4xl",
      container: "gap-5",
    },
    xxxl: {
      icon: "w-24 h-24 text-5xl",
      text: "text-5xl",
      container: "gap-6",
    },
    xxxxl: {
      icon: "w-28 h-28 text-6xl",
      text: "text-6xl",
      container: "gap-7",
    },
  };

  const currentSize = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md;

  return (
    <div
      className={cn(
        "flex items-center font-bold tracking-tighter text-slate-950",
        currentSize.container,
        onClick && "cursor-pointer select-none",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-center bg-slate-950 p-1">
        <Zap
          className={cn("text-slate-50 fill-current", currentSize.icon)}
          strokeWidth={2.5}
        />
      </div>
      {!iconOnly && (
        <span className={cn("font-medium lowercase", currentSize.text)}>
          synantica
        </span>
      )}
    </div>
  );
}
