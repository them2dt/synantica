/**
 * Simple universal footer component
  * Contains only essential elements: name, copyright, Instagram link, and "Made with..."
    */
import { ThemedText } from '@/components/ui/themed-text'

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200">
      <div className="mx-auto w-full max-w-[1100px] px-6 py-8">
        <div className="flex justify-between items-center gap-4">
          {/* Brand Name */}
          <div className="flex items-center">
            <ThemedText variant="h5">
              Synantica
            </ThemedText>
          </div>

          {/* Copyright and Made with */}
          <div className="flex flex-row items-center gap-2">
            <ThemedText variant="sm" color="muted">
              © {new Date().getFullYear()} Synantica
            </ThemedText>
          </div>
        </div>
      </div>
    </footer>
  )
}
