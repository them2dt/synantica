import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-none border px-2 py-0.5 text-[11px] leading-4 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-slate-200 bg-slate-50 text-slate-600",
                secondary: "border-slate-200 bg-slate-50 text-slate-600",
                processing: "border-transparent bg-amber-100 text-amber-800",
                error: "border-transparent bg-red-50 text-red-600",
                success: "border-transparent bg-emerald-500/15 text-emerald-600",
                destructive: "border-transparent bg-red-600 text-white",
                outline: "border-slate-200 text-neutral-950",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
