import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Target } from "lucide-react";
import { PlatformCard } from "../cards";
import { ListItem, NoData, Tag } from "../ui";

export function PlatformStrategySection({ platformStrategy }) {
  if (!platformStrategy) return <NoData />;

  return (
    <div key="platform" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Platform Strategy</h2>
        <p className="text-zinc-400">Channel selection and distribution strategy</p>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-6">
          <p className="text-zinc-300 leading-relaxed">{platformStrategy.summary}</p>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Platform Recommendations</h3>
        {platformStrategy.platform_recommendations?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformStrategy.platform_recommendations.map((p, i) => (
              <PlatformCard key={i} platform={p} />
            ))}
          </div>
        ) : (
          <NoData message="No platforms recommended." />
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base">Targeting Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            {platformStrategy.targeting_strategies?.length > 0 ? (
              <ul className="space-y-3">
                {platformStrategy.targeting_strategies.map((t, i) => (
                  <ListItem key={i} icon={Target}>
                    {t}
                  </ListItem>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 text-sm">None listed.</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-base">Ad Formats</CardTitle>
            </CardHeader>
            <CardContent>
              {platformStrategy.ad_format_suggestions?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {platformStrategy.ad_format_suggestions.map((f, i) => (
                    <Tag key={i} variant="primary">
                      {f}
                    </Tag>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 text-sm">None listed.</p>
              )}
            </CardContent>
          </Card>

          {platformStrategy.timing_recommendations && (
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
                      {platformStrategy.timing_recommendations.best_days?.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Best Times</p>
                    <p className="text-sm text-zinc-200">
                      {platformStrategy.timing_recommendations.best_times?.join(", ")}
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
}
