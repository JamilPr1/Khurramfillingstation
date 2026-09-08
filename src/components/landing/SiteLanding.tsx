"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { STATION } from "@/lib/config";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { isStandalonePwa } from "@/components/pwa/PwaRegister";
import { SocialIcons } from "@/components/landing/SocialIcons";

const services = [
  {
    title: "Petrol",
    text: "Reliable petrol on the Sialkot Bypass, ready when you are.",
    img: "/images/kfs-busy-night.jpg",
    alt: "Busy night at Khurram Filling Station pumps",
  },
  {
    title: "HSD Diesel",
    text: "Diesel for cars, vans and commercial vehicles at the pump.",
    img: "/images/kfs-aerial.jpg",
    alt: "Aerial view of the station on Sialkot Bypass",
  },
  {
    title: "Hi-Octane",
    text: "Premium fuel for a cleaner run and better engine response.",
    img: "/images/kfs-hybrid.jpg",
    alt: "Satellite map of Khurram Filling Station",
  },
  {
    title: "Mart & car wash",
    text: "Shop essentials and a wash while you fill, all at one stop.",
    img: "/images/kfs-aerial-close.jpg",
    alt: "Close aerial of the station site",
  },
];

const photos = [
  { src: "/images/kfs-full.jpg", alt: "Khurram Filling Station night photo from Google Maps", caption: "Night at the pumps" },
  { src: "/images/kfs-busy-night.jpg", alt: "Forecourt, canopy and numbered bays", caption: "Forecourt and canopy" },
  { src: "/images/kfs-aerial.jpg", alt: "Satellite view of the Sialkot Bypass site", caption: "Aerial, Sialkot Bypass" },
  { src: "/images/kfs-hybrid.jpg", alt: "Satellite with road labels", caption: "Satellite with roads" },
  { src: "/images/kfs-aerial-close.jpg", alt: "Closer satellite of the filling station", caption: "Close aerial" },
  { src: "/images/kfs-roadmap.jpg", alt: "Street map pin for the station", caption: "Map pin" },
];

const steps = [
  { n: "01", title: "Install the app", text: "Add Khurram Filling Station to your phone from this website. No Play Store or App Store needed." },
  { n: "02", title: "Create your account", text: "Sign in with your mobile number. Your loyalty card is ready in seconds." },
  { n: "03", title: "Fill fuel as usual", text: "Petrol, diesel or Hi-Octane at the pump. Staff enter the litres." },
  { n: "04", title: "Scan the QR", text: "Scan the cashier code. Points land on your number. Redeem at the desk." },
];

const faqs = [
  {
    q: "Do I need Android or iOS from the store?",
    a: "No. Install the app from this website (Add to Home Screen / Install). It opens as a full-screen loyalty app, then takes you to sign in.",
  },
  {
    q: "How do I earn points?",
    a: "After you fill, the cashier shows a one-time QR. Scan it in the app. Demo rule is 1 point per litre.",
  },
  {
    q: "Where is the station?",
    a: "PSO / Khurram Filling Station, Opposite Garden Town, Gujranwala, Sialkot Bypass Road.",
  },
  {
    q: "Can staff use a tablet?",
    a: "Yes. Install the same app on a cashier phone or tablet and sign in as Staff to issue QR codes and confirm rewards.",
  },
];

const mapsEmbed = `https://www.google.com/maps?q=${STATION.lat},${STATION.lng}&z=17&output=embed`;

export function SiteLanding() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(0);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (isStandalonePwa()) router.replace("/login");
  }, [router]);

  return (
    <div className="lp">
      <div className="lp-top">
        <span>24/7 pumps · {STATION.address}</span>
        <div className="lp-top-right">
          <SocialIcons />
          <a href={`tel:${STATION.phoneTel}`}>Call {STATION.phone}</a>
          <a href={`mailto:${STATION.email}`}>{STATION.email}</a>
        </div>
      </div>

      <header className="lp-nav">
        <a href="#top" className="lp-logo">
          <span className="lp-mark">KFS</span>
          <span>
            Khurram
            <small>Filling Station</small>
          </span>
        </a>
        <button className="lp-burger" type="button" onClick={() => setMenu((v) => !v)} aria-label="Menu">
          Menu
        </button>
        <nav className={menu ? "open" : ""}>
          <a href="#about" onClick={() => setMenu(false)}>About</a>
          <a href="#fuels" onClick={() => setMenu(false)}>Fuels</a>
          <a href="#gallery" onClick={() => setMenu(false)}>Photos</a>
          <a href="#loyalty" onClick={() => setMenu(false)}>Loyalty</a>
          <a href="#visit" onClick={() => setMenu(false)}>Visit</a>
          <InstallAppButton className="lp-btn lp-btn-solid" label="Install app" />
        </nav>
      </header>

      <section className="lp-hero" id="top">
        <video autoPlay muted loop playsInline poster="/images/kfs-hero.jpg">
          <source src="/videos/kfs-night.mp4" type="video/mp4" />
        </video>
        <div className="lp-hero-inner">
          <p className="lp-kicker">Gujranwala · Sialkot Bypass</p>
          <h1>Fuel for every journey. Points on every fill.</h1>
          <p className="lp-lead">
            Khurram Filling Station: petrol, diesel and Hi-Octane opposite Garden Town.
            Install the loyalty app from this site, scan the cashier QR, and redeem rewards. No store download.
          </p>
          <div className="lp-hero-actions">
            <InstallAppButton className="lp-btn lp-btn-solid lp-btn-lg" label="Install loyalty app" />
            <Link href="/login" className="lp-btn lp-btn-ghost lp-btn-lg">
              Sign in
            </Link>
          </div>
          <ul className="lp-ticks">
            <li>QR scan after fill</li>
            <li>Loyalty points on your number</li>
            <li>Staff tablet at the cashier</li>
          </ul>
        </div>
      </section>

      <section className="lp-strip">
        <div><strong>24/7</strong><span>Pumps open</span></div>
        <div><strong>Petrol · HSD · Hi-Octane</strong><span>Fuel on site</span></div>
        <div><strong>QR loyalty</strong><span>Scan to earn</span></div>
        <div><strong>Garden Town</strong><span>Sialkot Bypass</span></div>
      </section>

      <section className="lp-about" id="about">
        <div className="lp-about-copy">
          <p className="lp-kicker dark">Who we are</p>
          <h2>Your neighbourhood pump on the Sialkot Bypass</h2>
          <p>
            Khurram Filling Station serves drivers heading through Gujranwala with clean pumps,
            straightforward service, and a loyalty card that lives on your phone. Fill fuel as you
            always have. Earn points with one scan.
          </p>
          <ul className="lp-checks">
            <li>Opposite Garden Town, easy to find on Maps</li>
            <li>Loyalty QR: one-time code, not a poster cheat</li>
            <li>Feedback after every visit, to our staff only</li>
          </ul>
          <a className="lp-phone" href={`tel:${STATION.phoneTel}`}>
            Call us: {STATION.phone}
          </a>
        </div>
        <div className="lp-about-media">
          <figure className="lp-media-card">
            <img src="/images/kfs-full.jpg" alt="PSO night photo of Khurram Filling Station from Google Maps" />
          </figure>
          <figure className="lp-media-card">
            <img src="/images/kfs-busy-night.jpg" alt="Forecourt and numbered bays at Khurram Filling Station" />
          </figure>
        </div>
      </section>

      <section className="lp-fuels" id="fuels">
        <p className="lp-kicker">What we offer</p>
        <h2>Fuels and services at this station</h2>
        <div className="lp-fuel-grid">
          {services.map((s) => (
            <article key={s.title}>
              <div className="lp-media-card">
                <img src={s.img} alt={s.alt} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="lp-gallery" id="gallery">
        <p className="lp-kicker dark">This station</p>
        <h2>Photos and videos: all different views</h2>
        <p className="lp-gallery-lead">
          Night photos, satellite of this pin, and station videos. Each picture is a different shot, shown in full inside the card.
        </p>
        <div className="lp-photo-grid">
          {photos.map((p) => (
            <figure key={p.src} className="lp-media-card">
              <img src={p.src} alt={p.alt} />
              <figcaption>{p.caption}</figcaption>
            </figure>
          ))}
        </div>
        <div className="lp-video-grid">
          <figure className="lp-media-card lp-video-card">
            <video controls playsInline poster="/images/kfs-hero.jpg">
              <source src="/videos/kfs-night.mp4" type="video/mp4" />
            </video>
            <figcaption>Night at the pumps</figcaption>
          </figure>
          {STATION.videos.map((v) => (
            <figure key={v.id} className="lp-media-card lp-video-card">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                title={v.title}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              <figcaption>{v.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="lp-loyalty" id="loyalty">
        <div>
          <p className="lp-kicker">Loyalty &amp; QR</p>
          <h2>Install once. Scan after every fill.</h2>
          <p>
            The website becomes an app on your phone. After install you land on sign in.
            Staff show a QR on the cashier tablet. You scan, points are added, and you can
            redeem a wash, a shop item, or rupees off the next fill.
          </p>
          <InstallAppButton className="lp-btn lp-btn-solid lp-btn-lg" label="Install app &amp; open login" />
        </div>
        <ol className="lp-steps" id="how">
          {steps.map((s) => (
            <li key={s.n}>
              <span>{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="lp-faq">
        <h2>Answers about fuel, points and the app</h2>
        <div>
          {faqs.map((f, i) => (
            <button
              key={f.q}
              type="button"
              className={openFaq === i ? "open" : ""}
              onClick={() => setOpenFaq(i)}
            >
              <strong>{f.q}</strong>
              {openFaq === i ? <p>{f.a}</p> : null}
            </button>
          ))}
        </div>
      </section>

      <section className="lp-visit" id="visit">
        <div>
          <p className="lp-kicker">Find the pump</p>
          <h2>Opposite Garden Town, Gujranwala</h2>
          <p>{STATION.address}</p>
          <p>Hours: {STATION.hours}</p>
          <SocialIcons />
          <div className="lp-hero-actions">
            <a className="lp-btn lp-btn-solid" href={STATION.maps} target="_blank" rel="noreferrer">
              Open in Google Maps
            </a>
            <a className="lp-btn lp-btn-ghost" href={`https://wa.me/${STATION.whatsapp}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
        <div className="lp-visit-media">
          <figure className="lp-media-card">
            <img src="/images/kfs-roadmap.jpg" alt="Street map of Khurram Filling Station" />
          </figure>
          <div className="lp-map-embed">
            <iframe
              title="Khurram Filling Station on Google Maps"
              src={mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="lp-cta">
        <h2>Get in touch, then install and fill</h2>
        <p>Support at the pump, loyalty on your phone.</p>
        <SocialIcons className="on-dark" />
        <div className="lp-hero-actions">
          <InstallAppButton className="lp-btn lp-btn-solid lp-btn-lg" label="Install app" />
          <Link href="/login" className="lp-btn lp-btn-ghost lp-btn-lg">
            Go to login
          </Link>
        </div>
      </section>

      <aside className="lp-ios" id="ios-install">
        <strong>iPhone / iPad:</strong> Safari → Share → Add to Home Screen. Open the icon. It goes straight to login.
        {" "}
        <strong>Android:</strong> Chrome → Install app (or the button above). After install you are taken to sign in.
      </aside>

      <footer className="lp-foot">
        <div>
          <span className="lp-mark">KFS</span>
          <p>{STATION.name}</p>
          <p>{STATION.address}</p>
        </div>
        <div className="lp-foot-right">
          <SocialIcons />
          <p>Petrol · Diesel · Hi-Octane · Loyalty QR</p>
        </div>
      </footer>
    </div>
  );
}
