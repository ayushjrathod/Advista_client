import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  LayoutGrid,
  Loader2,
  Megaphone,
  Menu,
  Package,
  Target,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { unwrapLambdaResponse } from "@/lib/lambdaResponse";
import api from "@/lib/api";
import {
  ActionItemsSection,
  AudienceAnalysisSection,
  CampaignStrategySection,
  CompetitorAnalysisSection,
  ExecutiveSummarySection,
  PlatformStrategySection,
  ProductAnalysisSection,
  ResearchReportSidebar,
  ResourcesTab,
  printStyles,
} from "@/components/research-report";

function renderContent(sectionId, report, resourcesUsed, onExportPDF) {
  switch (sectionId) {
    case "executive":
      return (
        <ExecutiveSummarySection report={report} onExportPDF={onExportPDF} />
      );
    case "actions":
      return <ActionItemsSection actionItems={report.action_items} />;
    case "product":
      return <ProductAnalysisSection productAnalysis={report.company_product_analysis} />;
    case "competitor":
      return (
        <CompetitorAnalysisSection
          competitorAnalysis={report.competitor_landscape_analysis}
        />
      );
    case "audience":
      return (
        <AudienceAnalysisSection
          audienceAnalysis={report.customer_sentiment_analysis}
        />
      );
    case "campaign":
      return (
        <CampaignStrategySection
          campaignRecommendations={report.strategic_recommendations}
        />
      );
    case "platform":
      return (
        <PlatformStrategySection
          platformStrategy={report.go_to_market_strategy}
        />
      );
    case "resources":
      return <ResourcesTab resourcesUsed={resourcesUsed} />;
    default:
      return null;
  }
}

export default function ResearchReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [report, setReport] = useState(null);
  const [resourcesUsed, setResourcesUsed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState("");
  const [activeSection, setActiveSection] = useState("executive");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleExportPDF = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const handleSectionChange = (id) => {
    setActiveSection(id);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  useEffect(() => {
    const fetchReport = async () => {
      if (location.state?.report) {
        setReport(location.state.report);
        setResourcesUsed(location.state.resourcesUsed ?? null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/api/v1/research/report", {
          params: sessionId ? { session_id: sessionId } : undefined,
        });
        const payload = unwrapLambdaResponse(res.data);
        setInfoMessage(payload?.message || "");
        setReport(payload?.report ?? payload);
        setResourcesUsed(payload?.resources_used ?? payload?.resourcesUsed ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [location.state, sessionId]);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { id: "executive", label: "Executive Summary", icon: BarChart3 },
    { id: "actions", label: "Action Items", icon: CheckCircle2 },
    { id: "product", label: "Company & Product", icon: Package },
    { id: "competitor", label: "Competitor Landscape", icon: Target },
    { id: "audience", label: "Customer Sentiment", icon: Users },
    { id: "campaign", label: "Strategic Recommendations", icon: Megaphone },
    { id: "platform", label: "Go-to-Market Strategy", icon: LayoutGrid },
    ...(resourcesUsed != null
      ? [{ id: "resources", label: "Resources Used", icon: ExternalLink }]
      : []),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          <p className="text-zinc-400 animate-pulse">
            Generating your research report...
          </p>
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
          <p className="text-zinc-400 mb-8">
            {error || infoMessage ||
              "No report found. Please try generating a new report."}
          </p>
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

  return (
    <div className="dark flex h-screen bg-black text-white overflow-hidden print:h-auto print:overflow-visible print:bg-white print:text-black">
      <style>{printStyles}</style>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-800 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 no-print
        `}
      >
        <ResearchReportSidebar
          navItems={navItems}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          onClose={() => setIsSidebarOpen(false)}
        />
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative print:h-auto print:overflow-visible print:block">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-black/50 backdrop-blur-md no-print">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <span className="font-semibold">Research Report</span>
          <div className="w-10" />
        </header>

        <ScrollArea className="flex-1 min-h-0 overflow-hidden">
          <div className="max-w-5xl mx-auto p-6 lg:p-10 print:p-0 print:max-w-none">
            {infoMessage ? (
              <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 no-print">
                {infoMessage}
              </div>
            ) : null}
            {isPrinting ? (
              <div className="space-y-12 print:space-y-12">
                <div className="mb-8 print:mb-8 hidden print:block">
                  <h1 className="text-4xl font-bold text-black mb-2">
                    Research Report
                  </h1>
                  <p className="text-zinc-600">
                    Generated on {new Date().toLocaleDateString()}
                  </p>
                </div>
                {navItems.map((item) => (
                  <div
                    key={item.id}
                    className="break-after-page print:break-after-page"
                  >
                    <h2 className="text-2xl font-bold mb-6 text-black border-b border-zinc-300 pb-2">
                      {item.label}
                    </h2>
                    {renderContent(
                      item.id,
                      report,
                      resourcesUsed,
                      handleExportPDF
                    )}
                  </div>
                ))}
              </div>
            ) : (
              renderContent(
                activeSection,
                report,
                resourcesUsed,
                handleExportPDF
              )
            )}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
