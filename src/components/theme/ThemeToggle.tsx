'use client'

import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  variant?: 'icon' | 'dropdown'
}

export function ThemeToggle({ className, variant = 'icon' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()

  if (variant === 'dropdown') {
    return (
      <div className={cn("relative group", className)}>
        <button
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-secondary dark:bg-[#0f172a]/80 border border-transparent dark:border-white/10 hover:bg-secondary/80 dark:hover:bg-primary/10 dark:hover:border-primary/30 transition-colors shadow-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          aria-label="Toggle theme"
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="h-4 w-4 text-primary" />
          ) : (
            <Sun className="h-4 w-4 text-secondary-foreground" />
          )}
        </button>
        
        <div className="absolute top-full right-0 mt-2 w-40 bg-popover dark:bg-[#0f172a] border border-border dark:border-white/10 rounded-lg shadow-lg dark:shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-1">
            <button
              onClick={() => setTheme('light')}
              className={cn(
                "w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors",
                theme === 'light' ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
              )}
            >
              <Sun className="h-4 w-4" />
              <span>Light</span>
              {theme === 'light' && <span className="ml-auto">✓</span>}
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={cn(
                "w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors",
                theme === 'dark' ? "bg-primary/15 text-primary dark:bg-primary/20 dark:text-primary" : "hover:bg-accent/50 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
              )}
            >
              <Moon className="h-4 w-4" />
              <span>Dark</span>
              {theme === 'dark' && <span className="ml-auto">✓</span>}
            </button>
            <button
              onClick={() => setTheme('system')}
              className={cn(
                "w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors",
                theme === 'system' ? "bg-accent text-accent-foreground dark:bg-primary/20 dark:text-primary" : "hover:bg-accent/50 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
              )}
            >
              <Monitor className="h-4 w-4" />
              <span>System</span>
              {theme === 'system' && <span className="ml-auto">✓</span>}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center justify-center w-9 h-9 rounded-lg bg-secondary dark:bg-[#0f172a]/80 border border-transparent dark:border-white/10 hover:bg-secondary/80 dark:hover:bg-primary/10 dark:hover:border-primary/30 transition-all duration-200 hover:scale-105 shadow-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className
      )}
      aria-label="Toggle theme"
      title={`Theme: ${theme} (click to toggle)`}
    >
      {resolvedTheme === 'dark' ? (
        <Moon className="h-4 w-4 text-primary transition-transform duration-200" />
      ) : (
        <Sun className="h-4 w-4 text-secondary-foreground transition-transform duration-200" />
      )}
    </button>
  )
}
