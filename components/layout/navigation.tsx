'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AuthNav } from './auth-nav'
import { NavigationLinks } from './navigation-links'
import { ThemedText } from '@/components/ui/themed-text'
import { ThemeToggle } from './theme-toggle'

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between border-b border-slate-200 md:border-x dark:border-slate-800">
        <div className="flex items-center gap-6 py-4 md:py-0">
          <ThemedText variant="h5" className="pl-4">
            Synantica
          </ThemedText>
          <div className="hidden md:block">
            <NavigationLinks />
          </div>
        </div>

        {/* Desktop Auth & Theme */}
        <div className="hidden md:flex items-center gap-2 pr-4 md:pr-0">
          <ThemeToggle />
          <AuthNav />
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden pr-4 flex items-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-slate-700" />
          ) : (
            <Menu className="w-6 h-6 text-slate-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-slate-50 absolute top-full left-0 right-0 w-full flex flex-col p-4 shadow-lg space-y-4 dark:border-slate-800 dark:bg-slate-950 dark:shadow-slate-950/50">
          <NavigationLinks vertical />
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <ThemedText variant="sm" color="muted">Theme</ThemedText>
              <ThemeToggle />
            </div>
            <AuthNav />
          </div>
        </div>
      )}
    </header>
  )
}
