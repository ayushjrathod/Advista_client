import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, DollarSign, TrendingUp } from "lucide-react";

export function CompetitorCard({ competitor }) {
  if (!competitor) return null;
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
            {(competitor.strengths ?? []).slice(0, 3).map((s, i) => (
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
            {(competitor.weaknesses ?? []).slice(0, 3).map((w, i) => (
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

export function PlatformCard({ platform }) {
  if (!platform) return null;
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

export function ActionItem({ item, index }) {
  return (
    <div className="group flex items-start gap-4 p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all">
      <div className="w-6 h-6 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center flex-shrink-0 text-xs font-bold border border-violet-500/20 group-hover:scale-110 transition-transform">
        {index + 1}
      </div>
      <p className="text-zinc-300 text-sm leading-relaxed pt-0.5">{item}</p>
    </div>
  );
}
