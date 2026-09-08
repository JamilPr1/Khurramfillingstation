export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "kfs-pwa-dismissed";
const DISMISS_MS = 5 * 24 * 60 * 60 * 1000;

let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(value: BeforeInstallPromptEvent | null) => void>();
let bound = false;

function notify() {
  listeners.forEach((fn) => fn(deferred));
}

export function getDeferredInstall() {
  return deferred;
}

export function onInstallPromptChange(fn: (value: BeforeInstallPromptEvent | null) => void) {
  listeners.add(fn);
  fn(deferred);
  return () => {
    listeners.delete(fn);
  };
}

export function isStandalonePwa() {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || Boolean(nav.standalone);
}

export function isIosDevice() {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export function wasInstallDismissed() {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const at = Number(raw);
    if (!Number.isFinite(at)) return false;
    return Date.now() - at < DISMISS_MS;
  } catch {
    return false;
  }
}

export function dismissInstallPrompt() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* private mode */
  }
}

export function bindInstallPrompt() {
  if (typeof window === "undefined" || bound) return;
  bound = true;
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferred = event as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    dismissInstallPrompt();
    notify();
  });
}

export async function promptInstall() {
  if (!deferred) return null;
  await deferred.prompt();
  const choice = await deferred.userChoice;
  deferred = null;
  if (choice.outcome === "accepted") dismissInstallPrompt();
  notify();
  return choice.outcome;
}

if (typeof window !== "undefined") {
  bindInstallPrompt();
}
