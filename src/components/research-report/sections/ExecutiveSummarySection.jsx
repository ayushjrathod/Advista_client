import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

export function ExecutiveSummarySection({ report, onExportPDF }) {
  if (!report) return null;
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
          onClick={onExportPDF}
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
}
