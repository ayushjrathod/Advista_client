import { ArrowLeft, HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function FooterComingSoonPage({ title, subtitle = "Coming soon." }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors">
            <HomeIcon className="h-4 w-4" />
            Home
          </Link>
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-400 mb-4">Footer</p>
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-zinc-300 text-lg">{subtitle}</p>
        </div>
      </main>
    </div>
  );
}
