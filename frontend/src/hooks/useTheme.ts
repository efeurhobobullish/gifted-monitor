import { useSyncExternalStore } from "react";
import useThemeStore from "../store/useThemeStore";

function subscribeSystemTheme(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSystemThemeSnapshot(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getServerSnapshot(): "light" | "dark" {
  return "light";
}

/**
 * Read current theme mode and setter. `resolvedTheme` is the effective light/dark
 * (when mode is "system", it follows OS preference).
 */
export default function useTheme() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const systemPref = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemThemeSnapshot,
    getServerSnapshot
  );

  const resolvedTheme =
    theme === "system" ? systemPref : theme;

  return { theme, setTheme, resolvedTheme };
}
