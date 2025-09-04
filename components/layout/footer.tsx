import { Instagram } from 'lucide-react'

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
          <div className="text-lg font-semibold">
            Synantica
          </div>

          {/* Instagram Link */}
          <a 
            href="https://instagram.com/synantica" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Instagram className="w-4 h-4" />
            <span className="text-sm">@synantica</span>
          </a>

          {/* Copyright and Made with */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} Synantica</span>
            <span className="hidden sm:inline">•</span>
            <span>Made with ❤️ for students</span>
          </div>
        </div>
      </div>
    </footer>
  )
}