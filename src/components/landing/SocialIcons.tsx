import { STATION } from "@/lib/config";

type IconName = "facebook" | "instagram" | "youtube" | "x" | "whatsapp";

const ICONS: { name: IconName; label: string; path: string }[] = [
  {
    name: "facebook",
    label: "Facebook",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
  {
    name: "instagram",
    label: "Instagram",
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.7 6.3a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1z",
  },
  {
    name: "youtube",
    label: "YouTube",
    path: "M22.5 7.2a3.2 3.2 0 0 0-2.2-2.3C18.6 4.5 12 4.5 12 4.5s-6.6 0-8.3.4A3.2 3.2 0 0 0 1.5 7.2 33 33 0 0 0 1 12a33 33 0 0 0 .5 4.8 3.2 3.2 0 0 0 2.2 2.3c1.7.4 8.3.4 8.3.4s6.6 0 8.3-.4a3.2 3.2 0 0 0 2.2-2.3A33 33 0 0 0 23 12a33 33 0 0 0-.5-4.8zM10 15.5v-7l6 3.5z",
  },
  {
    name: "x",
    label: "X",
    path: "M17.5 3h3.1l-6.8 7.8L22 21h-5.4l-4.2-5.5L7.5 21H4.4l7.3-8.3L2.5 3h5.5l3.8 5zM16.4 19.2h1.7L8.1 4.7H6.3z",
  },
  {
    name: "whatsapp",
    label: "WhatsApp",
    path: "M19.1 4.9A10 10 0 0 0 3.3 16.4L2 22l5.7-1.5A10 10 0 0 0 19.1 4.9zm-7.1 15.4a8.3 8.3 0 0 1-4.2-1.2l-.3-.2-3.4.9.9-3.3-.2-.3a8.3 8.3 0 1 1 7.2 4.1zm4.6-6.2c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.6.1a6.8 6.8 0 0 1-2-1.2 7.5 7.5 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.6l.3-.4.2-.3a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.5 11.5 0 0 0 4.4 3.9 5 5 0 0 0 2.3.7 2.2 2.2 0 0 0 1.5-.7 1.8 1.8 0 0 0 .4-1.3c0-.2 0-.2-.2-.3z",
  },
];

function hrefFor(name: IconName): string {
  if (name === "whatsapp") return `https://wa.me/${STATION.whatsapp}`;
  return STATION.social[name] ?? "";
}

export function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`lp-social ${className}`.trim()} aria-label="Social media">
      {ICONS.map((icon) => {
        const href = hrefFor(icon.name);
        if (!href) return null;
        return (
          <a
            key={icon.name}
            className="lp-social-link"
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={icon.name === "whatsapp" ? `WhatsApp ${STATION.phone}` : icon.label}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={icon.path} />
            </svg>
          </a>
        );
      })}
    </div>
  );
}
