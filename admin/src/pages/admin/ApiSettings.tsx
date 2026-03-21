import { useState, useEffect } from "react";
import { HomeLayout } from "@/layouts";
import { Server, Save, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  getStoredApiBaseUrl,
  setStoredApiBaseUrl,
  BACKEND_BASE_URL,
} from "@/config/api";

export default function ApiSettings() {
  const [inputUrl, setInputUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testOk, setTestOk] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = getStoredApiBaseUrl();
    const current = BACKEND_BASE_URL || "";
    setInputUrl(stored || current || "");
    setTestOk(null);
  }, []);

  const handleSave = async () => {
    const url = inputUrl.trim().replace(/\/+$/, "");
    if (!url) {
      toast.error("Enter a valid API base URL");
      return;
    }
    setSaving(true);
    try {
      setStoredApiBaseUrl(url);
      toast.success("API URL saved. Reloading to apply…");
      setTestOk(null);
      window.location.reload();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    const url = inputUrl.trim().replace(/\/+$/, "");
    if (!url) {
      toast.error("Enter a valid API base URL first");
      return;
    }
    setTesting(true);
    setTestOk(null);
    try {
      const base = url.startsWith("http") ? url : `https://${url}`;
      const res = await fetch(`${base.replace(/\/+$/, "")}/`, {
        method: "GET",
        mode: "cors",
      });
      const data = await res.json().catch(() => ({}));
      const ok = res.ok && (data.success === true || data.message != null);
      setTestOk(ok);
      if (ok) toast.success("Connection successful");
      else toast.error("Unexpected response from API");
    } catch {
      setTestOk(false);
      toast.error("Cannot reach API. Check URL and CORS.");
    } finally {
      setTesting(false);
    }
  };

  const currentDisplay = BACKEND_BASE_URL || "Not set (using .env or default)";

  return (
    <HomeLayout>
      <section className="main py-10 max-w-2xl">
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl font-semibold font-space flex items-center gap-2">
            <Server size={24} className="text-primary" />
            API Settings
          </h1>
          <p className="text-muted text-sm">
            Set or update the backend (Heroku) API URL used by this admin app.
            Changes apply after save and reload.
          </p>
        </div>

        <div className="glass border border-line rounded-2xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-main mb-2">
              Backend API base URL
            </label>
            <p className="text-xs text-muted mb-2">
              Current: <code className="bg-secondary px-1 rounded">{currentDisplay}</code>
            </p>
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                setTestOk(null);
              }}
              placeholder="https://your-app.herokuapp.com"
              className="w-full px-4 py-3 rounded-lg border border-line bg-background text-main placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary h-11 px-6 rounded-full flex items-center gap-2"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save & reload
            </button>
            <button
              onClick={handleTest}
              disabled={testing}
              className="h-11 px-6 rounded-full border border-line bg-background hover:bg-foreground flex items-center gap-2 disabled:opacity-50"
            >
              {testing ? <Loader2 size={18} className="animate-spin" /> : null}
              Test connection
            </button>
          </div>

          {testOk === true && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle size={18} />
              API is reachable.
            </div>
          )}
          {testOk === false && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle size={18} />
              Could not reach API. Check URL and CORS.
            </div>
          )}
        </div>

        <p className="text-muted text-xs mt-6">
          Tip: Use your Heroku app URL (e.g. https://your-api.herokuapp.com) without a trailing slash.
        </p>
      </section>
    </HomeLayout>
  );
}
