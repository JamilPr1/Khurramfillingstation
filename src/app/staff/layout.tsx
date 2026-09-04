import type { Metadata } from "next";
import { StaffApp } from "@/components/app/StaffApp";

export const metadata: Metadata = {
  title: "Staff",
  robots: { index: false, follow: false },
};

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <StaffApp>{children}</StaffApp>;
}
