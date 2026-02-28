import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Lightbulb, Megaphone } from "lucide-react";
import { ListItem, NoData, Tag } from "../ui";

export function CampaignStrategySection({ campaignRecommendations }) {
  if (!campaignRecommendations) return <NoData />;

  return (
    <div key="campaign" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Campaign Strategy</h2>
        <p className="text-zinc-400">Strategic recommendations for your campaign</p>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-6">
          <p className="text-zinc-300 leading-relaxed">{campaignRecommendations.summary}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base">Recommended Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            {campaignRecommendations.recommended_objectives?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {campaignRecommendations.recommended_objectives.map((o, i) => (
                  <Tag key={i} variant="success">
                    {o}
                  </Tag>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 text-sm">None listed.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base">Success Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            {campaignRecommendations.success_metrics?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {campaignRecommendations.success_metrics.map((m, i) => (
                  <Tag key={i} variant="info">
                    {m}
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
        <Card className="bg-violet-950/10 border-violet-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-violet-400">
              <Lightbulb className="w-5 h-5" /> Content Ideas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {campaignRecommendations.content_ideas?.length > 0 ? (
              <ul className="space-y-3">
                {campaignRecommendations.content_ideas.map((c, i) => (
                  <ListItem key={i} icon={Lightbulb} className="text-violet-100/80">
                    {c}
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
              <CardTitle className="text-base">Key Messages</CardTitle>
            </CardHeader>
            <CardContent>
              {campaignRecommendations.key_messages?.length > 0 ? (
                <ul className="space-y-3">
                  {campaignRecommendations.key_messages.map((m, i) => (
                    <ListItem key={i} icon={Megaphone}>
                      {m}
                    </ListItem>
                  ))}
                </ul>
              ) : (
                <p className="text-zinc-500 text-sm">None listed.</p>
              )}
            </CardContent>
          </Card>

          {campaignRecommendations.budget_recommendations && (
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="w-4 h-4 text-zinc-400" /> Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300">{campaignRecommendations.budget_recommendations}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
