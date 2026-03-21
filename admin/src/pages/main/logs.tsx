import { HomeLayout } from "@/layouts";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Terminal, Download } from "lucide-react";
import api from "@/config/api";
import { toast } from "sonner";

export default function BotLogs() {
  const { botId } = useParams<{ botId: string }>();

  const [loading, setLoading] = useState(true);
  const [logUrl, setLogUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [limit, setLimit] = useState<number>(500);
  const [streamError, setStreamError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  /* ================= FETCH LOG URL ================= */
  useEffect(() => {
    if (!botId) {
      toast.error("Invalid bot");
      return;
    }

    const init = async () => {
      try {
        setLoading(true);
        setStreamError(null);
        const { data } = await api.get(`/bots/${botId}/logs`);
        const url = data?.logUrl ?? null;
        setLogUrl(url);
        if (!url) {
          toast.error("Log stream URL not available");
        }
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || "Failed to load logs"
        );
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [botId]);

  /* ================= STREAM LOGS ================= */
  useEffect(() => {
    if (!logUrl) return;

    setStreamError(null);
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const stream = async () => {
      try {
        const res = await fetch(logUrl, {
          signal: abortRef.current!.signal,
        });

        const reader = res.body?.getReader();
        if (!reader) {
          setStreamError("Stream not supported");
          return;
        }

        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);

          if (lines.length > 0) {
            setLogs((prev) =>
              [...prev, ...lines].slice(-limit)
            );
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Connection failed";
        setStreamError(message);
      }
    };

    stream();
    return () => abortRef.current?.abort();
  }, [logUrl, limit]);

  /* ================= DOWNLOAD ================= */
  const downloadLogs = () => {
    if (logs.length === 0) {
      toast.error("No logs to download");
      return;
    }

    const blob = new Blob([logs.join("\n")], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `empirehost-bot-logs-${Date.now()}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <HomeLayout>
      <section className="main max-w-[1150px] py-10 space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold font-space">
              Bot Logs
            </h1>
            <p className="text-muted text-sm">
              Live runtime logs (Heroku)
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Lines Selector */}
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="
                h-10 px-4 rounded-full
                border border-line bg-background
                text-sm
              "
            >
              <option value={100}>Last 100 lines</option>
              <option value={300}>Last 300 lines</option>
              <option value={500}>Last 500 lines</option>
              <option value={1000}>Last 1000 lines</option>
            </select>

            {/* Download */}
            <button
              onClick={downloadLogs}
              className="
                h-10 px-5 rounded-full
                border border-line
                flex items-center gap-2
                hover:border-primary transition
              "
            >
              <Download size={14} />
              Download
            </button>
          </div>
        </div>

        {/* ================= TERMINAL ================= */}
        {loading ? (
          <div className="glass border border-line rounded-2xl p-6 animate-pulse space-y-3">
            <div className="h-4 w-40 bg-foreground rounded" />
            <div className="h-3 w-full bg-foreground rounded" />
            <div className="h-3 w-full bg-foreground rounded" />
            <div className="h-3 w-2/3 bg-foreground rounded" />
          </div>
        ) : (
          <div className="glass border border-line rounded-2xl overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-secondary">
              <Terminal size={14} />
              <span className="text-sm font-medium">
                EmpireHost Runtime Output
              </span>
            </div>

            {/* Logs */}
            <div
              className="
                h-[460px]
                overflow-y-auto
                bg-black
                text-green-400
                font-mono
                text-xs
                p-4
                space-y-1
              "
            >
              {logs.length === 0 && !streamError ? (
                <p className="text-muted">
                  Waiting for logs…
                </p>
              ) : streamError ? (
                <p className="text-amber-400">
                  {streamError}
                </p>
              ) : (
                logs.map((line, i) => (
                  <div
                    key={`${i}-${line.slice(0, 20)}`}
                    className="whitespace-pre-wrap"
                  >
                    {line}
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>
          </div>
        )}
      </section>
    </HomeLayout>
  );
}