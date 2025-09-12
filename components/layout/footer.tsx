import { Instagram } from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Logo } from '@/components/ui/logo'

/**
 * Simple universal footer component
 * Contains only essential elements: name, copyright, Instagram link, and "Made with..."
 */
export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Brand Name */}
          <div className="flex items-center">
            <Logo size="md" />
          </div>

          {/* Center Section - Instagram Link and Theme Switcher */}
          <div className="flex items-center gap-4">
            <a 
              href="https://instagram.com/synantica" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
              title="@synantica"
            >
              <Instagram className="w-4 h-4" />
            </a>
            
            {/* Theme Switcher */}
            <ThemeSwitcher />
          </div>

          {/* Copyright and Made with */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} Synantica</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-muted-foreground">
              Built by{' '}
              <a 
                href="https://www.gabrieledutli.com/" 
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                Gabriele
              </a>
              {' '}&{' '}
              <a 
                href="https://maruthan.com" 
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                Maruthan
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}