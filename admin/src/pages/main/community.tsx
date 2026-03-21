import { HomeLayout } from "@/layouts";
import { Send, Image as ImageIcon, X } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

/* ================= TYPES ================= */
interface User {
  fullName: string;
  username: string;
}

interface Message {
  id: number;
  user: User;
  content?: string;
  image?: string;
  time: string;
  replyTo?: Message;
  mine?: boolean;
}

/* ================= MOCK USERS ================= */
const USERS: User[] = [
  { fullName: "Empire Tech", username: "empiretech" },
  { fullName: "Test User", username: "tester" },
  { fullName: "Bot Master", username: "botmaster" },
  { fullName: "Trade Lord", username: "tradelord" },
];

export default function Community() {
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [mentionQuery, setMentionQuery] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: USERS[0],
      content: "Welcome to EmpireHost community 👋",
      time: "6:42:32 AM",
    },
  ]);

  /* ================= HELPERS ================= */
  const handleMention = (value: string) => {
    setMessage(value);
    const match = value.match(/@(\w*)$/);
    if (match) {
      setMentionQuery(match[1]);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (username: string) => {
    setMessage((prev) => prev.replace(/@\w*$/, `@${username} `));
    setShowMentions(false);
  };

  const handleSend = () => {
    if (!message.trim() && !image) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: USERS[0],
        content: message || undefined,
        image: image || undefined,
        replyTo: replyTo || undefined,
        time: new Date().toLocaleTimeString(),
        mine: true,
      },
    ]);

    setMessage("");
    setReplyTo(null);
    setImage(null);
  };

  return (
    <HomeLayout>
      <section className="main py-8 h-[calc(100vh-90px)] min-h-[400px] flex flex-col gap-6">
        {/* ================= HEADER ================= */}
        <div>
          <h1 className="text-3xl font-semibold font-space">Community</h1>
          <p className="text-muted text-base">
            Chat with other EmpireHost users.
          </p>
        </div>

        {/* ================= CHAT ================= */}
        <div className="flex-1 glass rounded-2xl border border-line flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {/* Meta */}
                <div className="flex items-center gap-3 text-sm text-muted">
                  <span className="font-semibold text-main text-base">
                    {msg.user.fullName}
                  </span>
                  <span className="text-sm">@{msg.user.username}</span>
                  <span className="text-sm">• {msg.time}</span>
                </div>

                {/* Reply */}
                {msg.replyTo && (
                  <div className="text-sm border-l-4 border-primary pl-4 text-muted">
                    Replying to @{msg.replyTo.user.username}:{" "}
                    {msg.replyTo.content}
                  </div>
                )}

                {/* Bubble */}
                <div className="rounded-2xl border border-line bg-secondary p-5 space-y-3 max-w-3xl">
                  {msg.image && (
                    <img
                      src={msg.image}
                      className="max-h-80 rounded-xl border border-line"
                    />
                  )}
                  {msg.content && (
                    <p className="text-base leading-relaxed">
                      {msg.content}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-6 text-sm text-muted">
                    <button onClick={() => setReplyTo(msg)}>Reply</button>
                    {msg.mine && (
                      <button
                        onClick={() =>
                          setMessages((prev) =>
                            prev.filter((m) => m.id !== msg.id)
                          )
                        }
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Reply Preview */}
          {replyTo && (
            <div className="border-t border-line px-6 py-4 text-sm flex justify-between items-center">
              <span>
                Replying to <b>@{replyTo.user.username}</b>
              </span>
              <button onClick={() => setReplyTo(null)}>
                <X size={16} />
              </button>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-line p-5 relative">
            <div className="flex items-center gap-4">
              <input
                value={message}
                onChange={(e) => handleMention(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 h-14 px-5 rounded-full bg-background border border-line text-base"
              />

              <button
                onClick={() => fileRef.current?.click()}
                className="h-14 w-14 rounded-full border border-line flex items-center justify-center"
              >
                <ImageIcon size={22} />
              </button>

              <button
                onClick={handleSend}
                className="h-14 w-14 rounded-full btn-primary flex items-center justify-center"
              >
                <Send size={22} />
              </button>
            </div>

            {/* Mention Dropdown */}
            {showMentions && (
              <div className="absolute bottom-20 left-6 w-72 glass rounded-xl border border-line p-2">
                {USERS.filter((u) =>
                  u.username.startsWith(mentionQuery)
                ).map((u) => (
                  <button
                    key={u.username}
                    onClick={() => insertMention(u.username)}
                    className="w-full text-left px-4 py-3 text-base hover:bg-secondary rounded-lg"
                  >
                    <b>{u.fullName}</b>{" "}
                    <span className="text-muted">@{u.username}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) =>
            e.target.files &&
            setImage(URL.createObjectURL(e.target.files[0]))
          }
        />
      </section>
    </HomeLayout>
  );
}