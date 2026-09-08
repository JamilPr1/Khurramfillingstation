import type { PublicCustomer } from "@/lib/types";

function Chip() {
  return (
    <span className="kfs-chip" aria-hidden="true">
      <span className="kfs-chip-col" />
      <span className="kfs-chip-mid">
        <i />
        <i />
        <i />
      </span>
      <span className="kfs-chip-col" />
    </span>
  );
}

export function VirtualCard({
  customer,
  compact = false,
}: {
  customer: PublicCustomer;
  compact?: boolean;
}) {
  return (
    <article className={`kfs-virt ${compact ? "is-compact" : ""}`}>
      <div className="kfs-virt-mark" aria-hidden="true">
        KFS
      </div>
      <div className="kfs-virt-top">
        <div className="kfs-virt-brand">
          <img src="/assets/logos/logo-k-seal.png" alt="" />
          <span>KFS PSO</span>
        </div>
        <div className="kfs-virt-bal">
          <small>Point balance</small>
          <strong>{customer.points.toLocaleString("en-PK")}</strong>
        </div>
      </div>
      <div className="kfs-virt-rupee">
        Rupees in account{" "}
        <b>Rs {customer.walletPkr.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</b>
      </div>
      <div className="kfs-virt-bottom">
        <div>
          <p className="kfs-virt-name">{customer.name}</p>
          <p className="kfs-virt-no">{customer.cardMasked}</p>
        </div>
        <Chip />
      </div>
    </article>
  );
}
