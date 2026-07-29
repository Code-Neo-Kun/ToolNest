import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Heart, Coffee, Wrench, Zap, Shield, Code2 } from "lucide-react";
import { UpiCopyButton } from "@/components/ui/UpiCopyButton";
import { TOOLS, CATEGORIES } from "@/lib/tools-registry";

// Branded SVG icons (not in lucide-react v1)
const IconGithub = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const IconTwitterX = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const IconLinkedin = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// UPI icon
const IconUpi = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

export const metadata: Metadata = {
  title: "About — ToolNest",
  description:
    "ToolNest is built by Uddhav Shrimali, a developer who got tired of slow, ad-bloated online tools. Learn the story behind ToolNest.",
};

const stats = [
  { label: "Free Tools", value: `${TOOLS.length}+` },
  { label: "Categories", value: `${Object.keys(CATEGORIES).length}` },
  { label: "Signup Required", value: "Zero" },
  { label: "Files Sent to Server", value: "None" },
];

const values = [
  {
    icon: <Zap className="h-5 w-5 text-indigo-500" />,
    title: "Speed first",
    desc: "Every tool loads in under a second. No spinners, no waiting, no nonsense.",
  },
  {
    icon: <Shield className="h-5 w-5 text-emerald-500" />,
    title: "Privacy by default",
    desc: "Most tools run entirely in your browser. Your files never touch a server.",
  },
  {
    icon: <Code2 className="h-5 w-5 text-purple-500" />,
    title: "Built by a developer",
    desc: "I use these tools myself. If something feels clunky, I fix it.",
  },
  {
    icon: <Heart className="h-5 w-5 text-rose-500" />,
    title: "Always free",
    desc: "The core tools will always be free. No paywalls on essential functionality.",
  },
];

const socialLinks = [
  {
    icon: <IconGithub />,
    label: "GitHub",
    href: "https://github.com/Code-Neo-Kun/ToolNest.git",
    handle: "Code-Neo-Kun",
  },
  {
    icon: <IconLinkedin />,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/uddhav-shrimali-000828284",
    handle: "Uddhav Shrimali",
  },
  {
    icon: <Globe className="h-4 w-4" />,
    label: "Portfolio",
    href: "https://code-neo-portfolio.vercel.app/",
    handle: "My Portfolio",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">

      {/* Hero */}
      <div className="mb-14 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-4xl shadow-lg select-none">
          👨‍💻
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          Hi, I&apos;m Uddhav 👋
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          I got tired of online tools that are slow, covered in ads, and ask you to
          sign up just to format some JSON. So I built ToolNest — a collection of
          fast, clean, free tools that just work.
        </p>

        {/* Social links */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              {s.icon}
              {s.handle}
            </a>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="text-3xl font-extrabold text-indigo-600">{s.value}</div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Story */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5">
          The story behind ToolNest
        </h2>
        <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            As a developer, I use online tools every single day — image compressors,
            JSON formatters, Base64 encoders, password generators. The problem? Most
            of them are either covered in pop-up ads, painfully slow, or gate basic
            features behind a login.
          </p>
          <p>
            I wanted a single place where I could open a tool and use it immediately.
            No signup. No ads blocking the UI. No uploading files to some random
            server I don&apos;t trust. Just the tool, doing its job, fast.
          </p>
          <p>
            That&apos;s ToolNest. I build and maintain it in my spare time. Every tool
            is something I personally use or have needed at some point. If there&apos;s
            a tool you want that&apos;s missing, reach out — I genuinely read every
            message.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5">
          What ToolNest stands for
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <div
              key={v.title}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700">
                {v.icon}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{v.title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Support / Donate */}
      <section className="mb-14" id="support">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-8 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-800/40">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-amber-200/40 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-orange-200/40 blur-2xl" />

          <div className="relative text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 shadow-md">
              <Coffee className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Support ToolNest ☕
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              ToolNest is free and always will be. If it saves you time and you want
              to say thanks, your support keeps the servers running and new tools coming.
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              No pressure at all — using the tools is enough. 🙏
            </p>
          </div>

          {/* Payment options */}
          <div className="relative mt-8 grid gap-4 sm:grid-cols-2">

            {/* UPI option */}
            <div className="rounded-2xl border border-amber-200 bg-white/80 p-5 dark:bg-slate-800/60 dark:border-amber-700/40">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                  <IconUpi />
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Pay via UPI</span>
                <span className="ml-auto text-xs rounded-full bg-green-100 text-green-700 px-2 py-0.5 font-medium dark:bg-green-900/30 dark:text-green-400">India</span>
              </div>

              <div className="space-y-2">
                {[
                  { label: "PhonePe / Any UPI", id: "9023314594@ptyes" },
                  { label: "GPay / Paytm", id: "9023314594@ybl" },
                ].map((upi) => (
                  <div key={upi.id} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900 px-3 py-2.5 gap-2">
                    <div>
                      <p className="text-xs text-slate-400">{upi.label}</p>
                      <p className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-200">{upi.id}</p>
                    </div>
                    <UpiCopyButton upiId={upi.id} />
                  </div>
                ))}
              </div>

              <p className="mt-3 text-xs text-slate-400 text-center">
                Open any UPI app → Pay → enter the ID above
              </p>
            </div>

            {/* Buy Me a Coffee */}
            <div className="rounded-2xl border border-amber-200 bg-white/80 p-5 flex flex-col items-center justify-center text-center dark:bg-slate-800/60 dark:border-amber-700/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 mb-3">
                <Coffee className="h-5 w-5 text-white" />
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Buy Me a Coffee</p>
              <p className="text-xs text-slate-400 mb-4">International payments, cards, PayPal</p>
              <a
                href="https://www.buymeacoffee.com/uddhavshrimali"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-amber-500 active:scale-[0.98] transition-all"
              >
                <Coffee className="h-4 w-4" />
                Support me
              </a>
            </div>
          </div>

          <p className="relative mt-5 text-center text-xs text-slate-400">
            Every rupee goes directly into hosting, domain, and building more tools 💛
          </p>
        </div>
      </section>

      {/* Tech stack */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5">
          How it&apos;s built
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Next.js 16", "React 19", "TypeScript", "Tailwind CSS",
            "Vercel", "WebCrypto API", "Canvas API", "No database",
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Most tools run entirely client-side. No backend, no database, no file
          uploads — just your browser doing the work.
        </p>
      </section>

      {/* Contact / CTA */}
      <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
        <Wrench className="mx-auto h-8 w-8 text-indigo-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Got a tool idea or found a bug?
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
          I read everything. Open an issue on GitHub or connect on LinkedIn.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            href="https://github.com/Code-Neo-Kun/ToolNest.git"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <IconGithub /> Open an issue
          </a>
          <a
            href="https://www.linkedin.com/in/uddhav-shrimali-000828284"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <IconLinkedin /> Connect on LinkedIn
          </a>
          <Link
            href="/all-tools"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <Wrench className="h-4 w-4" /> Explore all tools
          </Link>
        </div>
      </section>

    </div>
  );
}
