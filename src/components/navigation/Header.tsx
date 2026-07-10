'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X, Puzzle, Sparkles, ImagePlus, Trophy, LogOut, UserCircle } from 'lucide-react'
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

  const navLinks = [
    { href: '/create', label: 'Create', icon: ImagePlus },
    { href: '/daily', label: 'Daily Puzzle', icon: Sparkles },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/categories', label: 'Categories' },
    { 
      label: 'Explore', 
      children: [
        { href: '/explore/weekly', label: 'Most Played This Week' },
        { href: '/explore/all-time', label: 'Most Played All Time' },
        { href: '/explore/trending', label: 'Trending Searches' },
      ]
    },
  ]

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Puzzle className="h-8 w-8 text-primary transition-transform duration-300 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-primary/20 dark:bg-primary/40 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              JigsawWorld
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              link.children ? (
                <div key={link.label} className="relative group">
                  <button className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary dark:hover:bg-secondary/50">
                    {link.label}
                    <svg className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-popover dark:bg-card border border-border dark:border-white/10 rounded-xl shadow-lg overflow-hidden">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-3 text-sm text-popover-foreground dark:text-foreground hover:bg-accent/10 dark:hover:bg-white/5 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary dark:hover:bg-secondary/50"
                >
                  {link.icon && <link.icon className="w-4 h-4 mr-2" />}
                  {link.label}
                </Link>
              )
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
                className="w-full pl-4 pr-10 bg-secondary dark:bg-[#0f172a]/80 border-transparent dark:border-white/10 text-foreground dark:text-slate-100 placeholder:text-muted-foreground dark:placeholder:text-slate-500 focus:bg-card dark:focus:bg-[#111827] dark:focus:border-primary/50 dark:focus-visible:ring-0 dark:focus-visible:ring-offset-0 dark:focus:shadow-[0_0_0_1px_rgba(96,165,250,0.35),0_0_12px_rgba(96,165,250,0.2)] shadow-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
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
                    Login
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
                    className="w-full pl-4 pr-10 dark:bg-[#0f172a]/80 dark:border-white/10 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-[#111827] dark:focus:border-primary/50 dark:focus-visible:ring-0 dark:focus-visible:ring-offset-0 dark:focus:shadow-[0_0_0_1px_rgba(96,165,250,0.35),0_0_12px_rgba(96,165,250,0.2)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
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
                <ImagePlus className="w-4 h-4 mr-2 text-primary" />
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
              <div className="px-3 py-2">
                <span className="text-sm font-medium text-muted-foreground">Explore</span>
                <div className="mt-2 space-y-1 pl-4">
                  <Link 
                    href="/explore/weekly" 
                    className="block py-1 text-sm text-foreground/80 hover:text-foreground"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Most Played This Week
                  </Link>
                  <Link 
                    href="/explore/all-time" 
                    className="block py-1 text-sm text-foreground/80 hover:text-foreground"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Most Played All Time
                  </Link>
                  <Link 
                    href="/explore/trending" 
                    className="block py-1 text-sm text-foreground/80 hover:text-foreground"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Trending Searches
                  </Link>
                </div>
              </div>

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
