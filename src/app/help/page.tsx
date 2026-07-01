import Link from 'next/link'
import { HelpCircle, Puzzle, Users, Monitor, Pause, ArrowRight, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const faqs = [
  {
    q: 'How do I start a puzzle?',
    a: 'Browse the home page or categories, pick a puzzle, and click Play Now. The puzzle loads automatically — just drag pieces to assemble it. Pieces snap together when placed correctly.',
  },
  {
    q: 'Can I change the number of pieces?',
    a: 'Yes. On the play page, use the piece-count dropdown in the top bar to choose a different difficulty (e.g. fewer pieces for an easier run). The puzzle rebuilds instantly with your selection.',
  },
  {
    q: 'Pieces won\u2019t snap together — what\u2019s wrong?',
    a: 'Pieces only snap when their edges are close enough to the correct position. Try dragging the piece nearer to where it belongs. You can also toggle the reference image (eye icon) to see a faint guide of the final picture.',
  },
  {
    q: 'How do I pause or reset a game?',
    a: 'Use the Pause button in the top bar to pause the timer and interaction. The reset button (circular arrow) reshuffles the pieces and restarts the current puzzle.',
  },
  {
    q: 'Which browsers are supported?',
    a: 'JigsawWorld works on modern browsers: Chrome, Firefox, Safari, and Edge (latest versions). Both mouse and touch are supported, so it works on desktop, tablet, and mobile.',
  },
  {
    q: 'Do I need an account to play?',
    a: 'No account is required to play puzzles. Account features (saving progress, leaderboards) are optional and coming soon.',
  },
]

const faqIcons = [Puzzle, HelpCircle, Puzzle, Pause, Monitor, Users]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-[#08080c] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-subtle dark:bg-primary/20 flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white tracking-tight mb-4">
            Help Center
          </h1>
          <p className="text-lg text-muted-foreground dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Find quick answers to common questions. Can&apos;t find what you&apos;re looking for? Reach out to our team.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {faqs.map((faq, i) => {
            const Icon = faqIcons[i % faqIcons.length]
            return (
              <Card
                key={i}
                className="group overflow-hidden border border-border/50 dark:border-white/10 shadow-sm hover:shadow-lg dark:bg-[#121218]/50 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-subtle dark:bg-primary/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground dark:text-white mb-2">
                        {faq.q}
                      </h3>
                      <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 rounded-2xl bg-card/80 dark:bg-[#121218]/90 border border-border/50 dark:border-white/10 shadow-sm">
            <p className="text-lg font-medium text-foreground dark:text-white">
              Still need help?
            </p>
            <div className="flex gap-3">
              <Link href="/contact">
                <Button className="btn-shine cursor-pointer">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="cursor-pointer dark:bg-transparent">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
