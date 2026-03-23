import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import api from "@/config/api";
import {
  ButtonWithLoader,
  InputWithoutIcon,
  Modal,
  SelectWithoutIcon,
} from "@/components/ui";
import InputCheck from "@/components/ui/input-check";

interface AddMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const FALLBACK_INTERVAL_OPTIONS = [5, 10, 30, 60];

function cleanBaseUrl(url: string) {
  return url.trim().replace(/\/+$/, "");
}

function cleanPath(path: string) {
  const p = path.trim();
  if (!p) return "";
  return p.startsWith("/") ? p : `/${p}`;
}

export default function AddMonitorModal({
  isOpen,
  onClose,
  onCreated,
}: AddMonitorModalProps) {
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [path, setPath] = useState("");
  const [method, setMethod] = useState<"GET" | "HEAD" | "POST">("GET");
  const [interval, setInterval] = useState<number>(5);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(false);
  const [allowedIntervals, setAllowedIntervals] = useState<number[]>(
    FALLBACK_INTERVAL_OPTIONS,
  );
  const [whatsappLinked, setWhatsappLinked] = useState(true);
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(false);

  const combinedUrl = useMemo(() => {
    const b = cleanBaseUrl(baseUrl);
    const p = cleanPath(path);
    return `${b}${p}`;
  }, [baseUrl, path]);

  const reset = () => {
    setName("");
    setBaseUrl("");
    setPath("");
    setMethod("GET");
    setInterval(allowedIntervals[0] ?? 5);
  };

  const close = () => {
    if (loading) return;
    reset();
    onClose();
  };

  const closeAfterSubmit = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    let alive = true;

    const loadBackendPrefs = async () => {
      try {
        setBootstrapping(true);
        const { data } = await api.get("/auth/me");
        if (!alive) return;

        const backendIntervals = Array.isArray(data?.plan_limits?.allowed_intervals_mins)
          ? data.plan_limits.allowed_intervals_mins
              .map((v: unknown) => Number(v))
              .filter((v: number) => Number.isFinite(v) && v > 0)
          : [];

        const normalized = backendIntervals.length
          ? backendIntervals
          : FALLBACK_INTERVAL_OPTIONS;

        setAllowedIntervals(normalized);
        setInterval(normalized[0]);
        setNotifyWhatsapp(Boolean(data?.alert_whatsapp));
        setWhatsappLinked(Boolean(data?.whatsapp));
      } catch {
        setAllowedIntervals(FALLBACK_INTERVAL_OPTIONS);
        setInterval(FALLBACK_INTERVAL_OPTIONS[0]);
      } finally {
        if (alive) setBootstrapping(false);
      }
    };

    loadBackendPrefs();
    return () => {
      alive = false;
    };
  }, [isOpen]);

  const submit = async () => {
    const finalName = name.trim();
    const finalBase = cleanBaseUrl(baseUrl);
    const finalPath = cleanPath(path);
    const finalInterval = interval;

    if (!finalName) {
      toast.error("Monitor name is required");
      return;
    }
    if (!finalBase) {
      toast.error("Base URL is required");
      return;
    }
    if (!/^https?:\/\//i.test(finalBase)) {
      toast.error("Base URL must start with http:// or https://");
      return;
    }
    if (!Number.isFinite(finalInterval) || finalInterval <= 0) {
      toast.error("Interval must be a valid number of minutes");
      return;
    }

    try {
      setLoading(true);
      await api.post("/monitors", {
        name: finalName,
        url: finalBase,
        path: finalPath || null,
        method,
        intervalMins: finalInterval,
        notify_down: notifyWhatsapp,
        notify_up: notifyWhatsapp,
      });
      toast.success("Monitor added");
      closeAfterSubmit();
      onCreated?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to add monitor");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={close} title="Add Monitor">
      <div className="space-y-4">
        <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
        <InputWithoutIcon
          id="monitor-name"
          type="text"
          label="Monitor Name"
          placeholder="My Website"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <InputWithoutIcon
          id="monitor-base-url"
          type="text"
          label="Base URL"
          placeholder="https://example.com"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />

        <InputWithoutIcon
          id="monitor-path"
          type="text"
          label="Path / Endpoint — optional"
          placeholder="/api/health or /status"
          value={path}
          onChange={(e) => setPath(e.target.value)}
        />

        <p className="text-xs text-muted">
          Combined:{" "}
          <span className="font-medium text-main">
            {combinedUrl || "https://example.com"}
          </span>
        </p>

        <SelectWithoutIcon
          id="monitor-method"
          label="Method"
          value={method}
          onChange={(e) => setMethod(e.target.value as "GET" | "HEAD" | "POST")}
          options={[
            { label: "GET", value: "GET" },
            { label: "HEAD", value: "HEAD" },
            { label: "POST", value: "POST" },
          ]}
          defaultValue="Select Method"
        />

        <div className="space-y-2">
          <p className="text-sm text-muted font-medium">Check Interval</p>
          <div className="grid grid-cols-3 gap-2">
            {allowedIntervals.map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setInterval(mins)}
                className={`h-10 rounded-lg border text-sm font-medium transition ${
                  interval === mins
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-line bg-background text-muted hover:border-primary/50"
                }`}
              >
                {mins < 60 ? `${mins} min` : "1 hr"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-line bg-foreground px-3 py-2">
          <span className="text-sm font-medium text-main">
            WhatsApp Notifications
          </span>
          <InputCheck
            id="notify-whatsapp"
            checked={notifyWhatsapp}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNotifyWhatsapp(e.target.checked)
            }
            disabled={!whatsappLinked}
          />
        </div>
        {!whatsappLinked && (
          <p className="text-xs text-amber-600">
            Add your WhatsApp number in profile to enable WhatsApp alerts.
          </p>
        )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-line pt-3">
          <button
            type="button"
            onClick={close}
            className="btn h-10 rounded-lg border border-line bg-secondary px-4 text-sm text-muted"
            disabled={loading || bootstrapping}
          >
            Cancel
          </button>
          <ButtonWithLoader
            loading={loading || bootstrapping}
            initialText="Add Monitor"
            loadingText={bootstrapping ? "Loading..." : "Adding..."}
            onClick={submit}
            className="btn-primary h-10 rounded-lg px-4 text-sm"
          />
        </div>
      </div>
    </Modal>
  );
}
