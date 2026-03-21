import { HomeLayout } from "@/layouts";
import { Link } from "react-router-dom";
import {
  Bot,
  Github,
  Rocket,
  ExternalLink,
  Search,
  Coins,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "@/config/api";

/* =====================
   TYPES
===================== */
interface BotTemplate {
  id?: string;
  _id?: string;
  name: string;
  repoUrl: string;
  coinCost: number;
  sessionUrl?: string;
}

/* =====================
   PAGE
===================== */
export default function Templates() {
  const [templates, setTemplates] = useState<BotTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/bots/templates");
        setTemplates(data.templates || []);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return templates.filter((t) =>
      t.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [templates, query]);

  return (
    <HomeLayout>
      <section className="main max-w-[1200px] mx-auto py-10 px-4 space-y-8">
        {/* HEADER & SEARCH */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-space font-bold">Bot Templates</h1>
            <p className="text-muted text-sm">
              Select a template to deploy your new WhatsApp bot.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="
                w-full h-10 pl-10 pr-4
                rounded-xl border border-line
                bg-background/50 text-sm
                focus:border-primary/50 transition-all
              "
            />
          </div>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
          ) : filtered.length === 0 ? (
            <div className="col-span-full">
              <EmptyState />
            </div>
          ) : (
            filtered.map((tpl) => {
              const templateId = tpl.id || tpl._id;
              if (!templateId) return null;

              return (
                <div
                  key={templateId}
                  className="
                    flex flex-col h-full
                    glass border border-line rounded-2xl p-5
                    hover:border-primary/40 transition-all duration-300
                    hover:shadow-lg hover:shadow-primary/5
                  "
                >
                  {/* TOP: ICON & COST */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center text-primary">
                      <Bot size={20} />
                    </div>
                    
                    {/* Cost Pill */}
                    <div className="px-3 py-1 rounded-full bg-background border border-line text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Coins size={12} className="text-yellow-500" />
                      {tpl.coinCost > 0 ? tpl.coinCost : "Free"}
                    </div>
                  </div>

                  {/* MIDDLE: INFO & PILL LINKS */}
                  <div className="flex-1 space-y-4 mb-6">
                    <h3 className="font-semibold text-lg leading-tight truncate">
                      {tpl.name}
                    </h3>
                    
                    {/* The Pill Links */}
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={tpl.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          px-3 py-1.5 rounded-full
                          border border-line bg-background/50
                          text-xs font-medium text-muted-foreground
                          flex items-center gap-1.5
                          hover:text-primary hover:border-primary/30 hover:bg-primary/5
                          transition-colors
                        "
                      >
                        <Github size={12} />
                        GitHub
                      </a>

                      {tpl.sessionUrl && (
                        <a
                          href={tpl.sessionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            px-3 py-1.5 rounded-full
                            border border-line bg-background/50
                            text-xs font-medium text-muted-foreground
                            flex items-center gap-1.5
                            hover:text-primary hover:border-primary/30 hover:bg-primary/5
                            transition-colors
                          "
                        >
                          <ExternalLink size={12} />
                          Preview
                        </a>
                      )}
                    </div>
                  </div>

                  {/* BOTTOM: ACTION */}
                  <div className="mt-auto">
                    <Link
                      to={`/dashboard/deploy?templateId=${templateId}`}
                      className="
                        w-full h-10 rounded-xl
                        btn-primary text-sm font-medium
                        flex items-center justify-center gap-2
                      "
                    >
                      <Rocket size={15} />
                      Deploy Bot
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </HomeLayout>
  );
}

/* =====================
   EMPTY STATE
===================== */
function EmptyState() {
  return (
    <div className="glass border border-line rounded-2xl p-10 text-center space-y-2">
      <Bot size={32} className="mx-auto text-muted mb-2" />
      <p className="font-medium">No templates found</p>
      <p className="text-sm text-muted">Try a different search term.</p>
    </div>
  );
}

/* =====================
   SKELETON
===================== */
function Skeleton() {
  return (
    <div className="glass border border-line rounded-2xl p-5 flex flex-col h-[240px] animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-11 w-11 bg-line/50 rounded-xl" />
        <div className="h-6 w-16 bg-line/50 rounded-full" />
      </div>
      <div className="space-y-3 mb-6">
        <div className="h-5 w-3/4 bg-line/50 rounded" />
        <div className="flex gap-2">
          <div className="h-7 w-20 bg-line/50 rounded-full" />
          <div className="h-7 w-20 bg-line/50 rounded-full" />
        </div>
      </div>
      <div className="mt-auto h-10 w-full bg-line/50 rounded-xl" />
    </div>
  );
}
