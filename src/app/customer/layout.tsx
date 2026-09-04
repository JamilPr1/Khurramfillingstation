import type { Metadata } from "next";
import { CustomerApp } from "@/components/app/CustomerApp";

export const metadata: Metadata = {
  title: "Loyalty",
  robots: { index: false, follow: false },
};

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <CustomerApp>{children}</CustomerApp>;
}
