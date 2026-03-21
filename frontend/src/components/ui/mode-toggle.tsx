import { useEffect, useRef, useState } from "react";
import { Laptop, Moon, Sun, Check } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import type { ThemeMode } from "@/store/useThemeStore";

const options: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
];

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const CurrentIcon =
    options.find((o) => o.value === theme)?.icon ?? Laptop;

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-main flex h-11 w-11 items-center justify-center rounded-full border border-line bg-background/80 transition hover:bg-secondary"
        aria-label="Theme"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <CurrentIcon size={20} strokeWidth={1.5} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-[200] mt-2 min-w-[11rem] rounded-xl border border-line bg-background py-1 shadow-lg"
        >
          {options.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              role="option"
              aria-selected={theme === value}
              onClick={() => {
                setTheme(value);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-main transition hover:bg-secondary"
            >
              <Icon size={16} className="text-muted shrink-0" />
              <span className="flex-1">{label}</span>
              {theme === value && (
                <Check size={16} className="text-primary shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
