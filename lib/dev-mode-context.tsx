"use client";

/**
 * Dev mode context — drives the floating dev panel's toggles.
 * - theme: IBM Carbon vs Stripe (swappable via data-theme on <html>)
 * - grayscale: CSS filter overlay for lo-fi skeleton demo
 * - product / entity: D1 reshape demo axes
 *
 * NOTE: V1/V2 mode moved to flow-mode-context — the user-facing
 * header toggle owns that state.
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

export type AppTheme = "ibm" | "stripe";
export type DemoProduct =
  | "business-loan"
  | "bank-guarantee"
  | "equipment-finance"
  | "business-overdraft";
export type DemoEntity = "sole-trader" | "company" | "trust" | "partnership";

interface DevMode {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  grayscale: boolean;
  setGrayscale: (g: boolean) => void;
  product: DemoProduct;
  setProduct: (p: DemoProduct) => void;
  entity: DemoEntity;
  setEntity: (e: DemoEntity) => void;
  aiPanel: boolean;
  setAiPanel: (on: boolean) => void;
}

const DevModeContext = createContext<DevMode | null>(null);

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AppTheme>("ibm");
  const [grayscale, setGrayscale] = useState(false);
  const [product, setProduct] = useState<DemoProduct>("bank-guarantee");
  const [entity, setEntity] = useState<DemoEntity>("company");
  const [aiPanel, setAiPanel] = useState(false); // default OFF — v1 is the default surface

  // Apply data-attrs to <html> so CSS variable overrides cascade everywhere.
  useLayoutEffect(() => {
    const el = document.documentElement;
    el.dataset.theme = theme;
    el.dataset.grayscale = grayscale ? "on" : "off";
  }, [theme, grayscale]);

  const value = useMemo<DevMode>(
    () => ({
      theme,
      setTheme,
      grayscale,
      setGrayscale,
      product,
      setProduct,
      entity,
      setEntity,
      aiPanel,
      setAiPanel,
    }),
    [theme, grayscale, product, entity, aiPanel],
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
