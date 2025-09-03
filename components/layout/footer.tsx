import { ReactNode } from 'react'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { cn } from '@/lib/utils'

/**
 * Props for the Footer component
 */
interface FooterProps {
  /** Additional CSS classes */
  className?: string
  /** Whether to show the theme switcher */
  showThemeSwitcher?: boolean
  /** Custom content to display in the footer */
  children?: ReactNode
  /** Copyright text */
  copyright?: string
  /** Footer links */
  links?: Array<{
    href: string
    label: string
  }>
}

/**
 * Reusable Footer component
 * Provides consistent footer across all pages
 */
export function Footer({
  className,
  showThemeSwitcher = true,
  children,
  copyright = "© 2024 Synentica. All rights reserved.",
  links = [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" }
  ]
}: FooterProps) {
  return (
    <footer className={cn(
      'w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16',
      className
    )}>
      <div className="flex items-center gap-8">
        <p className="text-muted-foreground">
          {copyright}
        </p>
        
        {links.length > 0 && (
          <div className="flex items-center gap-4">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
        
        {showThemeSwitcher && <ThemeSwitcher />}
        
        {children}
      </div>
    </footer>
  )
}
