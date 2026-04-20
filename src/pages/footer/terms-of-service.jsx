import { ArrowLeft, HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body:
      "By accessing or using Advista, you agree to these Terms of Service. If you do not agree, please do not use the product.",
  },
  {
    title: "2. Use of the Service",
    body:
      "You may use Advista only for lawful purposes and in accordance with applicable laws. You are responsible for your account activity and any content you submit.",
  },
  {
    title: "3. Subscriptions and Availability",
    body:
      "Some features may require a paid plan or may be changed, suspended, or discontinued at any time. We do our best to keep the service available, but we do not guarantee uninterrupted access.",
  },
  {
    title: "4. Intellectual Property",
    body:
      "All product content, branding, and software remain the property of Advista or its licensors. You may not copy, modify, or distribute them without permission.",
  },
  {
    title: "5. Limitation of Liability",
    body:
      "Advista is provided on an as-is basis. To the fullest extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from use of the service.",
  },
  {
    title: "6. Contact",
    body:
      "If you have questions about these terms, contact the Advista team through the channels listed on the website.",
  },
];

export default function TermsOfServicePage() {
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

        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-violet-400 mb-4">Legal</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-zinc-400 text-lg">
              A basic outline of the rules and responsibilities for using Advista.
            </p>
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <section key={section.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
                <h2 className="text-xl font-semibold mb-3 text-white">{section.title}</h2>
                <p className="text-zinc-300 leading-relaxed">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
