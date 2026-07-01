'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, MessageCircle, Twitter, Instagram, Github, Clock, Send, CheckCircle2, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const contactChannels = [
  {
    icon: Mail,
    label: 'Email',
    value: 'support@jigsawworld.com',
    hint: 'Best for detailed questions',
  },
  {
    icon: Twitter,
    label: 'Twitter',
    value: '@jigsawworld',
    hint: 'News & quick updates',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@jigsawworld',
    hint: 'See featured puzzles',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'github.com/jigsawworld',
    hint: 'Report issues & feedback',
  },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Static demo: no backend. Just acknowledge submission.
    setSubmitted(true)
  }

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
            <MessageCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Have a question, suggestion, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {contactChannels.map(({ icon: Icon, label, value, hint }) => (
            <Card
              key={label}
              className="group border border-border/50 dark:border-white/10 shadow-sm hover:shadow-lg dark:bg-[#121218]/50 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-subtle dark:bg-primary/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground dark:text-gray-400">{label}</p>
                  <p className="font-semibold text-foreground dark:text-white truncate">{value}</p>
                  <p className="text-xs text-muted-foreground dark:text-gray-500 mt-0.5">{hint}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Response time note */}
        <div className="flex items-center justify-center gap-2 mb-12 text-sm text-muted-foreground dark:text-gray-400 animate-fade-in">
          <Clock className="w-4 h-4" />
          <span>We typically respond within 1–2 business days.</span>
        </div>

        {/* Contact form */}
        <Card className="border border-border/50 dark:border-white/10 shadow-lg dark:bg-[#121218]/50 animate-fade-in">
          <CardContent className="p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success-subtle dark:bg-success/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">
                  Thanks for reaching out!
                </h3>
                <p className="text-muted-foreground dark:text-gray-400 mb-6">
                  Your message has been received. We&apos;ll get back to you soon.
                </p>
                <Button
                  variant="outline"
                  className="cursor-pointer dark:bg-transparent"
                  onClick={() => {
                    setSubmitted(false)
                    setForm({ name: '', email: '', message: '' })
                  }}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground dark:text-white mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="dark:bg-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground dark:text-white mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="dark:bg-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground dark:text-white mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help?"
                    className={cn(
                      'flex w-full rounded-lg border border-input bg-background px-3 py-2',
                      'text-sm ring-offset-background placeholder:text-muted-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      'transition-all duration-200 hover:border-primary/50 resize-none dark:bg-transparent'
                    )}
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <Button type="submit" size="lg" className="btn-shine cursor-pointer w-full sm:w-auto">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Link href="/" className="w-full sm:w-auto">
                    <Button type="button" variant="outline" size="lg" className="cursor-pointer dark:bg-transparent w-full sm:w-auto">
                      Back to Home
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
