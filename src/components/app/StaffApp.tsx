"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PhoneShell, StaffNav } from "@/components/ui";

export function StaffApp({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const isLogin = path === "/staff/login";

  useEffect(() => {
    if (isLogin) {
      router.replace("/login");
      return;
    }
    fetch("/api/me?role=staff")
      .then((r) => r.json())
      .then((d) => {
        if (d.role !== "staff") router.replace("/login");
      });
  }, [router, isLogin]);

  if (isLogin) return null;

  return (
    <PhoneShell footer={<StaffNav />}>
      {children}
    </PhoneShell>
  );
}
