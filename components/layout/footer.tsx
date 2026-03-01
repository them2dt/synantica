/**
 * Simple universal footer component
 * Contains only essential elements: name, copyright, Instagram link, and "Made with..."
 */
export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200">
      <div className="mx-auto w-full max-w-[1100px] px-6 py-8">
        <div className="flex justify-between items-center gap-4">
          {/* Brand Name */}
          <div className="flex items-center">
            <span className="font-heading text-xl text-slate-950">
              Synantica
            </span>
          </div>

          {/* Copyright and Made with */}
          <div className="flex flex-row items-center gap-2 text-sm text-slate-500">
            <span>© {new Date().getFullYear()} Synantica</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
