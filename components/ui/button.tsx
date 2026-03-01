import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "bg-black text-white hover:opacity-90 active:opacity-85",
                destructive: "bg-red-600 text-white hover:opacity-90 active:opacity-85",
                outline: "border border-slate-200 bg-white text-neutral-950 hover:bg-slate-100/60",
                secondary: "bg-slate-50 text-slate-600 hover:bg-slate-100/70",
                ghost: "text-neutral-950 hover:bg-slate-100/60",
                link: "text-neutral-950 underline-offset-4 hover:underline",
                black: "bg-black text-white hover:opacity-90",
            },
            size: {
                default: "h-11 px-4 py-2",
                sm: "h-9 px-3 text-xs",
                lg: "h-12 px-6 text-base",
                icon: "h-11 w-11",
                "icon-sm": "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        if (asChild) {
            return (
                <Comp
                    className={cn(buttonVariants({ variant, size, className }))}
                    ref={ref}
                    {...props}
                />
            );
        }

        const {
            onDrag,
            onDragStart,
            onDragEnd,
            onAnimationStart,
            onAnimationEnd,
            onAnimationIteration,
            onTransitionEnd,
            ...motionProps
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } = props as any;

        // Suppress unused variable warnings for destructured event handlers
        void onDrag;
        void onDragStart;
        void onDragEnd;
        void onAnimationStart;
        void onAnimationEnd;
        void onAnimationIteration;
        void onTransitionEnd;

        return (
            <motion.button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...motionProps}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
