"use client";

/**
 * Dev mode context — drives the floating dev panel's 3 toggles.
 * - version: V1 (structured rules only) vs V2 (AI teammate layer active)
 * - theme: IBM Carbon vs Stripe (swappable via data-theme on <html>)
 * - grayscale: CSS filter overlay for a11y demo
 *
 * State lives in a single Context so any component can read it without
 * prop-drilling, and the provider also writes data-attrs to <html>
 * so CSS variable overrides kick in globally.
 */
import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AppVersion = "v1" | "v2";
export type AppTheme = "ibm" | "stripe";

interface DevMode {
  version: AppVersion;
  setVersion: (v: AppVersion) => void;
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  grayscale: boolean;
  setGrayscale: (g: boolean) => void;
}

const DevModeContext = createContext<DevMode | null>(null);

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState<AppVersion>("v1");
  const [theme, setTheme] = useState<AppTheme>("ibm");
  const [grayscale, setGrayscale] = useState(false);

  // Apply data-attrs to <html> so CSS variable overrides cascade everywhere.
  useLayoutEffect(() => {
    const el = document.documentElement;
    el.dataset.theme = theme;
    el.dataset.version = version;
    el.dataset.grayscale = grayscale ? "on" : "off";
  }, [theme, version, grayscale]);

  const value = useMemo<DevMode>(
    () => ({
      version,
      setVersion,
      theme,
      setTheme,
      grayscale,
      setGrayscale,
    }),
    [version, theme, grayscale],
  );

  return (
    <DevModeContext.Provider value={value}>{children}</DevModeContext.Provider>
  );
}

export function useDevMode(): DevMode {
  const ctx = useContext(DevModeContext);
  if (!ctx) {
    throw new Error("useDevMode must be used within DevModeProvider");
  }
  return ctx;
}
