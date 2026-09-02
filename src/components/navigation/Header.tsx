'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X, Puzzle, Sparkles, CirclePlus, Trophy, LayoutGrid, Compass, LogOut, UserCircle, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/components/auth/AuthProvider'
import { cn } from '@/lib/utils'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const { user, loading, signOut } = useAuth()

  const displayName = user?.user_metadata?.username
    || user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || 'Player'

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const navLinks: Array<{ href: string; label: string; icon?: LucideIcon }> = [
    { href: '/create', label: 'Create', icon: CirclePlus },
    { href: '/daily', label: 'Daily Puzzle', icon: Sparkles },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/categories', label: 'Categories', icon: LayoutGrid },
    { href: '/explore/weekly', label: 'Explore', icon: Compass },
  ]

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Puzzle className="h-7 w-7 text-foreground transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-display text-[26px] font-semibold leading-none tracking-tight text-foreground">
              Jigsaw<span className="text-accent">World</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary dark:hover:bg-secondary/50"
              >
                {link.icon ? <link.icon className="w-4 h-4 mr-2" /> : null}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center">
            <div className={cn(
              "relative transition-all duration-300",
              isSearchFocused ? "w-72" : "w-56"
            )}>
              <Input
                type="text"
                placeholder="Search puzzles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full rounded-md border-border bg-card/60 pl-4 pr-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/40"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer disabled:cursor-default disabled:opacity-50 transition-opacity"
                disabled={!searchQuery.trim()}
              >
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {loading ? (
              <div className="h-9 w-28 rounded-lg bg-secondary animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground">
                  <UserCircle className="h-4 w-4 text-primary" />
                  <span className="max-w-28 truncate">{displayName}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="btn-shine">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary dark:hover:bg-secondary/50 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border dark:border-white/10">
            <div className="px-2 py-4 space-y-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search puzzles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border-border bg-card pl-4 pr-10 text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer disabled:cursor-default disabled:opacity-50 transition-opacity"
                    disabled={!searchQuery.trim()}
                  >
                    <Search className="h-4 w-4 text-muted-foreground dark:text-slate-500" />
                  </button>
                </div>
              </form>

              {/* Mobile Nav Links */}
              <Link
                href="/create"
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-secondary dark:hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <CirclePlus className="w-4 h-4 mr-2 text-primary" />
                Create
              </Link>
              <Link
                href="/daily"
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-secondary dark:hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Sparkles className="w-4 h-4 mr-2 text-accent" />
                Daily Puzzle
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-secondary dark:hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                Leaderboard
              </Link>
              <Link 
                href="/categories" 
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-secondary dark:hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/explore/weekly"
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-secondary dark:hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>

              <div className="border-t border-border dark:border-white/10 pt-3 mt-3">
                {loading ? (
                  <div className="h-10 rounded-lg bg-secondary animate-pulse" />
                ) : user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground">
                      <UserCircle className="h-4 w-4 text-primary" />
                      <span className="truncate">{displayName}</span>
                    </div>
                    <Button variant="outline" className="w-full dark:bg-transparent" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full dark:bg-transparent">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
