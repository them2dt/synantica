import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "bg-slate-950 text-slate-50 hover:opacity-90 active:opacity-85 dark:bg-slate-50 dark:text-slate-950",
                destructive: "bg-red-600 text-slate-50 hover:opacity-90 active:opacity-85 dark:bg-red-500",
                outline: "border border-slate-200 bg-slate-50 text-slate-950 hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-900",
                secondary: "bg-slate-50 text-slate-600 hover:bg-slate-100/70 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800",
                ghost: "text-slate-950 hover:bg-slate-100/60 dark:text-slate-50 dark:hover:bg-slate-900",
                link: "text-slate-950 underline-offset-4 hover:underline dark:text-slate-50",
                black: "bg-slate-950 text-slate-50 hover:opacity-90 dark:bg-slate-50 dark:text-slate-950",
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

interface ButtonProps
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
