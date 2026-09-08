"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isStandalonePwa } from "./installPrompt";
import {
  dismissInstallPrompt,
  getDeferredInstall,
  isIosDevice,
  onInstallPromptChange,
  promptInstall,
  wasInstallDismissed,
} from "./installPrompt";

let offeredThisSession = false;

function canOffer(path: string) {
  if (offeredThisSession) return false;
  if (isStandalonePwa()) return false;
  if (wasInstallDismissed()) return false;
  if (path === "/customer/scan") return false;
  return true;
}

export function InstallPopup() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [ios, setIos] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!canOffer(path)) return;

    function reveal() {
      if (!canOffer(path)) return;
      offeredThisSession = true;
      setIos(isIosDevice() && !getDeferredInstall());
      setOpen(true);
    }

    const ready = window.setTimeout(() => {
      if (getDeferredInstall() || isIosDevice()) reveal();
    }, 1600);

    const unsub = onInstallPromptChange((event) => {
      if (!event) return;
      window.clearTimeout(ready);
      window.setTimeout(reveal, 500);
    });

    return () => {
      window.clearTimeout(ready);
      unsub();
    };
  }, [path]);

  useEffect(() => {
    if (path === "/customer/scan") setOpen(false);
  }, [path]);

  function close() {
    setOpen(false);
    dismissInstallPrompt();
  }

  async function install() {
    if (ios) return;
    setBusy(true);
    const outcome = await promptInstall();
    setBusy(false);
    if (outcome === "accepted") {
      setOpen(false);
      return;
    }
    if (outcome === "dismissed") close();
  }

  if (!open) return null;

  return (
    <div className="kfs-pwa-pop" role="dialog" aria-labelledby="kfs-pwa-title" aria-modal="true">
      <div className="kfs-pwa-pop-card">
        <img src="/icons/icon-192.png" alt="" width={56} height={56} />
        <h2 id="kfs-pwa-title">Install the app</h2>
        {ios ? (
          <p>
            Tap the Share button, then Add to Home Screen. Your loyalty card will open like a
            normal app.
          </p>
        ) : (
          <p>
            Add Khurram Filling Station to this device. Faster login, and your card stays on the
            home screen.
          </p>
        )}
        <div className="kfs-pwa-pop-actions">
          {ios ? (
            <button type="button" className="kfs-pwa-pop-go" onClick={close}>
              Got it
            </button>
          ) : (
            <button type="button" className="kfs-pwa-pop-go" onClick={() => void install()} disabled={busy}>
              {busy ? "Opening…" : "Install app"}
            </button>
          )}
          <button type="button" className="kfs-pwa-pop-skip" onClick={close}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
