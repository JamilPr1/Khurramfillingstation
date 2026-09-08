import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loyalty login",
  description:
    "Sign in to the Khurram Filling Station loyalty app. Customers use a personal PIN. Staff use a station PIN. Admin manages rewards.",
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    title: "KFS Loyalty",
    statusBarStyle: "black-translucent",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
