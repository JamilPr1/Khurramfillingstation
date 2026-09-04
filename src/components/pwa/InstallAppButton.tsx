"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isStandalonePwa } from "./PwaRegister";
import { onInstallPromptChange, promptInstall } from "./installPrompt";

export function InstallAppButton({
  className = "",
  label = "Install app",
}: {
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const path = usePathname();
  const [canPrompt, setCanPrompt] = useState(false);
  const [iosHint, setIosHint] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (isStandalonePwa()) {
      setInstalled(true);
      return;
    }
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (ios) setIosHint(true);
    return onInstallPromptChange((event) => setCanPrompt(Boolean(event)));
  }, []);

  async function install() {
    if (installed) {
      if (path !== "/login") router.push("/login");
      return;
    }
    if (canPrompt) {
      const outcome = await promptInstall();
      if (outcome === "accepted" && path !== "/login") router.push("/login");
      return;
    }
    if (iosHint || path === "/login") {
      document.getElementById("ios-install")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    router.push("/login");
  }

  return (
    <button type="button" className={className} onClick={install}>
      {installed ? "Open app" : label}
    </button>
  );
}
