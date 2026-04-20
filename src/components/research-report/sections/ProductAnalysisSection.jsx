import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import { ListItem, NoData, Tag } from "../ui";

export function ProductAnalysisSection({ productAnalysis }) {
  if (!productAnalysis) return <NoData />;

  return (
    <div key="product" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Company & Product</h2>
        <p className="text-zinc-400">Deep dive into product capabilities and market position</p>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-6">
          <p className="text-zinc-300 leading-relaxed">{productAnalysis.summary}</p>
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
            {productAnalysis.strengths?.length > 0 ? (
              <ul className="space-y-3">
                {productAnalysis.strengths.map((s, i) => (
                  <ListItem key={i} icon={CheckCircle2} className="text-emerald-100/80">
                    {s}
                  </ListItem>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 text-sm">No strengths listed.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-red-950/10 border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" /> Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productAnalysis.weaknesses?.length > 0 ? (
              <ul className="space-y-3">
                {productAnalysis.weaknesses.map((w, i) => (
                  <ListItem key={i} icon={AlertTriangle} className="text-red-100/80">
                    {w}
                  </ListItem>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 text-sm">No weaknesses listed.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base">Key Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            {productAnalysis.key_capabilities?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {productAnalysis.key_capabilities.map((f, i) => (
                  <Tag key={i} variant="primary">
                    {f}
                  </Tag>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 text-sm">No key capabilities listed.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base">Industry Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {productAnalysis.trends?.length > 0 ? (
              <ul className="space-y-2">
                {productAnalysis.trends.map((t, i) => (
                  <ListItem key={i} icon={TrendingUp}>
                    {t}
                  </ListItem>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 text-sm">No trends listed.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
