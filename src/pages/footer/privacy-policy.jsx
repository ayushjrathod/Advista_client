import { ArrowLeft, HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Information We Collect",
    body:
      "We may collect information you provide directly, such as account details, messages, research inputs, and support requests. We may also collect basic usage and device information to keep the service running smoothly.",
  },
  {
    title: "2. How We Use Information",
    body:
      "We use information to provide, maintain, and improve Advista, respond to support requests, send important updates, and help secure the platform.",
  },
  {
    title: "3. Sharing Information",
    body:
      "We do not sell your personal information. We may share data with trusted service providers that help operate the product, or when required by law.",
  },
  {
    title: "4. Data Retention",
    body:
      "We keep information only as long as needed to provide the service, meet legal obligations, resolve disputes, and enforce agreements.",
  },
  {
    title: "5. Your Choices",
    body:
      "You can request access, correction, or deletion of certain information where applicable. You may also update your account settings or contact us with privacy questions.",
  },
  {
    title: "6. Contact",
    body:
      "If you have any questions about this Privacy Policy, reach out to the Advista team through the website contact channels.",
  },
];

export default function PrivacyPolicyPage() {
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
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-zinc-400 text-lg">
              A simple summary of how Advista handles information and user privacy.
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
