"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CustomerNav, PhoneShell } from "@/components/ui";

export function CustomerApp({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const isLogin = path === "/customer/login";

  useEffect(() => {
    if (isLogin) {
      router.replace("/login");
      return;
    }
    fetch("/api/me?role=customer")
      .then((r) => r.json())
      .then((d) => {
        if (d.role !== "customer") router.replace("/login");
      });
  }, [router, isLogin]);

  if (isLogin) return null;

  return (
    <PhoneShell footer={<CustomerNav />}>
      {children}
    </PhoneShell>
  );
}
