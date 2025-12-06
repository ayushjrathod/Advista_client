import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  LayoutGrid,
  Lightbulb,
  Loader2,
  Megaphone,
  Menu,
  Package,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Tag/Pill Component
function Tag({ children, variant = "default" }) {
  const variants = {
    default: "bg-zinc-800/60 text-zinc-300 border-zinc-700",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    primary: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

// List Item Component
function ListItem({ children, icon: Icon, className = "" }) {
  return (
    <li className={`flex items-start gap-3 text-zinc-300 ${className}`}>
      {Icon ? (
        <div className="mt-1 p-1 rounded bg-zinc-800/50">
          <Icon className="w-3.5 h-3.5 text-zinc-400" />
        </div>
      ) : (
        <span className="w-1.5 h-1.5 mt-2.5 rounded-full bg-zinc-500 flex-shrink-0" />
      )}
      <span className="text-sm leading-relaxed">{children}</span>
    </li>
  );
}

// Competitor Card
function CompetitorCard({ competitor }) {
  return (
    <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium text-white">{competitor.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-medium text-emerald-400 mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Strengths
          </p>
          <ul className="space-y-1.5">
            {competitor.strengths?.slice(0, 3).map((s, i) => (
              <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
                <span className="text-emerald-500/50 mt-0.5">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium text-red-400 mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Weaknesses
          </p>
          <ul className="space-y-1.5">
            {competitor.weaknesses?.slice(0, 3).map((w, i) => (
              <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
                <span className="text-red-500/50 mt-0.5">•</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Platform Card
function PlatformCard({ platform }) {
  const priorityColors = {
    high: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    low: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-white">{platform.platform}</CardTitle>
          <span
            className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold border ${priorityColors[platform.priority] || priorityColors.medium}`}
          >
            {platform.priority}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{platform.strategy}</p>
        <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/50">
          <div className="p-1.5 rounded bg-zinc-800/50">
            <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <span className="text-sm font-medium text-zinc-300">{platform.budget_percentage}% Budget Allocation</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Action Item Card
function ActionItem({ item, index }) {
  return (
    <div className="group flex items-start gap-4 p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all">
      <div className="w-6 h-6 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center flex-shrink-0 text-xs font-bold border border-violet-500/20 group-hover:scale-110 transition-transform">
        {index + 1}
      </div>
      <p className="text-zinc-300 text-sm leading-relaxed pt-0.5">{item}</p>
    </div>
  );
}

// No Data Component
function NoData({ message = "No data available for this section." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center bg-zinc-900/30 rounded-xl border border-zinc-800 border-dashed">
      <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
        <Package className="w-6 h-6 text-zinc-600" />
      </div>
      <p className="text-zinc-400 text-sm">{message}</p>
    </div>
  );
}

export default function ResearchReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("executive");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile
  const [isPrinting, setIsPrinting] = useState(false);

  const handleExportPDF = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

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

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: "executive", label: "Executive Summary", icon: BarChart3 },
    { id: "actions", label: "Action Items", icon: CheckCircle2 },
    { id: "product", label: "Product Analysis", icon: Package },
    { id: "competitor", label: "Competitor Analysis", icon: Target },
    { id: "audience", label: "Audience Analysis", icon: Users },
    { id: "campaign", label: "Campaign Strategy", icon: Megaphone },
    { id: "platform", label: "Platform Strategy", icon: LayoutGrid },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          <p className="text-zinc-400 animate-pulse">Generating your research report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Unable to Load Report</h2>
          <p className="text-zinc-400 mb-8">{error || "No report found. Please try generating a new report."}</p>
          <Button
            onClick={() => navigate("/chat")}
            className="bg-violet-600 hover:bg-violet-500"
          >
            Return to Chat
          </Button>
        </div>
      </div>
    );
  }

  const renderContent = (sectionId = activeSection) => {
    switch (sectionId) {
      case "executive":
        const competitorCount = report.competitor_analysis?.main_competitors?.length || 0;
        const actionItemsCount = report.action_items?.length || 0;
        const platformsCount = report.platform_strategy?.platform_recommendations?.length || 0;

        return (
          <div key="executive" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Executive Summary</h2>
                <p className="text-zinc-400">High-level overview of the research findings</p>
              </div>
              <Button 
                variant="outline" 
                className="gap-2 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300 no-print" 
                onClick={handleExportPDF}
              >
                <Download className="w-4 h-4" /> Export PDF
              </Button>
            </div>
            
            <Card className="bg-gradient-to-br from-violet-500/10 via-zinc-900/50 to-zinc-900/50 border-violet-500/20">
              <CardContent className="p-8">
                <div className="prose prose-invert max-w-none">
                  <p className="text-zinc-300 leading-relaxed whitespace-pre-line text-lg">
                    {report.executive_summary}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-400">Competitors Analyzed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{competitorCount}</div>
                  <p className="text-xs text-zinc-500 mt-1">Key market players identified</p>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-400">Action Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{actionItemsCount}</div>
                  <p className="text-xs text-zinc-500 mt-1">Recommended next steps</p>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-400">Platforms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{platformsCount}</div>
                  <p className="text-xs text-zinc-500 mt-1">Channels for distribution</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "actions":
        return (
          <div key="actions" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Action Items</h2>
              <p className="text-zinc-400">Recommended next steps for your campaign</p>
            </div>
            {report.action_items?.length > 0 ? (
              <div className="grid gap-4">
                {report.action_items.map((item, i) => (
                  <ActionItem key={i} item={item} index={i} />
                ))}
              </div>
            ) : (
              <NoData message="No specific action items generated." />
            )}
          </div>
        );

      case "product":
        if (!report.product_analysis) return <NoData />;
        return (
          <div key="product" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Product Analysis</h2>
              <p className="text-zinc-400">Deep dive into product features and market fit</p>
            </div>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6">
                <p className="text-zinc-300 leading-relaxed">{report.product_analysis.summary}</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-emerald-950/10 border-emerald-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-400">
                    <TrendingUp className="w-5 h-5" /> Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {report.product_analysis.strengths?.length > 0 ? (
                    <ul className="space-y-3">
                      {report.product_analysis.strengths.map((s, i) => (
                        <ListItem key={i} icon={CheckCircle2} className="text-emerald-100/80">
                          {s}
                        </ListItem>
                      ))}
                    </ul>
                  ) : <p className="text-zinc-500 text-sm">No strengths listed.</p>}
                </CardContent>
              </Card>

              <Card className="bg-red-950/10 border-red-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-5 h-5" /> Weaknesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {report.product_analysis.weaknesses?.length > 0 ? (
                    <ul className="space-y-3">
                      {report.product_analysis.weaknesses.map((w, i) => (
                        <ListItem key={i} icon={AlertTriangle} className="text-red-100/80">
                          {w}
                        </ListItem>
                      ))}
                    </ul>
                  ) : <p className="text-zinc-500 text-sm">No weaknesses listed.</p>}
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-base">Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  {report.product_analysis.key_features?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {report.product_analysis.key_features.map((f, i) => (
                        <Tag key={i} variant="primary">{f}</Tag>
                      ))}
                    </div>
                  ) : <p className="text-zinc-500 text-sm">No key features listed.</p>}
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-base">Industry Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  {report.product_analysis.trends?.length > 0 ? (
                    <ul className="space-y-2">
                      {report.product_analysis.trends.map((t, i) => (
                        <ListItem key={i} icon={TrendingUp}>{t}</ListItem>
                      ))}
                    </ul>
                  ) : <p className="text-zinc-500 text-sm">No trends listed.</p>}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "competitor":
        if (!report.competitor_analysis) return <NoData />;
        return (
          <div key="competitor" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Competitor Analysis</h2>
              <p className="text-zinc-400">Landscape analysis and competitive advantages</p>
            </div>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6">
                <p className="text-zinc-300 leading-relaxed">{report.competitor_analysis.summary}</p>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Main Competitors</h3>
              {report.competitor_analysis.main_competitors?.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {report.competitor_analysis.main_competitors.map((c, i) => (
                    <CompetitorCard key={i} competitor={c} />
                  ))}
                </div>
              ) : <NoData message="No competitors found." />}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-400">
                    <Lightbulb className="w-5 h-5" /> Differentiation Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {report.competitor_analysis.differentiation_opportunities?.length > 0 ? (
                    <ul className="space-y-3">
                      {report.competitor_analysis.differentiation_opportunities.map((d, i) => (
                        <ListItem key={i} icon={Target}>{d}</ListItem>
                      ))}
                    </ul>
                  ) : <p className="text-zinc-500 text-sm">None listed.</p>}
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" /> Competitive Advantages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {report.competitor_analysis.competitive_advantages?.length > 0 ? (
                    <ul className="space-y-3">
                      {report.competitor_analysis.competitive_advantages.map((a, i) => (
                        <ListItem key={i} icon={CheckCircle2}>{a}</ListItem>
                      ))}
                    </ul>
                  ) : <p className="text-zinc-500 text-sm">None listed.</p>}
                </CardContent>
              </Card>
            </div>

            {report.competitor_analysis.pricing_insights && (
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-zinc-400" /> Pricing Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-300">{report.competitor_analysis.pricing_insights}</p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "audience":
        if (!report.audience_analysis) return <NoData />;
        return (
          <div key="audience" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Audience Analysis</h2>
              <p className="text-zinc-400">Understanding your target market</p>
            </div>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6">
                <p className="text-zinc-300 leading-relaxed">{report.audience_analysis.summary}</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-base">Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(report.audience_analysis.demographics || {}).map(([key, value]) => (
                      <div key={key} className="p-3 rounded-lg bg-zinc-800/30">
                        <p className="text-xs text-zinc-500 capitalize mb-1">
                          {key.replace(/_/g, " ")}
                        </p>
                        <p className="text-sm font-medium text-zinc-200">
                          {typeof value === "object" ? JSON.stringify(value) : value}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-base">Psychographics</CardTitle>
                </CardHeader>
                <CardContent>
                  {report.audience_analysis.psychographics?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {report.audience_analysis.psychographics.map((p, i) => (
                        <Tag key={i} variant="info">{p}</Tag>
                      ))}
                    </div>
                  ) : <p className="text-zinc-500 text-sm">None listed.</p>}
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-red-950/10 border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-red-400">Pain Points</CardTitle>
                </CardHeader>
                <CardContent>
                  {report.audience_analysis.pain_points?.length > 0 ? (
                    <ul className="space-y-3">
                      {report.audience_analysis.pain_points.map((p, i) => (
                        <ListItem key={i} icon={AlertTriangle} className="text-red-100/80">{p}</ListItem>
                      ))}
                    </ul>
                  ) : <p className="text-zinc-500 text-sm">None listed.</p>}
                </CardContent>
              </Card>

              <Card className="bg-emerald-950/10 border-emerald-500/20">
                <CardHeader>
                  <CardTitle className="text-emerald-400">Motivations</CardTitle>
                </CardHeader>
                <CardContent>
                  {report.audience_analysis.motivations?.length > 0 ? (
                    <ul className="space-y-3">
                      {report.audience_analysis.motivations.map((m, i) => (
                        <ListItem key={i} icon={Target} className="text-emerald-100/80">{m}</ListItem>
                      ))}
                    </ul>
                  ) : <p className="text-zinc-500 text-sm">None listed.</p>}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "campaign":
        if (!report.campaign_recommendations) return <NoData />;
        return (
          <div key="campaign" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Campaign Strategy</h2>
              <p className="text-zinc-400">Strategic recommendations for your campaign</p>
            </div>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6">
                <p className="text-zinc-300 leading-relaxed">{report.campaign_recommendations.summary}</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-base">Recommended Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  {report.campaign_recommendations.recommended_objectives?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {report.campaign_recommendations.recommended_objectives.map((o, i) => (
                        <Tag key={i} variant="success">{o}</Tag>
                      ))}
                    </div>
                  ) : <p className="text-zinc-500 text-sm">None listed.</p>}
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-base">Success Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  {report.campaign_recommendations.success_metrics?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {report.campaign_recommendations.success_metrics.map((m, i) => (
                        <Tag key={i} variant="info">{m}</Tag>
                      ))}
                    </div>
                  ) : <p className="text-zinc-500 text-sm">None listed.</p>}
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-violet-950/10 border-violet-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-violet-400">
                    <Lightbulb className="w-5 h-5" /> Content Ideas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {report.campaign_recommendations.content_ideas?.length > 0 ? (
                    <ul className="space-y-3">
                      {report.campaign_recommendations.content_ideas.map((c, i) => (
                        <ListItem key={i} icon={Lightbulb} className="text-violet-100/80">{c}</ListItem>
                      ))}
                    </ul>
                  ) : <p className="text-zinc-500 text-sm">None listed.</p>}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-base">Key Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {report.campaign_recommendations.key_messages?.length > 0 ? (
                      <ul className="space-y-3">
                        {report.campaign_recommendations.key_messages.map((m, i) => (
                          <ListItem key={i} icon={Megaphone}>{m}</ListItem>
                        ))}
                      </ul>
                    ) : <p className="text-zinc-500 text-sm">None listed.</p>}
                  </CardContent>
                </Card>

                {report.campaign_recommendations.budget_recommendations && (
                  <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <DollarSign className="w-4 h-4 text-zinc-400" /> Budget
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-zinc-300">{report.campaign_recommendations.budget_recommendations}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        );

      case "platform":
        if (!report.platform_strategy) return <NoData />;
        return (
          <div key="platform" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Platform Strategy</h2>
              <p className="text-zinc-400">Channel selection and distribution strategy</p>
            </div>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6">
                <p className="text-zinc-300 leading-relaxed">{report.platform_strategy.summary}</p>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Platform Recommendations</h3>
              {report.platform_strategy.platform_recommendations?.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {report.platform_strategy.platform_recommendations.map((p, i) => (
                    <PlatformCard key={i} platform={p} />
                  ))}
                </div>
              ) : <NoData message="No platforms recommended." />}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-base">Targeting Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  {report.platform_strategy.targeting_strategies?.length > 0 ? (
                    <ul className="space-y-3">
                      {report.platform_strategy.targeting_strategies.map((t, i) => (
                        <ListItem key={i} icon={Target}>{t}</ListItem>
                      ))}
                    </ul>
                  ) : <p className="text-zinc-500 text-sm">None listed.</p>}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-base">Ad Formats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {report.platform_strategy.ad_format_suggestions?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {report.platform_strategy.ad_format_suggestions.map((f, i) => (
                          <Tag key={i} variant="primary">{f}</Tag>
                        ))}
                      </div>
                    ) : <p className="text-zinc-500 text-sm">None listed.</p>}
                  </CardContent>
                </Card>

                {report.platform_strategy.timing_recommendations && (
                  <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Clock className="w-4 h-4 text-zinc-400" /> Best Timing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">Best Days</p>
                          <p className="text-sm text-zinc-200">
                            {report.platform_strategy.timing_recommendations.best_days?.join(", ")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">Best Times</p>
                          <p className="text-sm text-zinc-200">
                            {report.platform_strategy.timing_recommendations.best_times?.join(", ")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden print:h-auto print:overflow-visible print:bg-white print:text-black">
      <style>{`
        @media print {
          @page { margin: 2cm; }
          
          /* Reset body and ensure white background */
          body { 
            background: white !important; 
            color: black !important; 
            overflow: visible !important;
          }

          /* Hide non-print elements */
          .print-hidden { display: none !important; }
          .print-visible { display: block !important; }
          .no-print { display: none !important; }
          
          /* Reset all positioning and z-indexes for print flow */
          main, div, section, article {
            position: static !important;
            z-index: auto !important;
          }

          /* Disable all animations and transitions */
          * {
            animation: none !important;
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important;
          }

          /* Aggressively remove dark backgrounds and shadows */
          [class*="bg-"], [class*="shadow-"], [class*="backdrop-"] {
            background-color: transparent !important;
            background-image: none !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
          }

          /* Add borders to cards for structure since backgrounds are gone */
          .border, [class*="border-"] {
            border-color: #e5e7eb !important;
            border-width: 1px !important;
            border-style: solid !important;
          }

          /* Force text colors */
          [class*="text-zinc-"], [class*="text-gray-"], [class*="text-slate-"], .text-white { color: #1f2937 !important; }
          [class*="text-emerald-"], [class*="text-green-"] { color: #059669 !important; }
          [class*="text-red-"], [class*="text-rose-"] { color: #dc2626 !important; }
          [class*="text-amber-"], [class*="text-yellow-"], [class*="text-orange-"] { color: #d97706 !important; }
          [class*="text-blue-"], [class*="text-sky-"], [class*="text-cyan-"] { color: #2563eb !important; }
          [class*="text-violet-"], [class*="text-purple-"], [class*="text-indigo-"] { color: #7c3aed !important; }
          
          /* Fix ScrollArea clipping */
          [data-slot="scroll-area-viewport"], [data-slot="scroll-area"] {
            height: auto !important;
            overflow: visible !important;
            display: block !important;
          }
          
          .break-after-page { break-after: page; }
        }
      `}</style>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-800 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 no-print
        `}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 px-2 mb-8">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-zinc-400 hover:text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="font-bold text-xl bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
              Advista
            </span>
          </div>

          <nav className="space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`
                    relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
                    ${isActive ? "text-violet-400" : "text-zinc-400 hover:text-zinc-200"}
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-sidebar-item"
                      className="absolute inset-0 bg-violet-500/10 border border-violet-500/20 rounded-lg"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-violet-400" : "text-zinc-500"}`} />
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-zinc-800 space-y-2">

            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              onClick={() => navigate("/chat")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Chat
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative print:h-auto print:overflow-visible print:block">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-black/50 backdrop-blur-md no-print">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <span className="font-semibold">Research Report</span>
          <div className="w-10" />
        </header>

        <ScrollArea className="flex-1 min-h-0 overflow-hidden">
          <div className="max-w-5xl mx-auto p-6 lg:p-10 print:p-0 print:max-w-none">
            {isPrinting ? (
              <div className="space-y-12 print:space-y-12">
                <div className="mb-8 print:mb-8 hidden print:block">
                  <h1 className="text-4xl font-bold text-black mb-2">Research Report</h1>
                  <p className="text-zinc-600">Generated on {new Date().toLocaleDateString()}</p>
                </div>
                {navItems.map((item) => (
                  <div key={item.id} className="break-after-page print:break-after-page">
                    <h2 className="text-2xl font-bold mb-6 text-black border-b border-zinc-300 pb-2">
                      {item.label}
                    </h2>
                    {renderContent(item.id)}
                  </div>
                ))}
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
