import { FloatingNav } from "@/components/landing/floating-navbar";
import { Footer } from "@/components/landing/Footer";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  const navItems = [
    { name: "Start Run", link: "/chat", icon: <MessageSquare /> },
    { name: "About", link: "/about" },
  ];

  return (
    <div className="relative min-h-screen bg-black">
      <FloatingNav className="" navItems={navItems} />

      <main className="relative min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Button */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">About Advista</h1>
            <p className="text-xl sm:text-2xl text-zinc-400 max-w-3xl mx-auto">
              Competitor intelligence that moves at the speed of the market
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">What We Do</h2>
              <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800">
                <p className="text-lg text-zinc-300 leading-relaxed text-center">
                  Advista is a competitor intelligence platform built for go-to-market teams. We collect live signals
                  across search, video, forums, and review channels, then turn that raw evidence into structured
                  briefings, battlecards, and strategic recommendations — so your team always knows what competitors
                  are doing, why it matters, and what to do next.
                </p>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <h3 className="text-xl font-semibold text-white mb-4">Live Signal Collection</h3>
                <p className="text-zinc-400">
                  Continuously monitor competitors across Google, YouTube, Reddit, and industry forums. Every run
                  returns fresh evidence with full source traceability — not a cached summary from last week.
                </p>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <h3 className="text-xl font-semibold text-white mb-4">Structured Intelligence Briefs</h3>
                <p className="text-zinc-400">
                  Define your competitor set, target market, and output format once. Advista runs the same
                  intelligence frame on every collection pass so results are comparable across time.
                </p>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <h3 className="text-xl font-semibold text-white mb-4">Narrative Shift Detection</h3>
                <p className="text-zinc-400">
                  Go beyond keyword monitoring. Advista identifies when a competitor's messaging, positioning, or
                  customer sentiment has meaningfully changed — and surfaces the evidence behind the shift.
                </p>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <h3 className="text-xl font-semibold text-white mb-4">Battlecard & Win-Loss Prep</h3>
                <p className="text-zinc-400">
                  Turn raw competitive signals into sales-ready battlecards. Understand where competitors are
                  winning on messaging and where customer objections create openings for your team.
                </p>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <h3 className="text-xl font-semibold text-white mb-4">Strategic Recommendations</h3>
                <p className="text-zinc-400">
                  Every briefing ends with a clear next move — sharpen a proof point, adjust pricing narrative,
                  or reframe an objection — grounded in the signals collected, not generic advice.
                </p>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <h3 className="text-xl font-semibold text-white mb-4">Source-Linked Evidence</h3>
                <p className="text-zinc-400">
                  Every claim links back to the exact source, excerpt, and channel it came from. Your team can
                  verify findings, share proof with stakeholders, and export the full evidence trail.
                </p>
              </div>
            </div>
          </section>

          {/* Who It's For */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Built For</h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                <h3 className="text-xl font-semibold text-white mb-4">Product Marketing</h3>
                <p className="text-zinc-400">
                  Track competitor launches, pricing moves, and messaging pivots as they happen. Maintain
                  positioning that's grounded in real market evidence, not assumptions.
                </p>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                <h3 className="text-xl font-semibold text-white mb-4">Sales Enablement</h3>
                <p className="text-zinc-400">
                  Arm reps with current battlecards and objection-handling guides pulled from live competitor
                  signals — not a deck someone built six months ago.
                </p>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                <h3 className="text-xl font-semibold text-white mb-4">Strategy & Leadership</h3>
                <p className="text-zinc-400">
                  Get a quarterly pulse on competitive movement, sentiment trends, and market positioning without
                  assigning a full analyst to pull it together.
                </p>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                <h3 className="text-xl font-semibold text-white mb-4">Growth & Demand Gen</h3>
                <p className="text-zinc-400">
                  Understand how competitors are showing up in organic and paid channels. Use that signal to
                  sharpen copy, identify gaps, and time your campaigns around competitor moves.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
