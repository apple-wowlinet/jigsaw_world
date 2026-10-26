import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'Learn how JigsawWorld uses cookies and local storage for sign-in, puzzle progress, preferences, and analytics, and how to manage them.',
}

const lastUpdated = 'October 26, 2026'
const linkClassName =
  'text-primary underline underline-offset-4 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring'

const sections = [
  {
    id: 'what-are-cookies',
    title: 'What Are Cookies?',
    body: (
      <p>
        Cookies are small text files stored by your browser when you visit a website. They help
        websites remember information between visits. Similar technologies, such as local storage,
        save information in your browser without sending it with every request.
      </p>
    ),
  },
  {
    id: 'how-we-use-storage',
    title: 'How We Use Cookies and Local Storage',
    body: (
      <ul className="list-disc space-y-3 pl-6 marker:text-primary">
        <li>
          <strong className="font-semibold text-foreground">Sign-in cookies.</strong> Our
          authentication provider, Supabase, uses cookies to support sign-in and maintain your
          account session.
        </li>
        <li>
          <strong className="font-semibold text-foreground">Preferences.</strong> Local storage
          remembers your theme, sound, and piece rotation settings in this browser.
        </li>
        <li>
          <strong className="font-semibold text-foreground">Puzzle progress.</strong> Local storage
          keeps saved puzzle progress so you can resume a puzzle in the same browser.
        </li>
        <li>
          <strong className="font-semibold text-foreground">Analytics.</strong> We use Microsoft
          Clarity to understand how visitors interact with the website and identify areas to
          improve. Clarity may use cookies and similar technologies as part of its analytics.
        </li>
      </ul>
    ),
  },
  {
    id: 'third-party-services',
    title: 'Third-Party Services',
    body: (
      <p>
        Supabase provides our authentication service, and Microsoft Clarity provides website
        analytics. These services process information as part of their operation. For more about
        how JigsawWorld handles personal information, please read our{' '}
        <Link href="/privacy" className={linkClassName}>Privacy Policy</Link>.
      </p>
    ),
  },
  {
    id: 'storage-duration',
    title: 'How Long Information Is Stored',
    body: (
      <p>
        Cookies can expire at the end of a browser session or remain until their expiration date
        or until you delete them. Local preferences and saved puzzle progress remain in this
        browser until they are updated or removed, including when you clear site data. Storage
        is specific to the browser and device you use.
      </p>
    ),
  },
  {
    id: 'your-choices',
    title: 'Managing Cookies and Site Data',
    body: (
      <>
        <p>
          You can review, block, or delete cookies through your browser settings. Look for privacy,
          cookies, or site data settings to manage information stored for JigsawWorld. Local
          storage is usually managed through the same site data settings.
        </p>
        <p>
          Blocking authentication cookies may prevent you from signing in or staying signed in.
          Clearing site data can reset your preferences and remove locally saved puzzle progress.
          Deleting cookies alone may leave local storage in place.
        </p>
      </>
    ),
  },
  {
    id: 'policy-updates',
    title: 'Changes to This Policy',
    body: (
      <p>
        We may update this Cookie Policy as the website and the technologies we use change. The
        date above shows when this page was last updated.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Us',
    body: (
      <p>
        If you have questions about cookies or browser storage on JigsawWorld, please{' '}
        <Link href="/contact" className={linkClassName}>contact us</Link>.
      </p>
    ),
  },
]

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1380px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <article className="mx-auto max-w-3xl" aria-labelledby="cookie-policy-title">
          <header className="mb-12 text-center hero-rise">
            <p className="label-caps mb-5 text-primary">Your Privacy</p>
            <h1
              id="cookie-policy-title"
              className="mb-5 font-display text-[3.4rem] font-semibold leading-[1.02] text-foreground lg:text-[4.3rem]"
            >
              Cookie <span className="italic text-accent">Policy</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: <time dateTime="2026-10-26">{lastUpdated}</time>
            </p>
          </header>

          <div className="mb-12 rounded-lg border border-border bg-card p-6 shadow-[0_10px_30px_-22px_rgba(80,60,25,0.4)] sm:p-8">
            <p className="font-display text-[22px] leading-8 text-foreground">
              A little memory for a more thoughtful puzzle experience.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              This Cookie Policy explains how JigsawWorld uses cookies and similar technologies
              when you browse and play, and how you can manage the information stored in your
              browser.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.id} aria-labelledby={section.id}>
                <div className="mb-4 flex items-center gap-5">
                  <h2 id={section.id} className="font-display text-2xl font-semibold leading-tight text-foreground sm:text-[28px]">
                    {section.title}
                  </h2>
                  <span aria-hidden="true" className="h-px min-w-6 flex-1 bg-border" />
                </div>
                <div className="space-y-3 text-[15px] leading-7 text-muted-foreground sm:text-base">
                  {section.body}
                </div>
              </section>
            ))}
          </div>

          <nav aria-label="Related policies" className="mt-12 flex flex-wrap gap-3 border-t border-border pt-8">
            <Link href="/privacy" className="btn btn-outline btn-md">Privacy Policy</Link>
            <Link href="/terms" className="btn btn-outline btn-md">Terms of Service</Link>
          </nav>
        </article>
      </div>
    </div>
  )
}
