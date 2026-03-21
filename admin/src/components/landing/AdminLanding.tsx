import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, LogIn } from "lucide-react";
import { Pattern } from "@/components/ui";
import ModeToggle from "@/components/ui/mode-toggle";

export default function AdminLanding() {
  return (
    <Pattern>
      {/* Minimal header */}
      <header className="sticky top-0 z-50 w-full border-b border-line/50 bg-background/80 backdrop-blur-sm">
        <nav className="main flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-space font-semibold text-lg text-main">
              EmpireHost
            </span>
            <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary border border-primary/30">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              <LogIn size={16} />
              Sign in
            </Link>
          </div>
        </nav>
      </header>

      {/* Centered hero */}
      <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-secondary/50 px-4 py-1.5 text-sm text-muted">
            <Shield size={14} className="text-primary" />
            <span>Administration</span>
          </div>

          <h1 className="font-space text-4xl font-bold tracking-tight text-main sm:text-5xl">
            EmpireHost{" "}
            <span className="text-primary">Admin</span>
          </h1>

          <p className="text-muted text-lg leading-relaxed">
            Manage bots, users, and platform settings from one place. Sign in to
            access the dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-white hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
            >
              <LogIn size={18} />
              Sign in to dashboard
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-line/50 py-4">
        <p className="main text-center text-sm text-muted">
          © {new Date().getFullYear()} EmpireHost Admin
        </p>
      </footer>
    </Pattern>
  );
}
