"use client";

import { useEffect } from "react";
import { bindInstallPrompt } from "./installPrompt";
import { InstallPopup } from "./InstallPopup";

export function PwaRegister() {
  useEffect(() => {
    bindInstallPrompt();
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined);
  }, []);
  return <InstallPopup />;
}

export { isStandalonePwa } from "./installPrompt";
