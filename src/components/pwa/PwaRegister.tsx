"use client";

import { useEffect } from "react";
import { bindInstallPrompt } from "./installPrompt";

export function PwaRegister() {
  useEffect(() => {
    bindInstallPrompt();
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);
  return null;
}

export function isStandalonePwa() {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || Boolean(nav.standalone);
}
