import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, DollarSign, Lightbulb, Target } from "lucide-react";
import { CompetitorCard } from "../cards";
import { ListItem, NoData } from "../ui";

export function CompetitorAnalysisSection({ competitorAnalysis }) {
  if (!competitorAnalysis) return <NoData />;

  return (
    <div key="competitor" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Competitor Analysis</h2>
        <p className="text-zinc-400">Landscape analysis and competitive advantages</p>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-6">
          <p className="text-zinc-300 leading-relaxed">{competitorAnalysis.summary}</p>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Main Competitors</h3>
        {competitorAnalysis.main_competitors?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitorAnalysis.main_competitors.map((c, i) => (
              <CompetitorCard key={i} competitor={c} />
            ))}
          </div>
        ) : (
          <NoData message="No competitors found." />
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <Lightbulb className="w-5 h-5" /> Differentiation Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {competitorAnalysis.differentiation_opportunities?.length > 0 ? (
              <ul className="space-y-3">
                {competitorAnalysis.differentiation_opportunities.map((d, i) => (
                  <ListItem key={i} icon={Target}>
                    {d}
                  </ListItem>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 text-sm">None listed.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" /> Competitive Advantages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {competitorAnalysis.competitive_advantages?.length > 0 ? (
              <ul className="space-y-3">
                {competitorAnalysis.competitive_advantages.map((a, i) => (
                  <ListItem key={i} icon={CheckCircle2}>
                    {a}
                  </ListItem>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 text-sm">None listed.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {competitorAnalysis.pricing_insights && (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-zinc-400" /> Pricing Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-300">{competitorAnalysis.pricing_insights}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
