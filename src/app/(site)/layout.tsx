import { StationShell } from "@/components/station/StationShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/seo";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <StationShell>
      <JsonLd data={faqJsonLd()} />
      {children}
    </StationShell>
  );
}
