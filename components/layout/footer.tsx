import { Logo } from '@/components/ui/logo'

/**
 * Simple universal footer component
 * Contains only essential elements: name, copyright, Instagram link, and "Made with..."
 */
export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto w-full max-w-[1100px] px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Brand Name */}
          <div className="flex items-center">
            <Logo size="md" />
          </div>

          {/* Center Section - Instagram Link and Theme Switcher */}


          {/* Copyright and Made with */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} Synantica</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-muted-foreground">
              Built by{' '}
              <a 
                href="https://www.maruthan.com/" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Maruthan
              </a>
              {' '}for{' '}
              <a 
                href="https://visioncatalyzer.com" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                VisionCatalyzer
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
