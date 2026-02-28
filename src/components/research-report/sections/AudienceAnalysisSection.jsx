import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Target } from "lucide-react";
import { ListItem, NoData, Tag } from "../ui";

export function AudienceAnalysisSection({ audienceAnalysis }) {
  if (!audienceAnalysis) return <NoData />;

  return (
    <div key="audience" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Audience Analysis</h2>
        <p className="text-zinc-400">Understanding your target market</p>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-6">
          <p className="text-zinc-300 leading-relaxed">{audienceAnalysis.summary}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base">Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(audienceAnalysis.demographics || {}).map(([key, value]) => (
                <div key={key} className="p-3 rounded-lg bg-zinc-800/30">
                  <p className="text-xs text-zinc-500 capitalize mb-1">{key.replace(/_/g, " ")}</p>
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
            {audienceAnalysis.psychographics?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {audienceAnalysis.psychographics.map((p, i) => (
                  <Tag key={i} variant="info">
                    {p}
                  </Tag>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 text-sm">None listed.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-red-950/10 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-400">Pain Points</CardTitle>
          </CardHeader>
          <CardContent>
            {audienceAnalysis.pain_points?.length > 0 ? (
              <ul className="space-y-3">
                {audienceAnalysis.pain_points.map((p, i) => (
                  <ListItem key={i} icon={AlertTriangle} className="text-red-100/80">
                    {p}
                  </ListItem>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 text-sm">None listed.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-emerald-950/10 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-emerald-400">Motivations</CardTitle>
          </CardHeader>
          <CardContent>
            {audienceAnalysis.motivations?.length > 0 ? (
              <ul className="space-y-3">
                {audienceAnalysis.motivations.map((m, i) => (
                  <ListItem key={i} icon={Target} className="text-emerald-100/80">
                    {m}
                  </ListItem>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 text-sm">None listed.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
