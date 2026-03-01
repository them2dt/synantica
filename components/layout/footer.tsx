import { Logo } from '@/components/ui/logo'

/**
 * Simple universal footer component
 * Contains only essential elements: name, copyright, Instagram link, and "Made with..."
 */
export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto w-full max-w-[1100px] px-6 py-8">
        <div className="flex justify-between items-center gap-4">
          {/* Brand Name */}
          <div className="flex items-center">
            <Logo size="md" />
          </div>

          {/* Center Section - Instagram Link and Theme Switcher */}

          {/* Copyright and Made with */}
          <div className="flex flex-row items-center gap-2 text-sm text-slate-500">
            <span>© {new Date().getFullYear()} Synantica</span>
            <span>•</span>
            <span className="text-slate-500">
              Built by{' '}
              <a href="https://www.maruthan.com/" className="text-slate-500 hover:opacity-80 transition-opacity">
                Maruthan
              </a>
              {' '}for{' '}
              <a href="https://visioncatalyzer.com" className="text-slate-500 hover:opacity-80 transition-opacity">
                VisionCatalyzer
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
