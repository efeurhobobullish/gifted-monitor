import { useState } from "react";
import { motion } from "framer-motion";
import { HomeLayout } from "@/layouts";
import { InputWithoutIcon, ButtonWithLoader } from "@/components/ui";
import { toast } from "sonner";

interface EnvVar {
  key: string;
  value: string;
}

export default function Developers() {
  const [loading, setLoading] = useState(false);

  const [appName, setAppName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [sessionUrl, setSessionUrl] = useState("");
  const [isPublic, setIsPublic] = useState<"yes" | "no">("no");
  const [envVars, setEnvVars] = useState<EnvVar[]>([
    { key: "", value: "" },
  ]);

  const handleEnvChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...envVars];
    updated[index][field] = value;
    setEnvVars(updated);
  };

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
  };

  const submit = async () => {
    if (!appName || !repoUrl) {
      toast.error("App name and repository URL are required");
      return;
    }

    try {
      setLoading(true);

      // 🔒 backend request later
      await new Promise((r) => setTimeout(r, 1200));

      toast.success("Template submitted for review");
    } catch {
      toast.error("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HomeLayout>
      <section className="main py-10 space-y-10">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold font-space">
            Developers
          </h1>
          <p className="text-muted text-sm max-w-xl">
            Submit your WhatsApp bot template for approval. Approved
            templates can be deployed by users using coins.
          </p>
        </div>

        {/* STATUS CARD */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border border-line rounded-2xl p-6"
        >
          <p className="text-sm">
            Status:{" "}
            <span className="text-muted">
              No submissions yet
            </span>
          </p>
        </motion.div>

        {/* FORM */}
        <div className="glass border border-line rounded-2xl p-8 space-y-6">
          <InputWithoutIcon
            label="Application Name"
            placeholder="Empire MD"
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
          />

          <InputWithoutIcon
            label="Repository URL"
            placeholder="https://github.com/username/repo"
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />

          <InputWithoutIcon
            label="Session URL (optional)"
            placeholder="https://session-url.com"
            type="url"
            value={sessionUrl}
            onChange={(e) => setSessionUrl(e.target.value)}
          />

          {/* PUBLIC TOGGLE */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Make Template Public?
            </label>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={isPublic === "yes"}
                  onChange={() => setIsPublic("yes")}
                />
                Yes
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={isPublic === "no"}
                  onChange={() => setIsPublic("no")}
                />
                No
              </label>
            </div>
          </div>

          {/* ENV VARS */}
          <div className="space-y-4">
            <p className="font-medium text-sm">
              Environment Variables
            </p>

            {envVars.map((env, idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 gap-4"
              >
                <InputWithoutIcon
                  label="Key"
                  placeholder="BOT_TOKEN"
                  type="text"
                  value={env.key}
                  onChange={(e) =>
                    handleEnvChange(idx, "key", e.target.value)
                  }
                />
                <InputWithoutIcon
                  label="Value"
                  placeholder="********"
                  type="text"
                  value={env.value}
                  onChange={(e) =>
                    handleEnvChange(idx, "value", e.target.value)
                  }
                />
              </div>
            ))}

            <button
              onClick={addEnvVar}
              className="btn-secondary h-10 px-4 rounded-full text-sm"
            >
              + Add Variable
            </button>
          </div>

          {/* SUBMIT */}
          <ButtonWithLoader
            loading={loading}
            initialText="Submit for Review"
            loadingText="Submitting..."
            onClick={submit}
            className="btn-primary h-11 rounded-full w-full"
          />
        </div>
      </section>
    </HomeLayout>
  );
}