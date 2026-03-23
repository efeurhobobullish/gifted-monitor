import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ModeToggle } from "../ui";
import SlidingMenu from "../ui/SlidingMenu";
import useAuthStore from "@/store/useAuthStore";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [persistReady, setPersistReady] = useState(() =>
    useAuthStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setPersistReady(true);
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setPersistReady(true);
    });
    return unsub;
  }, []);

  const isAuthed = Boolean(token || user);

  // Wait for persisted auth to load before hiding; avoids empty header flash on dashboard
  if (!persistReady) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-line bg-background">
        <nav className="main h-[90px] flex items-center justify-between text-main">
          <div className="h-10 w-10 rounded-full bg-secondary animate-pulse" />
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="font-space font-semibold text-lg">
              Gifted Monitor <span className="text-primary">&bull;</span>
            </span>
          </Link>
          <div className="h-10 w-10 rounded-full bg-secondary animate-pulse" />
        </nav>
      </header>
    );
  }

  if (!isAuthed) return null;

  const displayName = user?.fullName?.trim() || "Account";
  const avatar =
    user?.avatar ||
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      displayName,
    )}`;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-line bg-background">
        <nav className="main h-[90px] flex items-center justify-between text-main">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="
                h-10 w-10
                rounded-full
                border border-line
                bg-background
                hover:bg-foreground
                flex items-center justify-center
                text-main
                transition-colors
              "
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="font-space font-semibold text-lg">
                Gifted Monitor <span className="text-primary">&bull;</span>
              </span>
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <ModeToggle />

            <div className="h-10 w-10 rounded-full overflow-hidden bg-foreground border border-line">
              <img
                src={avatar}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </nav>
      </header>

      <SlidingMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
