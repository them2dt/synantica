import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const themedTextVariants = cva(
    "transition-colors",
    {
        variants: {
            variant: {
                // Headings (Instrument Serif)
                h1: "font-heading text-4xl md:text-6xl leading-tight",
                h2: "font-heading text-3xl md:text-5xl leading-tight",
                h3: "font-heading text-2xl md:text-4xl leading-snug",
                h4: "font-heading text-xl md:text-3xl leading-snug",
                h5: "font-heading text-lg md:text-2xl leading-normal",

                // Geist sizes
                xs: "font-sans text-xs",
                sm: "font-sans text-sm",
                base: "font-sans text-base",
                lg: "font-sans text-lg",
                xl: "font-sans text-xl",
                "2xl": "font-sans text-2xl",
                "3xl": "font-sans text-3xl",
                "4xl": "font-sans text-4xl",
                "4xl-black": "font-sans text-4xl font-black",
            },
            color: {
                default: "text-slate-950 dark:text-slate-50",
                muted: "text-slate-500 dark:text-slate-400",
                secondary: "text-slate-600 dark:text-slate-300",
                error: "text-red-600 dark:text-red-400",
                white: "text-slate-50",
            }
        },
        defaultVariants: {
            variant: "base",
            color: "default",
        },
    }
)

export interface ThemedTextProps
    extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof themedTextVariants> {
    as?: React.ElementType
}

function ThemedText({
    className,
    variant,
    color,
    as: Component = "span",
    ...props
}: ThemedTextProps) {
    // Automatically use appropriate tag for headings if 'as' is not provided
    const FinalComponent = variant && ["h1", "h2", "h3", "h4", "h5"].includes(variant as string)
        ? (variant as React.ElementType)
        : Component

    return (
        <FinalComponent
            className={cn(themedTextVariants({ variant, color, className }))}
            {...props}
        />
    )
}

export { ThemedText, themedTextVariants }
