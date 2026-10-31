'use client'

import { useState } from 'react'
import { Mail, Clock, Send, CheckCircle2, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { CONTACT_EMAIL } from '@/lib/contact'
import Link from 'next/link'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sending) return
    setError('')
    if (!form.name.trim() || !form.message.trim()) {
      setError('Please enter your name and message.')
      return
    }
    const id = submissionId ?? crypto.randomUUID()
    setSubmissionId(id)
    setSending(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Could not send your message. Please try again.')
      setSubmitted(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Connection failed. Please try again.')
    } finally {
      setSending(false)
    }
  }

  function updateForm(field: keyof typeof form, value: string) {
    setForm(current => ({ ...current, [field]: value }))
    setSubmissionId(null)
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
          <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Have a question, suggestion, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>

        <a href={`mailto:${CONTACT_EMAIL}`} className="mb-12 flex items-center justify-center gap-3 rounded-xl border border-border/50 bg-card p-6 text-primary hover:underline dark:border-white/10 dark:bg-[#121218]/50">
          <Mail className="h-5 w-5" aria-hidden="true" />
          {CONTACT_EMAIL}
        </a>

        {/* Response time note */}
        <div className="flex items-center justify-center gap-2 mb-12 text-sm text-muted-foreground dark:text-gray-400 animate-fade-in">
          <Clock className="w-4 h-4" />
          <span>Leave a message here, or email us directly using the address above.</span>
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
                  Your message has been saved. Thank you for your feedback.
                </p>
                <Button
                  variant="outline"
                  className="cursor-pointer dark:bg-transparent"
                  onClick={() => {
                    setSubmitted(false)
                    setSubmissionId(null)
                    setError('')
                    setForm({ name: '', email: '', message: '' })
                  }}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" aria-busy={sending}>
                <fieldset disabled={sending} className="space-y-5 disabled:opacity-70">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground dark:text-white mb-2">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      autoComplete="name"
                      maxLength={100}
                      required
                      value={form.name}
                      onChange={(e) => updateForm('name', e.target.value)}
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
                      name="email"
                      autoComplete="email"
                      maxLength={254}
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
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
                      name="message"
                      maxLength={5000}
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => updateForm('message', e.target.value)}
                      placeholder="How can we help?"
                      className={cn(
                        'flex w-full rounded-lg border border-input bg-background px-3 py-2',
                        'text-sm ring-offset-background placeholder:text-muted-foreground',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        'transition-all duration-200 hover:border-primary/50 resize-none dark:bg-transparent'
                      )}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your name, email and message will be stored so we can handle your request.{' '}
                    <Link href="/privacy" className="text-primary underline">Privacy policy</Link>
                  </p>
                  {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                    <Button type="submit" size="lg" className="btn-shine cursor-pointer w-full sm:w-auto">
                      {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                      {sending ? 'Sending…' : 'Send Message'}
                    </Button>
                  </div>
                </fieldset>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
