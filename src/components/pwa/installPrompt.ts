export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(value: BeforeInstallPromptEvent | null) => void>();

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

let bound = false;

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
    notify();
  });
}

export async function promptInstall() {
  if (!deferred) return null;
  await deferred.prompt();
  const choice = await deferred.userChoice;
  deferred = null;
  notify();
  return choice.outcome;
}
