"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loading, PhoneShell, StaffNav } from "@/components/ui";

export function StaffApp({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const isLogin = path === "/staff/login";
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLogin) {
      router.replace("/login");
      return;
    }
    let gone = false;
    fetch("/api/me?role=staff")
      .then((r) => r.json())
      .then((d) => {
        if (gone) return;
        if (d.role !== "staff") {
          router.replace("/login");
          return;
        }
        setReady(true);
      })
      .catch(() => {
        if (!gone) router.replace("/login");
      });
    return () => {
      gone = true;
    };
  }, [router, isLogin]);

  if (isLogin) return null;
  if (!ready) {
    return (
      <PhoneShell>
        <Loading />
      </PhoneShell>
    );
  }

  return <PhoneShell footer={<StaffNav />}>{children}</PhoneShell>;
}
