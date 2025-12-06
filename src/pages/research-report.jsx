import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  LayoutGrid,
  Lightbulb,
  Loader2,
  Megaphone,
  Package,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Section Card Component
function SectionCard({ icon: Icon, title, children, color = "violet" }) {
  const colorClasses = {
    violet: "from-violet-500/10 to-violet-600/5 border-violet-500/20",
    blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
    green: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20",
    orange: "from-orange-500/10 to-orange-600/5 border-orange-500/20",
    pink: "from-pink-500/10 to-pink-600/5 border-pink-500/20",
  };

  const iconColors = {
    violet: "text-violet-400",
    blue: "text-blue-400",
    green: "text-emerald-400",
    orange: "text-orange-400",
    pink: "text-pink-400",
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm p-6`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-zinc-800/50 ${iconColors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// Tag/Pill Component
function Tag({ children, variant = "default" }) {
  const variants = {
    default: "bg-zinc-800/60 text-zinc-300",
    success: "bg-emerald-500/20 text-emerald-400",
    warning: "bg-amber-500/20 text-amber-400",
    info: "bg-blue-500/20 text-blue-400",
    primary: "bg-violet-500/20 text-violet-400",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

// List Item Component
function ListItem({ children, icon: Icon }) {
  return (
    <li className="flex items-start gap-2 text-zinc-300">
      {Icon ? (
        <Icon className="w-4 h-4 mt-1 text-zinc-500 flex-shrink-0" />
      ) : (
        <span className="w-1.5 h-1.5 mt-2 rounded-full bg-zinc-500 flex-shrink-0" />
      )}
      <span>{children}</span>
    </li>
  );
}

// Competitor Card
function CompetitorCard({ competitor }) {
  return (
    <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
      <h4 className="font-medium text-white mb-3">{competitor.name}</h4>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-emerald-400 mb-1">Strengths</p>
          <ul className="space-y-1">
            {competitor.strengths?.slice(0, 3).map((s, i) => (
              <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                <span className="text-emerald-500 mt-1">+</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs text-red-400 mb-1">Weaknesses</p>
          <ul className="space-y-1">
            {competitor.weaknesses?.slice(0, 3).map((w, i) => (
              <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                <span className="text-red-500 mt-1">−</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Platform Card
function PlatformCard({ platform }) {
  const priorityColors = {
    high: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    low: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  };

  return (
    <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-white">{platform.platform}</h4>
        <span
          className={`px-2 py-0.5 rounded text-xs border ${priorityColors[platform.priority] || priorityColors.medium}`}
        >
          {platform.priority}
        </span>
      </div>
      <p className="text-sm text-zinc-400 mb-3">{platform.strategy}</p>
      <div className="flex items-center gap-2">
        <DollarSign className="w-4 h-4 text-zinc-500" />
        <span className="text-sm text-zinc-300">{platform.budget_percentage}% budget</span>
      </div>
    </div>
  );
}

// Action Item Card
function ActionItem({ item, index }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-800/20 border border-zinc-700/20">
      <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0 text-sm font-medium">
        {index + 1}
      </div>
      <p className="text-zinc-300 text-sm leading-relaxed">{item}</p>
    </div>
  );
}

export default function ResearchReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSection, setOpenSection] = useState("executive");

  // Get report from location state or fetch from API
  useEffect(() => {
    const fetchReport = async () => {
      // Check if report was passed via navigation state
      if (location.state?.report) {
        setReport(location.state.report);
        setLoading(false);
        return;
      }

      // Otherwise fetch from API
      try {
        const res = await fetch(`${API_URL}/api/v1/research/report`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch report");
        const data = await res.json();
        setReport(data.report);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [location.state]);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          <p className="text-zinc-400">Loading research report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "No report found"}</p>
          <button
            onClick={() => navigate("/chatbot")}
            className="px-4 py-2 bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors"
          >
            Go to Research Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/50 bg-black/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/chatbot")}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Chat</span>
          </button>
          <h1 className="text-lg font-semibold">Research Report</h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-73px)]">
        <main className="max-w-6xl mx-auto px-6 py-8">
          {/* Executive Summary */}
          <section className="mb-8">
            <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-zinc-900/50 p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Executive Summary</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                  {report.executive_summary}
                </p>
              </div>
            </div>
          </section>

          {/* Accordion Sections */}
          <Accordion className="space-y-4">
            {/* Action Items */}
            {report.action_items?.length > 0 && (
              <AccordionItem>
                <AccordionTrigger
                  isOpen={openSection === "actions"}
                  onClick={() => toggleSection("actions")}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Action Items</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent isOpen={openSection === "actions"}>
                  <div className="space-y-3">
                    {report.action_items.map((item, i) => (
                      <ActionItem key={i} item={item} index={i} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Product Analysis */}
            {report.product_analysis && (
              <AccordionItem>
                <AccordionTrigger
                  isOpen={openSection === "product"}
                  onClick={() => toggleSection("product")}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-violet-400" />
                    <span>Product Analysis</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent isOpen={openSection === "product"}>
                  <div className="space-y-6">
                    <p className="text-zinc-300">{report.product_analysis.summary}</p>

                    {/* Key Features */}
                    {report.product_analysis.key_features?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-400 mb-3">Key Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {report.product_analysis.key_features.map((f, i) => (
                            <Tag key={i} variant="primary">
                              {f}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Strengths */}
                      {report.product_analysis.strengths?.length > 0 && (
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                          <h4 className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Strengths
                          </h4>
                          <ul className="space-y-2">
                            {report.product_analysis.strengths.map((s, i) => (
                              <ListItem key={i}>{s}</ListItem>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Weaknesses */}
                      {report.product_analysis.weaknesses?.length > 0 && (
                        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                          <h4 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Weaknesses
                          </h4>
                          <ul className="space-y-2">
                            {report.product_analysis.weaknesses.map((w, i) => (
                              <ListItem key={i}>{w}</ListItem>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Trends */}
                    {report.product_analysis.trends?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-400 mb-3">Industry Trends</h4>
                        <ul className="space-y-2">
                          {report.product_analysis.trends.map((t, i) => (
                            <ListItem key={i} icon={TrendingUp}>
                              {t}
                            </ListItem>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Competitor Analysis */}
            {report.competitor_analysis && (
              <AccordionItem>
                <AccordionTrigger
                  isOpen={openSection === "competitor"}
                  onClick={() => toggleSection("competitor")}
                >
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-blue-400" />
                    <span>Competitor Analysis</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent isOpen={openSection === "competitor"}>
                  <div className="space-y-6">
                    <p className="text-zinc-300">{report.competitor_analysis.summary}</p>

                    {/* Competitors Grid */}
                    {report.competitor_analysis.main_competitors?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-400 mb-3">Main Competitors</h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {report.competitor_analysis.main_competitors.map((c, i) => (
                            <CompetitorCard key={i} competitor={c} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Competitive Advantages */}
                    {report.competitor_analysis.competitive_advantages?.length > 0 && (
                      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                        <h4 className="text-sm font-medium text-emerald-400 mb-3">
                          Competitive Advantages
                        </h4>
                        <ul className="space-y-2">
                          {report.competitor_analysis.competitive_advantages.map((a, i) => (
                            <ListItem key={i}>{a}</ListItem>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Differentiation */}
                    {report.competitor_analysis.differentiation_opportunities?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-400" />
                          Differentiation Opportunities
                        </h4>
                        <ul className="space-y-2">
                          {report.competitor_analysis.differentiation_opportunities.map((d, i) => (
                            <ListItem key={i}>{d}</ListItem>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Pricing Insights */}
                    {report.competitor_analysis.pricing_insights && (
                      <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
                        <h4 className="text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Pricing Insights
                        </h4>
                        <p className="text-zinc-300">{report.competitor_analysis.pricing_insights}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Audience Analysis */}
            {report.audience_analysis && (
              <AccordionItem>
                <AccordionTrigger
                  isOpen={openSection === "audience"}
                  onClick={() => toggleSection("audience")}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-pink-400" />
                    <span>Audience Analysis</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent isOpen={openSection === "audience"}>
                  <div className="space-y-6">
                    <p className="text-zinc-300">{report.audience_analysis.summary}</p>

                    {/* Demographics */}
                    {report.audience_analysis.demographics && (
                      <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
                        <h4 className="text-sm font-medium text-zinc-400 mb-3">Demographics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(report.audience_analysis.demographics).map(([key, value]) => (
                            <div key={key}>
                              <p className="text-xs text-zinc-500 capitalize">
                                {key.replace(/_/g, " ")}
                              </p>
                              <p className="text-zinc-200">
                                {typeof value === "object" ? JSON.stringify(value) : value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Psychographics */}
                    {report.audience_analysis.psychographics?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-400 mb-3">Psychographics</h4>
                        <div className="flex flex-wrap gap-2">
                          {report.audience_analysis.psychographics.map((p, i) => (
                            <Tag key={i}>{p}</Tag>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Pain Points */}
                      {report.audience_analysis.pain_points?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-red-400 mb-3">Pain Points</h4>
                          <ul className="space-y-2">
                            {report.audience_analysis.pain_points.map((p, i) => (
                              <ListItem key={i}>{p}</ListItem>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Motivations */}
                      {report.audience_analysis.motivations?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-emerald-400 mb-3">Motivations</h4>
                          <ul className="space-y-2">
                            {report.audience_analysis.motivations.map((m, i) => (
                              <ListItem key={i}>{m}</ListItem>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Best Channels */}
                    {report.audience_analysis.best_channels?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-400 mb-3">Best Channels</h4>
                        <div className="flex flex-wrap gap-2">
                          {report.audience_analysis.best_channels.map((c, i) => (
                            <Tag key={i} variant="info">
                              {c}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Campaign Recommendations */}
            {report.campaign_recommendations && (
              <AccordionItem>
                <AccordionTrigger
                  isOpen={openSection === "campaign"}
                  onClick={() => toggleSection("campaign")}
                >
                  <div className="flex items-center gap-3">
                    <Megaphone className="w-5 h-5 text-orange-400" />
                    <span>Campaign Recommendations</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent isOpen={openSection === "campaign"}>
                  <div className="space-y-6">
                    <p className="text-zinc-300">{report.campaign_recommendations.summary}</p>

                    {/* Objectives */}
                    {report.campaign_recommendations.recommended_objectives?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-400 mb-3">
                          Recommended Objectives
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {report.campaign_recommendations.recommended_objectives.map((o, i) => (
                            <Tag key={i} variant="success">
                              {o}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Messages */}
                    {report.campaign_recommendations.key_messages?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-400 mb-3">Key Messages</h4>
                        <ul className="space-y-2">
                          {report.campaign_recommendations.key_messages.map((m, i) => (
                            <ListItem key={i}>{m}</ListItem>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Content Ideas */}
                    {report.campaign_recommendations.content_ideas?.length > 0 && (
                      <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                        <h4 className="text-sm font-medium text-violet-400 mb-3 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Content Ideas
                        </h4>
                        <ul className="space-y-2">
                          {report.campaign_recommendations.content_ideas.map((c, i) => (
                            <ListItem key={i}>{c}</ListItem>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Success Metrics */}
                    {report.campaign_recommendations.success_metrics?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-400 mb-3">Success Metrics</h4>
                        <div className="flex flex-wrap gap-2">
                          {report.campaign_recommendations.success_metrics.map((m, i) => (
                            <Tag key={i} variant="info">
                              {m}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Budget */}
                    {report.campaign_recommendations.budget_recommendations && (
                      <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
                        <h4 className="text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Budget Recommendations
                        </h4>
                        <p className="text-zinc-300">
                          {report.campaign_recommendations.budget_recommendations}
                        </p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Platform Strategy */}
            {report.platform_strategy && (
              <AccordionItem>
                <AccordionTrigger
                  isOpen={openSection === "platform"}
                  onClick={() => toggleSection("platform")}
                >
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="w-5 h-5 text-emerald-400" />
                    <span>Platform Strategy</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent isOpen={openSection === "platform"}>
                  <div className="space-y-6">
                    <p className="text-zinc-300">{report.platform_strategy.summary}</p>

                    {/* Platform Recommendations */}
                    {report.platform_strategy.platform_recommendations?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-400 mb-3">
                          Platform Recommendations
                        </h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {report.platform_strategy.platform_recommendations.map((p, i) => (
                            <PlatformCard key={i} platform={p} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ad Formats */}
                    {report.platform_strategy.ad_format_suggestions?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-400 mb-3">
                          Recommended Ad Formats
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {report.platform_strategy.ad_format_suggestions.map((f, i) => (
                            <Tag key={i}>{f}</Tag>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Targeting */}
                    {report.platform_strategy.targeting_strategies?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-400 mb-3">
                          Targeting Strategies
                        </h4>
                        <ul className="space-y-2">
                          {report.platform_strategy.targeting_strategies.map((t, i) => (
                            <ListItem key={i} icon={Target}>
                              {t}
                            </ListItem>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Timing */}
                    {report.platform_strategy.timing_recommendations && (
                      <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
                        <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Best Timing
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {report.platform_strategy.timing_recommendations.best_days && (
                            <div>
                              <p className="text-xs text-zinc-500 mb-1">Best Days</p>
                              <p className="text-zinc-200">
                                {report.platform_strategy.timing_recommendations.best_days.join(", ")}
                              </p>
                            </div>
                          )}
                          {report.platform_strategy.timing_recommendations.best_times && (
                            <div>
                              <p className="text-xs text-zinc-500 mb-1">Best Times</p>
                              <p className="text-zinc-200">
                                {report.platform_strategy.timing_recommendations.best_times.join(", ")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </main>
      </ScrollArea>
    </div>
  );
}
