import type { Metadata } from "next";
import Link from "next/link";
import { Coffee, ShieldCheck, Sparkles, ArrowLeft, CheckCircle2, QrCode } from "lucide-react";
import { UpiCopyButton } from "@/components/ui/UpiCopyButton";

export const metadata: Metadata = {
  title: "Support ToolNest — Keep It Free Forever",
  description:
    "ToolNest is 100% free and client-side with zero ads or forced signups. Support the project via UPI or Buy Me a Coffee to keep servers running.",
};

const IconUpi = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Navigation back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      {/* Header Banner Graphic - High End CSS Gradient & Ambient Glow */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-8 sm:p-12 text-white shadow-2xl mb-10">
        {/* Background glow effects */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md border border-amber-400/20 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Support ToolNest
          </div>
          <h1 className="text-3xl font-extrabold sm:text-5xl text-white tracking-tight leading-tight">
            Help Keep ToolNest Fast, Free & Private
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Zero ads, zero data tracking, zero server uploads. Every contribution directly funds domain, hosting, and building new browser-only tools.
          </p>
        </div>
      </div>

      {/* Payment Options Grid */}
      <div className="grid gap-8 md:grid-cols-2 mb-12">
        {/* UPI Card with QR Scanner (India) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <IconUpi />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">Pay via Instant UPI</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Scan QR Code or Copy UPI ID</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-semibold dark:bg-emerald-900/30 dark:text-emerald-400">
                India 🇮🇳
              </span>
            </div>

            {/* QR Scanner Display */}
            <div className="my-5 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 text-center dark:border-indigo-900/40 dark:bg-indigo-950/20">
              <div className="mx-auto max-w-[200px] overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-md dark:border-slate-700 dark:bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/upi_qr_scanner_image.png"
                  alt="UPI Payment QR Code Scanner"
                  className="h-auto w-full object-contain rounded-lg"
                />
              </div>
              <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1">
                <QrCode className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                Scan with PhonePe, GPay, Paytm, BHIM
              </p>
            </div>

            <div className="space-y-3 my-4">
              {[
                { app: "PhonePe / Any UPI App", id: "9023314594@ptyes" },
                { app: "Google Pay / Paytm", id: "9023314594@ybl" },
              ].map((upi) => (
                <div key={upi.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700/60 dark:bg-slate-900">
                  <div>
                    <span className="block text-xs font-medium text-slate-400">{upi.app}</span>
                    <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">{upi.id}</span>
                  </div>
                  <UpiCopyButton upiId={upi.id} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-indigo-50/50 p-3.5 dark:bg-indigo-950/20 text-xs text-indigo-700 dark:text-indigo-300 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
            <span>Scan QR code with any camera/UPI app or copy UPI ID directly.</span>
          </div>
        </div>

        {/* Buy Me A Coffee (Global) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                  <Coffee className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">Buy Me a Coffee</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Credit Cards, PayPal, Apple Pay</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-semibold dark:bg-blue-900/30 dark:text-blue-400">
                Global 🌐
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 my-4 leading-relaxed">
              Support ToolNest internationally starting from $3. Quick, secure checkout via card or PayPal without creating an account.
            </p>
          </div>

          <div className="mt-6">
            <a
              href="https://www.buymeacoffee.com/uddhavshrimali"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-900 shadow hover:bg-amber-500 active:scale-[0.98] transition-all"
            >
              <Coffee className="h-5 w-5 text-slate-900" />
              Support on Buy Me a Coffee
            </a>
          </div>
        </div>
      </div>

      {/* Trust & Transparency */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900 text-center">
        <ShieldCheck className="mx-auto h-8 w-8 text-emerald-500 mb-3" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">ToolNest Guarantee</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          ToolNest will remain free forever with no hidden paywalls. Your support helps build new tools and maintain server infrastructure. Thank you for using ToolNest! ❤️
        </p>
      </section>
    </div>
  );
}
