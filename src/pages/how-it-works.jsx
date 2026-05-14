import { FloatingNav } from "@/components/landing/floating-navbar";
import { Footer } from "@/components/landing/Footer";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  { id: "pipeline", label: "Pipeline" },
  { id: "brief-extraction", label: "Brief Extraction" },
  { id: "signal-collection", label: "Signal Collection" },
  { id: "synthesis", label: "Synthesis" },
  { id: "report-schema", label: "Report Schema" },
  { id: "decisions", label: "Design Decisions" },
  { id: "stack", label: "Stack" },
];

export default function HowItWorksPage() {
  const navItems = [
    { name: "Start Run", link: "/chat", icon: <MessageSquare /> },
    { name: "About", link: "/about" },
  ];

  return (
    <div className="relative min-h-screen bg-black">
      <FloatingNav className="" navItems={navItems} />

      <div className="mx-auto max-w-[1200px] px-6 pt-24 pb-32">
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="mb-16">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500 mb-4">Technical overview</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">How Advista Works</h1>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
            A walkthrough of the agent pipeline, data flow, and key engineering decisions behind the competitor
            intelligence system.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
          {/* Sidebar nav */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-sm text-zinc-500 hover:text-white transition-colors py-1"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </aside>

          {/* Content */}
          <main className="space-y-20 min-w-0">

            {/* Pipeline overview */}
            <section id="pipeline" className="scroll-mt-28">
              <h2 className="text-2xl font-semibold text-white mb-2">Pipeline Overview</h2>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                A research run moves through four sequential stages. The frontend drives stages 1 and 4; the
                backend owns 2 and 3.
              </p>

              <div className="space-y-3">
                {[
                  {
                    step: "01",
                    title: "Brief Extraction",
                    desc: "A chat agent streams responses via SSE and progressively populates 8 brief fields — company, competitors, channels, goals — from the conversation.",
                    owner: "LLM agent + SSE stream",
                  },
                  {
                    step: "02",
                    title: "Signal Collection",
                    desc: "Once the brief reaches ≥70% completion, collection agents query Google Search, Reddit/forums, and YouTube in parallel across five intelligence categories.",
                    owner: "Backend — parallel agents",
                  },
                  {
                    step: "03",
                    title: "Analysis & Synthesis",
                    desc: "Per-category analysis agents produce structured findings. A synthesis agent assembles them into the final report JSON, including executive summary, battlecard angles, and GTM channel recommendations.",
                    owner: "Backend — sequential agents",
                  },
                  {
                    step: "04",
                    title: "Report Rendering",
                    desc: "The full report JSON is returned in a single response and rendered client-side across 7 sections. No additional API calls are made for report data.",
                    owner: "Client — React",
                  },
                ].map(({ step, title, desc, owner }) => (
                  <div key={step} className="grid grid-cols-[48px_minmax(0,1fr)] gap-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
                    <span className="text-2xl font-bold text-zinc-700 font-mono">{step}</span>
                    <div>
                      <p className="font-semibold text-white mb-1">{title}</p>
                      <p className="text-sm text-zinc-400 leading-relaxed mb-2">{desc}</p>
                      <span className="text-xs text-zinc-600 font-mono">{owner}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Brief extraction */}
            <section id="brief-extraction" className="scroll-mt-28">
              <h2 className="text-2xl font-semibold text-white mb-2">Brief Extraction Agent</h2>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                The intake agent extracts a structured research brief from free-form conversation rather than a
                static form. This was an intentional choice — users consistently provide more context when
                describing their problem in prose than when filling fields.
              </p>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 mb-6">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">Brief schema (8 fields)</p>
                <div className="font-mono text-sm space-y-1 text-zinc-300">
                  <div><span className="text-zinc-500">company_name</span>          <span className="text-zinc-600 ml-4">string</span></div>
                  <div><span className="text-zinc-500">product_description</span>   <span className="text-zinc-600 ml-4">string</span></div>
                  <div><span className="text-zinc-500">target_customers</span>      <span className="text-zinc-600 ml-4">string</span></div>
                  <div><span className="text-zinc-500">strategic_goals</span>       <span className="text-zinc-600 ml-4">string</span></div>
                  <div><span className="text-zinc-500">competitor_names</span>      <span className="text-zinc-600 ml-4">string[]</span></div>
                  <div><span className="text-zinc-500">primary_channels</span>      <span className="text-zinc-600 ml-4">string[]</span></div>
                  <div><span className="text-zinc-500">positioning_hypothesis</span><span className="text-zinc-600 ml-4">string</span></div>
                  <div><span className="text-zinc-500">additional_context</span>    <span className="text-zinc-600 ml-4">string</span></div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">Streaming protocol</p>
                <div className="font-mono text-sm space-y-2 text-zinc-400">
                  <div className="text-zinc-300">POST /api/v1/chat/stream</div>
                  <div className="text-zinc-600">{"{"} thread_id, message {"}"}</div>
                  <div className="mt-3 text-zinc-600">↓ SSE response (text/event-stream)</div>
                  <div>data: partial assistant token</div>
                  <div>data: partial assistant token</div>
                  <div>data: [DONE]</div>
                  <div className="mt-3 text-zinc-600">↓ After stream closes</div>
                  <div>GET /api/v1/chat/research-brief/:thread_id</div>
                  <div className="text-zinc-600">{"{"} completion_percentage, brief, is_complete {"}"}</div>
                </div>
              </div>
            </section>

            {/* Signal collection */}
            <section id="signal-collection" className="scroll-mt-28">
              <h2 className="text-2xl font-semibold text-white mb-2">Signal Collection Agents</h2>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                Collection runs across three source types. Each source is queried once per intelligence
                category, so a typical run issues 15 queries (5 categories × 3 sources).
              </p>

              <div className="grid gap-4 sm:grid-cols-3 mb-6">
                {[
                  { source: "Google Search", note: "Web results, pricing pages, press mentions, competitor landing pages" },
                  { source: "Reddit / Forums", note: "User sentiment, migration threads, objection patterns, community discussions" },
                  { source: "YouTube", note: "Founder interviews, product demos, shorts — with transcript extraction" },
                ].map(({ source, note }) => (
                  <div key={source} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                    <p className="font-semibold text-white text-sm mb-2">{source}</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">Intelligence categories</p>
                <div className="space-y-2">
                  {[
                    ["company_product", "Self-analysis — strengths, weaknesses, key capabilities"],
                    ["competitor_landscape", "Competitor positioning, pricing, differentiation"],
                    ["customer_sentiment", "Buyer pain points, segments, motivations, triggers"],
                    ["strategic_gap", "Openings in the market not currently owned by any player"],
                    ["battlecard", "Objection-handling angles, win/loss patterns"],
                  ].map(([key, desc]) => (
                    <div key={key} className="flex gap-4 text-sm">
                      <span className="font-mono text-zinc-500 shrink-0 w-48">{key}</span>
                      <span className="text-zinc-400">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Synthesis */}
            <section id="synthesis" className="scroll-mt-28">
              <h2 className="text-2xl font-semibold text-white mb-2">Analysis & Synthesis</h2>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                After collection, per-category analysis agents run on the raw sources. A final synthesis agent
                reconciles findings across categories and produces the structured report object.
              </p>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 mb-6">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">Report generation endpoint</p>
                <div className="font-mono text-sm space-y-1 text-zinc-400">
                  <div className="text-zinc-300">POST /api/v1/research/start-research</div>
                  <div className="text-zinc-600">{"{"} research_brief, threadId {"}"}</div>
                  <div className="mt-3 text-zinc-600">← returns</div>
                  <div>{"{"} session_id, report, brief, resources_used {"}"}</div>
                </div>
              </div>

              <p className="text-zinc-500 text-sm leading-relaxed">
                The entire report is returned in a single response — no pagination or lazy loading. This keeps
                the client simple and allows PDF export without additional fetches.
              </p>
            </section>

            {/* Report schema */}
            <section id="report-schema" className="scroll-mt-28">
              <h2 className="text-2xl font-semibold text-white mb-2">Report Schema</h2>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                The report is a strongly typed JSON object with 7 top-level sections rendered client-side. Each
                section maps 1:1 to a React component.
              </p>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="font-mono text-sm space-y-3 text-zinc-400">
                  {[
                    { key: "executive_summary", type: "string", note: "— high-level synthesis" },
                    { key: "action_items", type: "string[]", note: "— ordered next steps" },
                    { key: "company_product_analysis", type: "{ summary, strengths[], weaknesses[], ... }", note: "" },
                    { key: "competitor_landscape_analysis", type: "{ main_competitors[], differentiation[], ... }", note: "" },
                    { key: "customer_sentiment_analysis", type: "{ segments, pain_points[], buying_triggers[], ... }", note: "" },
                    { key: "strategic_recommendations", type: "{ priorities[], battlecard_angles[], positioning[], ... }", note: "" },
                    { key: "go_to_market_strategy", type: "{ channel_recommendations[], targeting[], timing, ... }", note: "" },
                    { key: "resources_used", type: "{ categories[], youtube? }", note: "— source citations" },
                  ].map(({ key, type, note }) => (
                    <div key={key}>
                      <span className="text-zinc-300">{key}</span>
                      <span className="text-zinc-600">: {type}{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Design decisions */}
            <section id="decisions" className="scroll-mt-28">
              <h2 className="text-2xl font-semibold text-white mb-2">Design Decisions</h2>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                Key choices made during development, and the reasoning behind each.
              </p>

              <div className="space-y-5">
                {[
                  {
                    decision: "Chat-based brief intake instead of a structured form",
                    why: "Users provide richer context when describing their problem conversationally. The agent extracts structured fields from prose, combining the flexibility of free-form input with the reliability of a typed schema downstream.",
                  },
                  {
                    decision: "70% completion threshold to trigger report generation",
                    why: "Requiring 100% brief completion blocked runs where one or two fields couldn't be determined from the conversation. Empirically, 70% coverage is enough context for meaningful analysis. Users can also force-trigger below that threshold.",
                  },
                  {
                    decision: "SSE for brief streaming, polling for brief metadata",
                    why: "SSE is the right transport for the assistant's token stream — it's one-directional and low-overhead. But brief metadata (completion percentage, structured fields) changes only after a message completes, so a single poll after each response is simpler than maintaining a second SSE channel.",
                  },
                  {
                    decision: "Full report returned in one response, not streamed",
                    why: "Streaming a structured JSON object is awkward to parse incrementally. The report generation step is the longest-running operation, so we show a loading state rather than attempting partial renders. This also enables PDF export without reassembling the document.",
                  },
                  {
                    decision: "Firebase for authentication",
                    why: "Firebase was chosen for speed of setup and support for anonymous sessions. Anonymous auth lets users start a run without signing up — auth state upgrades to a verified account on first sign-in without losing the current thread.",
                  },
                  {
                    decision: "AWS Lambda Function URLs for the backend",
                    why: "Lambda Function URLs provide direct HTTP access without API Gateway, reducing latency and cost for infrequent research runs. The tradeoff is the Lambda envelope format ({statusCode, body, headers}), which the client unwraps transparently.",
                  },
                  {
                    decision: "No Redux or global state manager",
                    why: "The app has two core interaction surfaces — the chat page and the report page — with minimal shared state between them. React useState and AuthContext cover all requirements without the overhead of a state manager.",
                  },
                ].map(({ decision, why }) => (
                  <div key={decision} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
                    <p className="font-semibold text-white text-sm mb-2">{decision}</p>
                    <p className="text-sm text-zinc-400 leading-relaxed">{why}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Stack */}
            <section id="stack" className="scroll-mt-28">
              <h2 className="text-2xl font-semibold text-white mb-2">Stack</h2>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                Frontend only — the backend is a separate service.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { layer: "Framework", value: "React 19", note: "Hooks only, no class components" },
                  { layer: "Build", value: "Vite 7", note: "Dev server + production bundler" },
                  { layer: "Routing", value: "React Router 7", note: "SPA — all routes rewrite to index.html" },
                  { layer: "Auth", value: "Firebase 12", note: "Anonymous + verified sessions, JWT to backend" },
                  { layer: "HTTP", value: "Axios", note: "Interceptor auto-attaches Firebase ID token" },
                  { layer: "Streaming", value: "Fetch + ReadableStream", note: "SSE parsed manually; Axios not used for streams" },
                  { layer: "Styling", value: "Tailwind CSS 4 + Radix UI", note: "Utility-first + headless primitives" },
                  { layer: "Animation", value: "Framer Motion", note: "Page transitions and landing animations" },
                  { layer: "3D", value: "React Three Fiber", note: "Landing page cube recorder element" },
                  { layer: "Deploy", value: "Vercel", note: "Static SPA with vercel.json rewrite rule" },
                ].map(({ layer, value, note }) => (
                  <div key={layer} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="text-xs text-zinc-500 uppercase tracking-wider">{layer}</span>
                      <span className="font-mono text-sm text-white">{value}</span>
                    </div>
                    <p className="text-xs text-zinc-600">{note}</p>
                  </div>
                ))}
              </div>
            </section>

          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
