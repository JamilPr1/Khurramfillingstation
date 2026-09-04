import { TESTIMONIALS } from "@/lib/station";

function Stars({ count }: { count: number }) {
  return (
    <p className="kfs-review-stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < count ? "is-on" : ""}>
          ★
        </span>
      ))}
    </p>
  );
}

function ReviewCard({
  t,
  hidden,
}: {
  t: (typeof TESTIMONIALS)[number];
  hidden?: boolean;
}) {
  return (
    <article className="kfs-review" aria-hidden={hidden}>
      <div className="kfs-review-top">
        <img src={t.img} alt={hidden ? "" : t.name} />
        <div>
          <h3>{t.name}</h3>
          <p>{t.city}</p>
        </div>
      </div>
      <Stars count={t.stars} />
      <p className="kfs-review-text">{t.comment}</p>
    </article>
  );
}

export function Testimonials({ className }: { className?: string }) {
  const loop = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className={`kfs-reviews ${className ?? ""}`.trim()} aria-labelledby="kfs-reviews-title">
      <p className="kfs-kicker dark">Customer reviews</p>
      <h2 id="kfs-reviews-title">What drivers say</h2>
      <p className="kfs-lead">
        Drivers from Gujranwala and Garden Town on the fill, the staff, and the loyalty card.
      </p>
      <div className="kfs-reviews-viewport">
        <div className="kfs-reviews-track">
          {loop.map((t, i) => (
            <ReviewCard key={`${t.name}-${i}`} t={t} hidden={i >= TESTIMONIALS.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
