This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Event administration

Apply `supabase/migrations/009_event_puzzles.sql`, then configure these server-only
environment variables in `.env.local` or the deployment environment:

```bash
ADMIN_TOKEN=<a-long-random-admin-token>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` through a `NEXT_PUBLIC_` variable. Restart
the application, then open:

```text
http://localhost:3000/admin/events?admin_token=<your-admin-token>
```

The same token is validated by both the server-rendered management page and its
write APIs. Because the token appears in the URL, avoid sharing screenshots or
URLs from the administration page.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Contact messages

Apply `supabase/migrations/018_contact_messages.sql` in the Supabase SQL editor.
This single migration creates the storage-only contact table, permissions,
indexes and submission function; it includes no email notification fields.
The table has RLS enabled and no anonymous or signed-in user grants. The server
service role has SELECT and INSERT permissions for persistence, deduplication
and rate limiting. Optional rollback-only database checks are in
`supabase/checks/contact_security.sql`.

Configure the following **server-only** variable in `.env.local` and your hosting
environment, then restart the application:

```dotenv
SUPABASE_SERVICE_ROLE_KEY=<Supabase service role key>
```

The existing `NEXT_PUBLIC_SUPABASE_URL` must also be configured. Never prefix
the service role key with `NEXT_PUBLIC_` or commit its actual value.

View messages directly in the Supabase dashboard: open **Table Editor →
public.contact_messages**. Use the `status` column (`new` / `resolved`) to track
handling. Contact messages do not require an `ADMIN_TOKEN` or a website
administration page.

The contact form reports success only after database persistence. It does not
send email. The page also offers a `mailto:support@jigsawworld.co` link so visitors
can send email directly using their own mail client. No email service or sender
configuration is required.

Submissions are limited to three per email and per sender in ten minutes, using
an atomic database function. Sender addresses are stored only as keyed hashes.
On Vercel the sender bucket uses its trusted forwarding header; outside Vercel
all senders share a conservative bucket until a trusted proxy is configured.
Unchanged retries reuse the submission ID, preventing duplicate saved messages
when a response is lost.

Run isolated checks (no real database writes):

```bash
node --test scripts/verify-contact.mjs
```

Manual acceptance after configuration: send a message from `/contact` and confirm
it appears in Supabase's `public.contact_messages` table. If saving fails, the
form must keep the input and show an error. The email link should open the
visitor's own mail client addressed to `support@jigsawworld.co`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
