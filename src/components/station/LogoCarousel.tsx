const LOGOS = [
  { src: "/assets/logos/logo-horizontal.png", alt: "Khurram Filling Station", wide: true },
  { src: "/assets/partners/pso.svg", alt: "PSO Pakistan State Oil" },
  { src: "/assets/logos/logo-k-seal.png", alt: "Khurram Filling Station seal" },
  { src: "/assets/partners/hi-octane.svg", alt: "PSO Hi-Octane" },
  { src: "/assets/partners/petrol.svg", alt: "PSO Petrol" },
  { src: "/assets/partners/hsd.svg", alt: "PSO HSD diesel" },
  { src: "/assets/partners/pso-card.svg", alt: "PSO Card loyalty" },
];

export function LogoCarousel() {
  const loop = [...LOGOS, ...LOGOS];

  return (
    <section className="kfs-logos kfs-on-paper" aria-label="Station and PSO brands">
      <div className="kfs-logos-track">
        {loop.map((logo, i) => (
          <div
            key={`${logo.src}-${i}`}
            className={logo.wide ? "kfs-logos-item is-wide" : "kfs-logos-item"}
            aria-hidden={i >= LOGOS.length}
          >
            <img src={logo.src} alt={i < LOGOS.length ? logo.alt : ""} />
          </div>
        ))}
      </div>
    </section>
  );
}
