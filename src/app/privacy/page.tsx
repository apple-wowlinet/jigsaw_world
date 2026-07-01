import Link from 'next/link'
import { Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

const lastUpdated = 'July 1, 2026'

const sections = [
  {
    title: 'Information We Collect',
    body: (
      <>
        <p>
          We collect information you provide directly to us, such as when you create an account,
          contact us, or otherwise interact with the service. This may include your name, email
          address, and any content you submit.
        </p>
        <p className="mt-3">
          We also collect certain information automatically, including:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 mt-3">
          <li>Device and browser information (type, version, language).</li>
          <li>Usage data, such as puzzles played, progress, and time spent.</li>
          <li>Cookies and similar technologies (see the Cookies section below).</li>
        </ul>
      </>
    ),
  },
  {
    title: 'How We Use Your Information',
    body: (
      <>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 space-y-1.5 mt-3">
          <li>Provide, maintain, and improve the service.</li>
          <li>Personalize your experience and recommend puzzles.</li>
          <li>Communicate with you about updates, support, and announcements.</li>
          <li>Monitor and analyze trends, usage, and performance.</li>
          <li>Detect, prevent, and address technical issues, fraud, or abuse.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Cookies',
    body: (
      <>
        <p>
          We use cookies and similar technologies to remember your preferences (such as theme or
          language), keep you signed in, and understand how the service is used. You can control
          cookies through your browser settings; disabling them may limit some features.
        </p>
      </>
    ),
  },
  {
    title: 'Data Sharing',
    body: (
      <>
        <p>
          We do not sell your personal information. We may share information with service providers
          who perform work on our behalf (such as hosting or analytics), under confidentiality
          obligations. We may also disclose information when required by law or to protect our
          rights and safety.
        </p>
      </>
    ),
  },
  {
    title: 'Data Security',
    body: (
      <>
        <p>
          We use reasonable administrative, technical, and physical safeguards designed to protect
          your information. However, no method of transmission or storage is completely secure, and
          we cannot guarantee absolute security.
        </p>
      </>
    ),
  },
  {
    title: 'Your Rights',
    body: (
      <>
        <p>Depending on your location, you may have the right to:</p>
        <ul className="list-disc pl-6 space-y-1.5 mt-3">
          <li>Access the personal information we hold about you.</li>
          <li>Request correction or deletion of your information.</li>
          <li>Opt out of certain data processing or marketing communications.</li>
          <li>Withdraw consent where processing relies on it.</li>
        </ul>
        <p className="mt-3">
          To exercise these rights, please contact us using the details on our Contact page.
        </p>
      </>
    ),
  },
  {
    title: 'Children\u2019s Privacy',
    body: (
      <>
        <p>
          The service is not directed to children under 13 (or the equivalent minimum age in the
          applicable jurisdiction), and we do not knowingly collect personal information from them.
          If you believe a child has provided us with personal information, please contact us so we
          can delete it.
        </p>
      </>
    ),
  },
  {
    title: 'Changes to This Policy',
    body: (
      <>
        <p>
          We may update this Privacy Policy from time to time. When we do, we will revise the
          &ldquo;Last updated&rdquo; date above. We encourage you to review this page periodically to
          stay informed about how we protect your information.
        </p>
      </>
    ),
  },
  {
    title: 'Contact Us',
    body: (
      <>
        <p>
          If you have any questions about this Privacy Policy, please{' '}
          <Link href="/contact" className="text-primary dark:text-primary-400 hover:underline">
            contact us
          </Link>
          .
        </p>
      </>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-[#08080c] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-subtle dark:bg-primary/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground dark:text-gray-500">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Intro */}
        <p className="text-lg text-muted-foreground dark:text-gray-400 leading-relaxed mb-12 animate-fade-in">
          This Privacy Policy explains how JigsawWorld (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or
          &ldquo;our&rdquo;) collects, uses, and protects your information when you use our website
          and services (the &ldquo;service&rdquo;). By using the service, you agree to the practices
          described below.
        </p>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <section key={i} className="animate-fade-in">
              <h2 className="text-xl md:text-2xl font-semibold text-foreground dark:text-white mb-4">
                {section.title}
              </h2>
              <div className="text-muted-foreground dark:text-gray-400 leading-relaxed space-y-3">
                {section.body}
              </div>
            </section>
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-16 text-center animate-fade-in">
          <Link href="/">
            <Button variant="outline" className="cursor-pointer dark:bg-transparent">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
