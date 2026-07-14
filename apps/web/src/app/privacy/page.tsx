import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — ToolNest",
  description:
    "ToolNest privacy policy. Learn how we handle your data — spoiler: we barely collect any.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy — ToolNest",
    description:
      "ToolNest privacy policy. Learn how we handle your data — spoiler: we barely collect any.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ToolNest Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "June 28, 2025";
const CONTACT_EMAIL = "hello@toolnest.app";
const SITE_NAME = "ToolNest";
const SITE_URL = "https://toolnest.app";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Last updated: {LAST_UPDATED}
        </p>
        <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-4 text-sm text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800/40 dark:text-emerald-300">
          <strong>Short version:</strong> Most tools run entirely in your
          browser. We don&apos;t store your files or personal data. We use
          analytics to understand traffic, and ads to keep the site free.
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-400">
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            1. Who we are
          </h2>
          <p>
            {SITE_NAME} (
            <a href={SITE_URL} className="text-indigo-600 hover:underline">
              {SITE_URL}
            </a>
            ) is an online tools platform built and operated by Uddhav Shrimali.
            If you have any questions about this policy, contact us at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-indigo-600 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            2. What data we collect
          </h2>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-2">
            Data we do NOT collect
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Files you upload or process — all processing happens in your
              browser
            </li>
            <li>Account information — there are no accounts</li>
            <li>
              Passwords you generate — generated locally, never transmitted
            </li>
            <li>Text you type into tools — processed client-side only</li>
          </ul>

          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-2">
            Data we do collect
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Analytics data</strong> — page views, session duration,
              referrer, browser type, and country via Google Analytics. This is
              anonymized and aggregated.
            </li>
            <li>
              <strong>Cookies</strong> — set by Google Analytics and Google
              AdSense for analytics and advertising purposes.
            </li>
            <li>
              <strong>IP address</strong> — collected by our hosting provider
              (Vercel) for security and performance. Not stored by us.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            3. How we use data
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To understand which tools are most useful and improve them</li>
            <li>To measure site performance and fix technical issues</li>
            <li>To serve relevant advertisements via Google AdSense</li>
          </ul>
          <p className="mt-3">
            We do not sell, rent, or share your data with third parties for
            their marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            4. Cookies
          </h2>
          <p>
            We use cookies for analytics (Google Analytics) and advertising
            (Google AdSense). You can opt out of Google Analytics by installing
            the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            .
          </p>
          <p className="mt-2">
            You can also disable personalized ads in your{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Google Ad Settings
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            5. Third-party services
          </h2>
          <div className="space-y-3">
            {[
              {
                name: "Google Analytics",
                purpose: "Website traffic analytics",
                link: "https://policies.google.com/privacy",
              },
              {
                name: "Google AdSense",
                purpose: "Display advertising",
                link: "https://policies.google.com/privacy",
              },
              {
                name: "Vercel",
                purpose: "Website hosting and CDN",
                link: "https://vercel.com/legal/privacy-policy",
              },
              {
                name: "Buy Me a Coffee",
                purpose: "Voluntary donations",
                link: "https://www.buymeacoffee.com/privacy-policy",
              },
            ].map((s) => (
              <div
                key={s.name}
                className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex-1">
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {s.name}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {" "}
                    — {s.purpose}
                  </span>
                </div>
                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 hover:underline shrink-0"
                >
                  Privacy policy
                </a>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            6. Your rights (GDPR / CCPA)
          </h2>
          <p>If you are in the EU or California, you have the right to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Access data we hold about you (we hold very little)</li>
            <li>Request deletion of any personal data</li>
            <li>Opt out of data collection via analytics opt-out tools</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email us at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-indigo-600 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            7. Children&apos;s privacy
          </h2>
          <p>
            ToolNest is not directed at children under 13. We do not knowingly
            collect personal information from children. If you believe a child
            has provided us with personal information, please contact us
            immediately.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            8. Changes to this policy
          </h2>
          <p>
            We may update this policy occasionally. When we do, we&apos;ll
            update the &quot;Last updated&quot; date at the top. Continued use
            of the site after changes constitutes acceptance of the updated
            policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            9. Contact
          </h2>
          <p>
            Questions? Email us at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-indigo-600 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            or find us on{" "}
            <a
              href="https://x.com/toolnest_app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              X (Twitter)
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 text-sm">
        <Link href="/terms" className="text-indigo-600 hover:underline">
          Terms of Service
        </Link>
        <Link href="/about" className="text-indigo-600 hover:underline">
          About ToolNest
        </Link>
        <Link href="/" className="text-indigo-600 hover:underline">
          ← Back to tools
        </Link>
      </div>
    </div>
  );
}
