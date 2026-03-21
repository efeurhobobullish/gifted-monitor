import { HomeLayout } from "@/layouts";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/config/api";
import { toast } from "sonner";
import {
  Github,
  ExternalLink,
  Rocket,
  CheckCircle2,
} from "lucide-react";
import { ButtonWithLoader } from "@/components/ui";

/* ================= TYPES ================= */
interface EnvField {
  key: string;
  label: string;
  type: "string" | "number" | "boolean";
  required: boolean;
  value?: string;
}

interface Template {
  _id: string;
  name: string;
  coinCost: number;
  repoUrl: string;
  sessionUrl?: string;
}

export default function Deploy() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const templateId = params.get("templateId");

  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);

  const [template, setTemplate] = useState<Template | null>(null);
  const [envSchema, setEnvSchema] = useState<EnvField[]>([]);
  const [env, setEnv] = useState<Record<string, any>>({});
  const [botName, setBotName] = useState("");

  /* ================= LOAD TEMPLATE ================= */
  useEffect(() => {
    if (!templateId || templateId === "undefined") {
      navigate("/dashboard/templates");
      return;
    }

    const fetchTemplate = async () => {
      try {
        setLoading(true);

        const { data } = await api.get(
          `/bots/templates/${templateId}/env`
        );

        setTemplate(data.template);
        setEnvSchema(data.envSchema || []);

        /* ✅ FILL VALUES FROM BACKEND */
        const initialEnv: Record<string, any> = {};
        (data.envSchema || []).forEach((f: EnvField) => {
          if (f.type === "boolean") {
            initialEnv[f.key] = f.value === "true";
          } else if (f.type === "number") {
            initialEnv[f.key] = f.value ? Number(f.value) : "";
          } else {
            initialEnv[f.key] = f.value ?? "";
          }
        });

        setEnv(initialEnv);
      } catch {
        toast.error("Failed to load template configuration");
        navigate("/dashboard/templates");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId, navigate]);

  /* ================= UPDATE ENV ================= */
  const updateEnv = (key: string, value: any) => {
    setEnv((prev) => ({ ...prev, [key]: value }));
  };

  /* ================= DEPLOY ================= */
  const deploy = async () => {
    if (!botName.trim()) {
      toast.error("Bot name is required");
      return;
    }

    try {
      setDeploying(true);

      await api.post("/bots/deploy", {
        name: botName,
        templateId,
        env,
      });

      toast.success("Bot deployed successfully");
      navigate("/dashboard/bots");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Deployment failed"
      );
    } finally {
      setDeploying(false);
    }
  };

  if (loading || !template) {
    return (
      <HomeLayout>
        <section className="main py-12 text-muted">
          Loading deployment configuration…
        </section>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <section className="main max-w-[980px] py-12 space-y-12">
        {/* ================= HEADER ================= */}
        <div className="space-y-3">
          <h1 className="text-2xl font-space font-semibold">
            Deploy {template.name}
          </h1>
          <p className="text-sm text-muted">
            Deployment cost:{" "}
            <span className="font-medium text-primary">
              {template.coinCost} coins
            </span>
          </p>
        </div>

        {/* ================= META ================= */}
        <div className="flex flex-wrap gap-4">
          <a
            href={template.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2
              h-10 px-5 rounded-lg
              border border-line bg-secondary
              hover:border-primary transition
              text-sm
            "
          >
            <Github size={16} />
            Repository
          </a>

          {template.sessionUrl && (
            <a
              href={template.sessionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2
                h-10 px-5 rounded-lg
                border border-line bg-secondary
                hover:border-primary transition
                text-sm
              "
            >
              <ExternalLink size={16} />
              Generate Session
            </a>
          )}
        </div>

        {/* ================= BOT NAME ================= */}
        <div className="space-y-2 max-w-md">
          <label className="text-sm font-medium">
            Bot Name
          </label>
          <input
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            placeholder="My Empire Bot"
            className="
              h-11 w-full rounded-lg
              border border-line bg-background px-4
              focus:border-primary outline-none
            "
          />
        </div>

        {/* ================= ENV CONFIG ================= */}
        <div className="glass border border-line rounded-2xl p-8 space-y-8">
          <h3 className="font-semibold">
            Environment Configuration
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {envSchema.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  {field.label}
                  {field.required && (
                    <CheckCircle2
                      size={14}
                      className="text-primary"
                    />
                  )}
                </label>

                {field.type === "boolean" ? (
                  <div className="flex gap-3">
                    {[
                      { label: "True", val: true },
                      { label: "False", val: false },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() =>
                          updateEnv(field.key, opt.val)
                        }
                        className={`
                          flex-1 h-10 rounded-lg border text-sm transition
                          ${
                            env[field.key] === opt.val
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-line text-muted hover:border-primary"
                          }
                        `}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    value={env[field.key] ?? ""}
                    onChange={(e) =>
                      updateEnv(field.key, e.target.value)
                    }
                    className="
                      h-11 w-full rounded-lg
                      border border-line bg-background px-4
                      focus:border-primary outline-none
                    "
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ================= ACTION ================= */}
        <div className="flex justify-end">
          <ButtonWithLoader
            loading={deploying}
            initialText="Deploy Bot"
            loadingText="Deploying..."
            onClick={deploy}
            className="
              h-11 px-14 rounded-full
              btn-primary
              flex items-center gap-2
            "
          >
            <Rocket size={16} />
          </ButtonWithLoader>
        </div>
      </section>
    </HomeLayout>
  );
}