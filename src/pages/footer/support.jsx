import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "What is Advista?",
    a: "Advista is a competitor intelligence platform built for go-to-market teams. It collects live signals across search, video, forums, and review channels, then delivers structured briefings, battlecards, and strategic recommendations.",
  },
  {
    q: "What sources does Advista monitor?",
    a: "Advista gathers competitive evidence from Google Search, YouTube, Reddit, and industry forum discussions — all in a single run, with full source traceability.",
  },
  {
    q: "How do I start a new intelligence run?",
    a: 'Click "Start Run" from any page. Define your competitor set, target market, and desired output format, then let Advista collect and synthesize signals automatically.',
  },
  {
    q: "How often does Advista refresh competitive data?",
    a: "Each run fetches fresh signals at the time of execution. You can reuse saved brief templates to run the same intelligence frame on demand or on a recurring schedule.",
  },
  {
    q: "Who is Advista built for?",
    a: "Advista is built for product marketing, sales enablement, and strategy teams that need current, evidence-backed competitor intelligence without spending hours on manual research.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Support</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Answers to common questions about Advista
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-2xl font-semibold text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{q}</h3>
                <p className="text-zinc-400 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-zinc-700 bg-zinc-800 mb-6">
              <Mail className="h-5 w-5 text-zinc-300" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">Still have questions?</h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Reach out and I will get back to you as soon as possible.
            </p>
            <a
              href="mailto:ayushjrathod7@gmail.com"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
            >
              <Mail className="h-4 w-4" />
              ayushjrathod7@gmail.com
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
