import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spotlight } from "@/components/ui/spotlight-new";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { buildAuthHeaders } from "@/lib/firebase";
import {
  Bot,
  ChevronRight,
  Loader2,
  PanelRightClose,
  PanelRightOpen,
  SendHorizonal,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/use-auth";
import { AnimatePresence, motion } from "framer-motion";

const starterPrompts = [
  "We help B2B SaaS teams monitor competitor pricing and positioning.",
  "I want a battlecard-ready view of competitors in the market.",
  "Help me map customer pain points and whitespace opportunities.",
];

const briefFieldLabels = {
  company_name: "Company",
  product_description: "Product Description",
  target_customers: "Target Customers",
  strategic_goals: "Strategic Goals",
  competitor_names: "Competitors",
  primary_channels: "Primary Channels",
  positioning_hypothesis: "Positioning",
  additional_context: "Additional Context",
};

function BriefItem({ label, value }) {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return null;
  }

  return (
    <div className="border-b border-white/6 py-3 last:border-b-0">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500">{label}</p>
      <p className="text-sm leading-6 text-zinc-100">{Array.isArray(value) ? value.join(", ") : value}</p>
    </div>
  );
}

export default function ChatBot() {
  const navigate = useNavigate();
  const { authMessage, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [researchBrief, setResearchBrief] = useState(null);
  const [showBriefPreview, setShowBriefPreview] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [showAuthNotice, setShowAuthNotice] = useState(false);
  const [showHeader, setShowHeader] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const initializationDone = useRef(false);
  const hasInteracted = useRef(false);

  const scrollToBottom = () => {
    if (!hasInteracted.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!isAuthenticated && authMessage) {
      setShowAuthNotice(true);
      return;
    }

    setShowAuthNotice(false);
  }, [authMessage, isAuthenticated]);

  // Refocus input field after sending a message (skip on initial load)
  useEffect(() => {
    if (hasInteracted.current && inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [messages.length, isLoading]);

  // Initialize chat session
  useEffect(() => {
    if (initializationDone.current) return;
    initializationDone.current = true;

    const initializeChat = async () => {
      try {
        setIsLoading(true);
        // Optionally: add a welcome bot message
        setMessages([
          {
            id: Date.now(),
            role: "bot",
            content:
              "Hi! I'm your Competitive Intelligence assistant. Tell me about your company and what you want to understand about your competitive landscape — who you are, who you compete with, and what you're trying to learn.",
          },
        ]);
      } catch (error) {
        console.error("Error initializing chat:", error);
        setErrorMessage("Something went wrong while starting the chat. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, []);

  const sendUserMessage = async (message) => {
    hasInteracted.current = true;
    setShowHeader(false);
    // Add user message
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", content: message }]);
    setInput("");

    let tid = threadId;

    // Only initialize thread once
    if (!tid) {
      const nextThreadId = await api
        .get("/api/v1/chat/initialize-thread", {
          timeout: 30000,
        })
        .then((res) => res?.data?.thread_id);

      if (!nextThreadId) {
        setErrorMessage("Chat not initialized. Please refresh and try again.");
        setInput(message);
        return;
      }
      tid = nextThreadId;
      setThreadId(tid);
    }

    //reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    try {
      await sendStreamingMessage(message, tid);
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMessage("The chat service took too long to respond. Please try again.");
    }
  };
 

  const fetchResearchBrief = async (tid) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/chat/research-brief/${tid}`,
        {
          headers: await buildAuthHeaders(),
        }
      );
      if (res.ok) {
        const data = await res.json();
        setResearchBrief(data);
        // Show preview if brief has any progress at all
        if (data?.is_complete || (data?.completion_percentage ?? 0) > 0) {
          setShowBriefPreview(true);
        }
      }
    } catch (error) {
      console.error("Error fetching research brief:", error);
    }
  };

  const handleConfirmBrief = async () => {
    if (!researchBrief?.brief || !threadId) return;

    try {
      setIsResearching(true);
      setShowBriefPreview(false);

      // Add progress message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "bot",
          content: "🔍 Starting research... I'm gathering competitive intelligence data and analyzing your market.",
        },
      ]);

      const searchRes = await api.post("/api/v1/research/start-research", {
        research_brief: researchBrief.brief,
        threadId,
      }, { timeout: 300000 });
      const data = searchRes.data;

      // Update progress
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "bot",
          content: "📊 Processing search results and analyzing data...",
        },
      ]);

      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay for UX

      // Update progress
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "bot",
          content: "🧠 Synthesizing insights with AI... Almost done!",
        },
      ]);

      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay for UX

      // Success - navigate to report page with the data
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "bot",
          content: "✅ Research complete! Redirecting to your report...",
        },
      ]);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay for UX

      const sessionId = data.session_id;
      navigate(`/research-report${sessionId ? `?session_id=${sessionId}` : ""}`, {
        state: {
          report: data.report,
          sessionId,
          brief: data.brief,
          resourcesUsed: data.resources_used,
        }
      });

    } catch (error) {
      console.error("Error in research pipeline:", error);
      setErrorMessage(error.message || "Failed to complete research. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "bot",
          content: `❌ Error: ${error.message || "Failed to complete research. Please try again."}`,
        },
      ]);
      setIsResearching(false);
    }
  };

  const sendStreamingMessage = async (message, tid) => {
    try {
      setIsLoading(true);
      const botId = Date.now() + 1;
      const appendChunk = (chunk) => {
        if (!chunk) return false;

        let messageAdded = false;
        setMessages((prev) => {
          const existingIndex = prev.findIndex((m) => m.id === botId);

          if (existingIndex === -1) {
            messageAdded = true;
            return [...prev, { id: botId, role: "bot", content: chunk }];
          }

          return prev.map((m) =>
            m.id === botId ? { ...m, content: `${m.content || ""}${chunk}` } : m
          );
        });

        return messageAdded;
      };

      const processSseBuffer = (rawBuffer, flush = false) => {
        const normalizedBuffer = rawBuffer.replace(/\r\n/g, "\n");
        const frames = normalizedBuffer.split("\n\n");
        const remainder = flush ? "" : frames.pop() || "";
        let receivedChunk = false;

        for (const frame of frames) {
          const dataLines = frame
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.slice(5).trim())
            .filter(Boolean);

          if (dataLines.length > 0) {
            const chunk = dataLines.join("\n");
            const addedFirstMessage = appendChunk(chunk);
            receivedChunk = true;
            if (addedFirstMessage) {
              setIsLoading(false);
            }
          }
        }

        return { remainder, receivedChunk };
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/chat/stream`, {
        method: "POST",
        headers: await buildAuthHeaders({
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        }),
        body: JSON.stringify({ thread_id: tid, message }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("You are not authenticated right now, but you can still continue since this is a personal project.");
        }
        throw new Error(`Streaming request failed with status ${res.status}`);
      }

      if (!res.body) {
        throw new Error("No response body received");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let botMessageAdded = false;

      while (true) {
        const { value, done } = await reader.read();
        if (value) {
          buffer += decoder.decode(value, { stream: !done });
        }

        const processed = processSseBuffer(buffer, done);
        buffer = processed.remainder;
        if (processed.receivedChunk) {
          botMessageAdded = true;
        }

        if (done) {
          const trailing = decoder.decode();
          if (trailing) {
            const finalProcessed = processSseBuffer(buffer + trailing, true);
            if (finalProcessed.receivedChunk) {
              botMessageAdded = true;
            }
          }
          break;
        }
      }

      // If no content was received, ensure loading is stopped
      if (!botMessageAdded) {
        setIsLoading(false);
      }

      // After message is complete, fetch updated research brief
      await fetchResearchBrief(tid);
    } catch (error) {
      console.error("Streaming error:", error);
      setErrorMessage("There was a problem streaming the response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"; // Max height of 120px
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await sendUserMessage(input);
  };

  const handleStarterPrompt = async (prompt) => {
    if (isLoading) return;
    await sendUserMessage(prompt);
  };

  const hasAuthNotice = !isAuthenticated && authMessage && showAuthNotice;
  const authNoticeMessage = hasAuthNotice
    ? "You're not signed in, but you can still use the chatbot. Consider it as a trial"
    : "";
  const briefCompletion = Math.round(researchBrief?.completion_percentage ?? 0);
  const briefEntries = researchBrief?.brief
    ? Object.entries(researchBrief.brief).filter(([, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        return Boolean(value);
      })
    : [];
  const canGenerateReport = Boolean(researchBrief && (researchBrief.is_complete || researchBrief.completion_percentage >= 70));

  return (
    <div className="relative min-h-dvh overflow-x-hidden overflow-y-auto bg-[#08090A] text-white">
      {hasAuthNotice ? (
        <div className="fixed top-4 right-4 z-50 flex items-start gap-3 rounded-xl border border-white/10 bg-zinc-900/90 px-4 py-3 text-sm text-zinc-200 shadow-lg backdrop-blur-md">
          <p className="leading-6">{authNoticeMessage}</p>
          <button
            type="button"
            onClick={() => setShowAuthNotice(false)}
            className="mt-0.5 shrink-0 text-zinc-400 transition-colors hover:text-white"
            aria-label="Dismiss notice"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}
      <Spotlight />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_26%)]" />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1440px] flex-col box-border px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:px-6 lg:px-8 lg:pt-[max(1rem,env(safe-area-inset-top))] lg:pb-4">
        <AnimatePresence>
          {showHeader ? (
            <motion.div
              key="header"
              initial={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0, marginBottom: 0, paddingBottom: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="mb-4 overflow-hidden border-b border-white/8 pb-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-500">
                    <span className="text-violet-200">Advista Copilot</span>
                    <span className="text-zinc-700">•</span>
                    <span>Competitive Intelligence</span>
                  </div>
                  <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">Build your research brief</h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-[15px]">
                    Describe your company, competitors, customer pains, and strategic goals. The brief updates automatically as you chat.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <span>{messages.length} messages</span>
                  <span className="text-zinc-700">•</span>
                  <span>{briefCompletion}% brief complete</span>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1.45fr)_380px] xl:grid-cols-[minmax(0,1.65fr)_400px]">
          <Card className="flex min-h-[calc(100dvh-11rem)] flex-col border-white/8 bg-white/[0.02] py-0 backdrop-blur-xl">
            <CardContent className="flex items-center justify-between gap-4 border-b border-white/6 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">Conversation</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Research intake chat</h2>
              </div>
              {researchBrief ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBriefPreview((prev) => !prev)}
                  className="border-white/10 bg-transparent text-white hover:bg-white/[0.04]"
                >
                  {showBriefPreview ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                  {showBriefPreview ? "Hide brief" : "Show brief"}
                </Button>
              ) : null}
            </CardContent>

            <ScrollArea className="flex-1 px-4 py-4 sm:px-6 sm:py-5">
              <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 pb-4">
                {messages.length <= 1 ? (
                  <div className="pb-2">
                    <p className="mb-3 text-sm text-zinc-400">Try one of these to get started:</p>
                    <div className="flex flex-wrap gap-2">
                      {starterPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => handleStarterPrompt(prompt)}
                          className="rounded-full border border-white/10 px-4 py-2 text-left text-sm text-zinc-300 transition hover:border-violet-400/30 hover:text-white"
                        >
                          <span className="flex items-center gap-2">
                            <span>{prompt}</span>
                            <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
                  >
                    {m.role !== "user" ? (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-100 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                        <Bot className="h-4 w-4" />
                      </div>
                    ) : null}

                    <div
                      className={cn(
                        "max-w-[88%] rounded-[24px] border px-4 py-3 sm:max-w-[78%] sm:px-5 sm:py-4",
                        m.role === "user"
                          ? "border-white/10 bg-black text-white"
                          : "border-white/8 bg-white/[0.03] text-zinc-100"
                      )}
                    >
                      <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400">
                        <span className={cn("inline-flex items-center gap-1", m.role === "user" ? "text-violet-100/90" : "text-zinc-400")}>{m.role === "user" ? "You" : "Advista AI"}</span>
                      </div>
                      <p className="whitespace-pre-wrap text-[15px] leading-7">{m.content}</p>
                    </div>

                    {m.role === "user" ? (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white">
                        <User className="h-4 w-4" />
                      </div>
                    ) : null}
                  </div>
                ))}

                {isLoading ? (
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-100">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-4">
                      <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400">
                        <span>Advista AI</span>
                        <span className="text-zinc-600">•</span>
                        <span>Thinking</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-300">
                        <Loader2 className="h-4 w-4 animate-spin text-violet-300" />
                        <span>Analyzing your input and updating the brief…</span>
                      </div>
                    </div>
                  </div>
                ) : null}

                {errorMessage ? (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {errorMessage}
                  </div>
                ) : null}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t border-white/6 px-4 py-4 sm:px-6 sm:py-5">
              <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-4xl flex-col gap-3">
                <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-transparent">
                  <textarea
                    ref={inputRef}
                    className="min-h-[72px] w-full resize-none bg-transparent px-5 py-4 pr-16 text-[15px] leading-7 text-zinc-100 outline-none placeholder:text-zinc-500"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Describe your company, market, competitors, or the strategic questions you want answered..."
                    disabled={isLoading}
                    aria-label="Type your message"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onSubmit(e);
                      }
                    }}
                  />
                  <div className="absolute bottom-3 right-3">
                    <Button
                      type="submit"
                      size="icon"
                      className="h-11 w-11 rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-950/40 hover:bg-violet-500"
                      disabled={isLoading || !input.trim()}
                      aria-label="Send message"
                    >
                      <SendHorizonal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
                  <p>Press Enter to send, Shift + Enter for a new line.</p>
                  <p>The brief updates automatically as you chat.</p>
                </div>
              </form>
            </div>
          </Card>

          <aside className={cn("flex flex-col gap-4", !researchBrief && "lg:opacity-100", researchBrief && !showBriefPreview && "hidden lg:flex") }>
            <Card className="border-white/8 bg-white/[0.02] py-0 backdrop-blur-xl lg:sticky lg:top-6">
              <CardContent className="px-5 py-5 sm:px-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">Live brief</p>
                    <h2 className="mt-1 text-lg font-semibold text-white">Research brief preview</h2>
                  </div>
                  {researchBrief ? (
                    <div className="px-3 py-1 text-xs font-medium text-zinc-400">
                      {briefCompletion}%
                    </div>
                  ) : null}
                </div>

                {researchBrief ? (
                  <>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/6">
                      <div
                        className="h-full rounded-full bg-white transition-all"
                        style={{ width: `${briefCompletion}%` }}
                      />
                    </div>

                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      {canGenerateReport
                        ? "You have enough detail to generate a report now, or keep adding context for a stronger output."
                        : "Keep chatting to fill in competitors, target customers, channels, and strategic goals."}
                    </p>

                    <div className="mt-5">
                      {briefEntries.length > 0 ? (
                        briefEntries.map(([key, value]) => (
                          <BriefItem key={key} label={briefFieldLabels[key] || key} value={value} />
                        ))
                      ) : (
                        <div className="py-3 text-sm leading-6 text-zinc-500">
                          No brief fields captured yet. Start the conversation and this panel will fill in automatically.
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex flex-col gap-3">
                      <Button
                        onClick={handleConfirmBrief}
                        disabled={isResearching || !canGenerateReport}
                        className="h-11 rounded-2xl bg-black text-white hover:bg-zinc-900"
                      >
                        {isResearching ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating CI report...
                          </>
                        ) : (
                          <>
                            Generate CI Report
                          </>
                        )}
                      </Button>

                      {!showBriefPreview ? null : (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setShowBriefPreview(false)}
                          className="text-zinc-400 hover:bg-white/[0.04] hover:text-white lg:hidden"
                        >
                          <PanelRightClose className="h-4 w-4" />
                          Hide brief
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="mt-4 text-sm leading-6 text-zinc-500">
                    This panel stays updated with the brief as the assistant extracts key company, market, and competitor context.
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
