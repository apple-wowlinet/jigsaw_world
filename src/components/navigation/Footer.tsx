import Link from 'next/link'
import { Puzzle, Mail, Github, Twitter, Instagram } from 'lucide-react'

const footerLinks = {
  categories: [
    { href: '/category/nature', label: 'Nature' },
    { href: '/category/ocean', label: 'Ocean' },
    { href: '/category/city', label: 'City' },
    { href: '/category/forest', label: 'Forest' },
    { href: '/category/art', label: 'Art' },
  ],
  explore: [
    { href: '/daily', label: 'Daily Puzzle' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/explore/weekly', label: 'Most Played This Week' },
    { href: '/explore/all-time', label: 'Most Played All Time' },
    { href: '/explore/trending', label: 'Trending' },
  ],
  support: [
    { href: '/help', label: 'Help Center' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
}

const socialLinks = [
  { href: '#', icon: Twitter, label: 'Twitter' },
  { href: '#', icon: Instagram, label: 'Instagram' },
  { href: '#', icon: Github, label: 'GitHub' },
  { href: '#', icon: Mail, label: 'Email' },
]

export function Footer() {
  return (
    <footer className="bg-muted/30 dark:bg-[#050508] border-t border-border dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 group mb-4">
              <div className="relative p-1">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <Puzzle className="relative h-8 w-8 text-primary transition-transform duration-300 group-hover:rotate-12" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
                JigsawWorld
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              The best place to play jigsaw puzzles online. Challenge yourself with thousands of beautiful puzzles across various categories.
            </p>
            {/* Social Links */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-background dark:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-white/10 hover:shadow-lg transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Categories</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Explore</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border dark:border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} JigsawWorld. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
