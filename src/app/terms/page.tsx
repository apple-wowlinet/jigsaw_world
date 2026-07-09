import Link from 'next/link'

const lastUpdated = 'July 1, 2026'

const sections = [
  {
    title: 'Acceptance of Terms',
    body: (
      <p>
        By accessing or using JigsawWorld (the &ldquo;service&rdquo;), you agree to be bound by
        these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, please do
        not use the service.
      </p>
    ),
  },
  {
    title: 'Use of the Service',
    body: (
      <>
        <p>You may use the service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
        <ul className="list-disc pl-6 space-y-1.5 mt-3">
          <li>Use the service in any way that violates applicable laws or regulations.</li>
          <li>Attempt to gain unauthorized access to any part of the service, its systems, or networks.</li>
          <li>Interfere with or disrupt the service, servers, or networks connected to it.</li>
          <li>Use automated systems (bots, scrapers) to extract data without permission.</li>
          <li>Reproduce, duplicate, or resell the service without authorization.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Accounts',
    body: (
      <p>
        Some features may require you to create an account. You are responsible for maintaining the
        confidentiality of your account credentials and for all activities under your account. You
        agree to notify us immediately of any unauthorized use. Account features are optional and
        may change over time.
      </p>
    ),
  },
  {
    title: 'Intellectual Property',
    body: (
      <p>
        The service and its original content, features, and functionality (including software,
        text, graphics, and design) are owned by JigsawWorld and its licensors and are protected by
        copyright, trademark, and other laws. Puzzle images may be provided by third parties and
        remain the property of their respective owners.
      </p>
    ),
  },
  {
    title: 'Prohibited Conduct',
    body: (
      <>
        <p>You may not misuse the service. Prohibited conduct includes, but is not limited to:</p>
        <ul className="list-disc pl-6 space-y-1.5 mt-3">
          <li>Uploading or transmitting harmful, offensive, or infringing content.</li>
          <li>Impersonating another person or entity.</li>
          <li>Collecting personal data of other users without consent.</li>
          <li>Engaging in any conduct that could damage or impair the service.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'User Content',
    body: (
      <p>
        If the service allows you to submit content (such as feedback or custom puzzles), you retain
        ownership of that content but grant us a worldwide, non-exclusive, royalty-free license to
        use, display, and process it solely to operate and improve the service. You represent that
        you have all necessary rights to submit your content.
      </p>
    ),
  },
  {
    title: 'Disclaimers',
    body: (
      <p>
        The service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis
        without warranties of any kind, whether express or implied. We do not warrant that the
        service will be uninterrupted, secure, or error-free, or that any information is accurate or
        reliable.
      </p>
    ),
  },
  {
    title: 'Limitation of Liability',
    body: (
      <p>
        To the fullest extent permitted by law, JigsawWorld and its affiliates shall not be liable
        for any indirect, incidental, special, consequential, or punitive damages, or any loss of
        data, arising out of or related to your use of (or inability to use) the service.
      </p>
    ),
  },
  {
    title: 'Governing Law',
    body: (
      <p>
        These Terms are governed by and construed in accordance with applicable law, without regard
        to conflict-of-law principles. You agree to the exclusive jurisdiction of the competent
        courts for resolving any disputes arising from these Terms.
      </p>
    ),
  },
  {
    title: 'Changes to These Terms',
    body: (
      <p>
        We may revise these Terms from time to time. When we do, we will update the
        &ldquo;Last updated&rdquo; date above. Your continued use of the service after changes take
        effect constitutes acceptance of the revised Terms.
      </p>
    ),
  },
  {
    title: 'Contact Us',
    body: (
      <p>
        If you have questions about these Terms, please{' '}
        <Link href="/contact" className="text-primary dark:text-primary-400 hover:underline">
          contact us
        </Link>
        .
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-[#08080c] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground dark:text-gray-500">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Intro */}
        <p className="text-lg text-muted-foreground dark:text-gray-400 leading-relaxed mb-12 animate-fade-in">
          Welcome to JigsawWorld. These Terms of Service govern your use of our website and services.
          Please read them carefully before using the service.
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
      </div>
    </div>
  )
}
