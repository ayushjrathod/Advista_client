import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, FileText, Globe, MessageCircle, Play, Youtube } from "lucide-react";
import { NoData } from "./ui";

export function YouTubeResource({ item, type = "video" }) {
  const [showTranscript, setShowTranscript] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  if (!item) return null;
  const videoId = item.video_id;
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium text-white line-clamp-2">{item.title}</CardTitle>
            {item.channel && <p className="text-xs text-zinc-500 mt-1">{item.channel}</p>}
            {item.views_original && <p className="text-xs text-zinc-500">{item.views_original}</p>}
          </div>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
            title="Open in YouTube"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs h-8 border-zinc-700 hover:bg-zinc-800"
            onClick={() => setShowTranscript(!showTranscript)}
          >
            <FileText className="w-3.5 h-3.5" />
            {showTranscript ? "Hide transcript" : "View transcript"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs h-8 border-zinc-700 hover:bg-zinc-800"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Play className="w-3.5 h-3.5" />
            {showPreview ? "Hide preview" : "YouTube preview"}
          </Button>
        </div>
        {showPreview && videoId && (
          <div className="aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              title={item.title}
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        {showTranscript && item.transcript && (
          <div className="p-3 rounded-lg bg-zinc-800/50 text-zinc-300 text-sm leading-relaxed max-h-60 overflow-y-auto">
            {item.transcript}
          </div>
        )}
        {showTranscript && !item.transcript && (
          <p className="text-xs text-zinc-500 italic">No transcript available.</p>
        )}
      </CardContent>
    </Card>
  );
}

const CATEGORY_LABELS = {
  company_product: "Company & Product",
  competitor_landscape: "Competitor Landscape",
  customer_sentiment: "Customer Sentiment",
  strategic_gap: "Strategic Gaps",
  battlecard: "Battlecard",
};

export function ResourcesTab({ resourcesUsed }) {
  const hasCategories = (resourcesUsed?.categories?.length ?? 0) > 0;
  const hasYoutube =
    resourcesUsed?.youtube &&
    ((resourcesUsed.youtube.videos?.length ?? 0) > 0 || (resourcesUsed.youtube.shorts?.length ?? 0) > 0);

  if (!resourcesUsed || (!hasCategories && !hasYoutube)) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-bold text-white mb-2">Resources Used</h2>
        <NoData message="Resource data is not available. Generate a new report to see sources." />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Resources Used</h2>
        <p className="text-zinc-400">Sources and links used to generate this research report</p>
      </div>

      {(() => {
        const googleCats = resourcesUsed.categories?.filter((c) => c.source === "google") ?? [];
        const forumCats = resourcesUsed.categories?.filter((c) => c.source === "reddit_forums") ?? [];
        return (
          <>
            {googleCats.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-zinc-400" />
                  Google Search
                </h3>
                <div className="space-y-6">
                  {googleCats.map((cat) => (
                    <Card key={`google-${cat.category}`} className="bg-zinc-900/50 border-zinc-800">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded bg-zinc-800">
                            <Globe className="w-4 h-4 text-blue-500" />
                          </div>
                          <CardTitle className="text-base">
                            {CATEGORY_LABELS[cat.category] || cat.category}
                          </CardTitle>
                        </div>
                        {cat.query && <p className="text-xs text-zinc-500 mt-1">{cat.query}</p>}
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {cat.resources?.map((r, i) => (
                            <li key={i} className="flex items-start gap-3 group">
                              <ExternalLink className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <a
                                  href={r.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-medium text-violet-400 hover:text-violet-300 hover:underline line-clamp-2"
                                >
                                  {r.title}
                                </a>
                                {r.source && <p className="text-xs text-zinc-500 mt-0.5">{r.source}</p>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {forumCats.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-orange-500" />
                  Forums & Communities
                </h3>
                <div className="space-y-6">
                  {forumCats.map((cat) => (
                    <Card key={`forum-${cat.category}`} className="bg-zinc-900/50 border-zinc-800">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded bg-zinc-800">
                            <MessageCircle className="w-4 h-4 text-orange-500" />
                          </div>
                          <CardTitle className="text-base">
                            {CATEGORY_LABELS[cat.category] || cat.category}
                          </CardTitle>
                        </div>
                        {cat.query && <p className="text-xs text-zinc-500 mt-1">{cat.query}</p>}
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {cat.resources?.map((r, i) => {
                            const forumName = r.source || "Forum";
                            return (
                              <li key={i} className="flex items-start gap-3 group">
                                <ExternalLink className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                                <div className="min-w-0 flex-1">
                                  <a
                                    href={r.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-violet-400 hover:text-violet-300 hover:underline line-clamp-2"
                                  >
                                    {r.title}
                                  </a>
                                  <p className="text-xs text-zinc-500 mt-0.5">
                                    <span className="text-orange-500/90 font-medium">{forumName}</span>
                                  </p>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        );
      })()}

      {resourcesUsed.youtube && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-500" />
            YouTube
          </h3>
          {resourcesUsed.youtube.videos?.length > 0 && (
            <div>
              <p className="text-sm text-zinc-400 mb-4">Top videos</p>
              <div className="grid gap-4 md:grid-cols-2">
                {resourcesUsed.youtube.videos.map((v, i) => (
                  <YouTubeResource key={`v-${i}`} item={v} type="video" />
                ))}
              </div>
            </div>
          )}
          {resourcesUsed.youtube.shorts?.length > 0 && (
            <div>
              <p className="text-sm text-zinc-400 mb-4">Shorts</p>
              <div className="grid gap-4 md:grid-cols-2">
                {resourcesUsed.youtube.shorts.map((s, i) => (
                  <YouTubeResource key={`s-${i}`} item={s} type="short" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
