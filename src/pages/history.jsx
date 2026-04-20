import { FloatingNav } from "@/components/landing/floating-navbar";
import { Footer } from "@/components/landing/Footer";
import { useAuth } from "@/contexts/use-auth";
import api from "@/lib/api";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MessageSquare,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STATUS_CONFIG = {
  completed: { label: "Completed", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  pending: { label: "Pending", icon: Clock, color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  researching: { label: "Researching", icon: Loader2, color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  processing: { label: "Processing", icon: Loader2, color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  synthesizing: { label: "Synthesizing", icon: Loader2, color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
  failed: { label: "Failed", icon: XCircle, color: "text-red-400 bg-red-400/10 border-red-400/20" },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

export default function HistoryPage() {
  const { authMessage, isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageMessage, setPageMessage] = useState("");

  const navItems = [
    { name: "Start Run", link: "/chat", icon: <MessageSquare /> },
    { name: "About", link: "/about" },
  ];

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await api.get("/api/v1/research/sessions");
        setSessions(data.sessions || []);
        setPageMessage(data.message || "");
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load research history.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [isAuthenticated]);

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCompanyName = (brief) => {
    if (!brief) return "Untitled Research";
    if (typeof brief === "string") {
      try { brief = JSON.parse(brief); } catch { return "Untitled Research"; }
    }
    return brief.company_name || "Untitled Research";
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col">
      <FloatingNav navItems={navItems} />

      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link to="/chat" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Chat
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Research History</h1>
            <p className="mt-2 text-zinc-400">Your past competitive intelligence reports</p>
          </div>

          {/* Content */}
          {!isAuthenticated && (pageMessage || authMessage) ? (
            <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              {pageMessage || authMessage}
            </div>
          ) : null}

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
          ) : error ? (
            <div className="text-center py-24">
              <p className="text-red-400 mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="text-sm text-zinc-400 hover:text-white underline">
                Try again
              </button>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-zinc-400 mb-4">
                {isAuthenticated ? "No research sessions yet." : "No saved research history is available for this session yet."}
              </p>
              <Link to="/chat" className="text-sm text-purple-400 hover:text-purple-300 underline">
                Start your first research
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <Link
                  key={session.id}
                  to={session.status === "completed" ? `/research-report?session_id=${session.id}` : "#"}
                  className={`block rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors ${
                    session.status === "completed" ? "hover:border-zinc-600 hover:bg-zinc-900/80 cursor-pointer" : "opacity-70 cursor-default"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {getCompanyName(session.researchBrief)}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(session.createdAt)}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={session.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
