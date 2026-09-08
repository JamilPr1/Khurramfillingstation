import {
  formatPkr,
  fuelPriceCards,
  type FuelPriceBoard,
} from "@/lib/fuelPriceBoard";

type Props = {
  prices: FuelPriceBoard;
  variant?: "white" | "paper";
};

export function FuelPrices({ prices, variant = "white" }: Props) {
  const when = prices.effectiveLabel || "today";
  const cards = fuelPriceCards(prices);

  return (
    <section
      className={`kfs-section kfs-prices ${variant === "paper" ? "kfs-on-paper" : "kfs-on-white"}`}
      aria-label="Today's fuel prices"
    >
      <p className="kfs-kicker dark">Today’s rates</p>
      <h2>Petrol, Hi-Octane and diesel</h2>
      <p className="kfs-lead">
        Pakistan pump prices, refreshed from PSO. Hi-Octane is the Gujranwala rate.
        Confirm on the board at this station. A little freight can apply at the nozzle.
      </p>
      <div className="kfs-price-grid">
        {cards.map((card) => (
          <article className="kfs-price-card" key={card.key}>
            <img src={card.icon} alt="" />
            <h3>{card.title}</h3>
            <p className="kfs-price-rate">
              Rs {formatPkr(card.rate)}
              <span> / litre</span>
            </p>
            <p>{card.hint}</p>
          </article>
        ))}
      </div>
      <p className="kfs-price-note">
        Effective {when}
        {" · "}
        <a href={prices.sourceUrl} target="_blank" rel="noreferrer">
          PSO fuel prices
        </a>
      </p>
    </section>
  );
}
