"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STATION } from "@/lib/config";
import "@/app/app.css";

export function PhoneShell({
  children,
  footer,
  variant = "app",
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "app" | "login";
}) {
  return (
    <div className={variant === "login" ? "kfs-app kfs-app-login" : "kfs-app"}>
      <div className="kfs-app-main">
        <div className="kfs-app-stage">{children}</div>
        {footer}
      </div>
    </div>
  );
}

export function StationMark({ size = 56 }: { size?: number }) {
  return (
    <img
      src="/assets/logos/logo-horizontal.png"
      alt={STATION.name}
      className="kfs-app-logo"
      style={{ height: Math.max(48, size) }}
    />
  );
}

export function ScreenHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="kfs-app-head">
      <div className="kfs-app-head-row">
        <StationMark size={56} />
        <div className="min-w-0">
          <small>{STATION.name}</small>
          <h1>{title}</h1>
        </div>
      </div>
      {subtitle ? <p>{subtitle}</p> : null}
    </header>
  );
}

export function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      {title ? <h2 className="mb-2 text-[13px] font-semibold text-[#5b6472]">{title}</h2> : null}
      {children}
    </div>
  );
}

export function Row({
  title,
  sub,
  right,
}: {
  title: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="kfs-app-card mb-2 flex items-center justify-between gap-3 px-3.5 py-3">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{title}</div>
        {sub ? <div className="mt-0.5 truncate text-xs text-[#5b6472]">{sub}</div> : null}
      </div>
      {right !== undefined ? (
        <div className="shrink-0 text-sm font-semibold text-[#152445]">{right}</div>
      ) : null}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  disabled,
  type = "button",
  tone = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  tone?: "primary" | "ghost" | "navy";
}) {
  const cls =
    tone === "ghost" ? "kfs-app-btn-ghost" : tone === "navy" ? "kfs-app-btn-navy" : "kfs-app-btn-primary";
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`kfs-app-btn ${cls}`}>
      {children}
    </button>
  );
}

export function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="mb-3 block text-[13px] font-medium text-[#152445]">
      {label}
      <input {...props} className="kfs-app-input" />
    </label>
  );
}

export function SelectField({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="mb-3 block text-[13px] font-medium">
      {label}
      <select {...props} className="kfs-app-input">
        {children}
      </select>
    </label>
  );
}

export function Note({ children, error }: { children: React.ReactNode; error?: boolean }) {
  return (
    <p className={`mb-3 text-sm ${error ? "text-red-700" : "text-[#008e3c]"}`}>{children}</p>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="kfs-app-card px-3.5 py-4 text-sm text-[#5b6472]">{children}</p>;
}

export function Loading() {
  return <div className="kfs-app-body text-sm text-[#5b6472]">Loading…</div>;
}

export function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

const customerItems = [
  { href: "/customer", label: "Home" },
  { href: "/customer/feedback", label: "Help" },
  { href: "/customer/scan", label: "Scan" },
  { href: "/customer/points", label: "Card" },
  { href: "/customer/more", label: "More" },
];

export function CustomerNav() {
  const path = usePathname();
  return (
    <nav className="kfs-app-nav kfs-app-nav-5" aria-label="Customer menu">
      <p className="kfs-app-nav-brand">Customer</p>
      {customerItems.map((item) => {
        const on = path === item.href;
        const isScan = item.href === "/customer/scan";
        if (isScan) {
          return (
            <Link key={item.href} href={item.href} className={on ? "is-on" : ""}>
              <span className="kfs-app-nav-scan">QR</span>
              Scan
            </Link>
          );
        }
        return (
          <Link key={item.href} href={item.href} className={on ? "is-on" : ""}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

const staffItems = [
  { href: "/staff", label: "Fill" },
  { href: "/staff/redeem", label: "Redeem" },
  { href: "/staff/feedback", label: "Notes" },
  { href: "/staff/more", label: "More" },
];

export function StaffNav() {
  const path = usePathname();
  return (
    <nav className="kfs-app-nav kfs-app-nav-4" aria-label="Staff menu">
      <p className="kfs-app-nav-brand">Staff</p>
      {staffItems.map((item) => (
        <Link key={item.href} href={item.href} className={path === item.href ? "is-on" : ""}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

const adminItems = [
  { href: "/admin", label: "Rewards" },
  { href: "/admin/customers", label: "Cards" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/more", label: "More" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="kfs-app-nav kfs-app-nav-4" aria-label="Admin menu">
      <p className="kfs-app-nav-brand">Admin</p>
      {adminItems.map((item) => (
        <Link key={item.href} href={item.href} className={path === item.href ? "is-on" : ""}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
