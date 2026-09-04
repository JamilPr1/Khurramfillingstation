import type { Metadata } from "next";
import Link from "next/link";
import { REWARDS } from "@/lib/config";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";

export const metadata: Metadata = pageMetadata({
  title: "Loyalty program",
  description:
    "Khurram Filling Station loyalty: 1 point per litre. Redeem a shop snack at 200 points, a car wash at 500, or Rs 200 off at 1000. Install from the website and scan the cashier QR.",
  path: "/loyalty",
});

const STEPS = [
  {
    n: "01",
    title: "Install from this website",
    text: "Add Khurram Filling Station to your phone from this site. No Play Store or App Store needed.",
  },
  {
    n: "02",
    title: "Sign in",
    text: "Log in with your name and mobile number. Customers use OTP. Staff use a PIN. Your loyalty card is ready in seconds.",
  },
  {
    n: "03",
    title: "Fill as usual",
    text: "Petrol, HSD diesel or Hi-Octane at the pump. Staff enter the litres after you fill.",
  },
  {
    n: "04",
    title: "Scan the cashier QR",
    text: "Scan the one-time code. You earn 1 point per litre. Redeem rewards at the desk.",
  },
];

const FAQS = [
  {
    q: "How do I earn points?",
    a: "1 point for every litre you fill. After payment, scan the cashier QR in the app. The code is one-time and expires in a few minutes.",
  },
  {
    q: "What can I redeem?",
    a: "Shop snack at 200 points, one exterior car wash at 500 points, or Rs 200 off your next fill at 1000 points.",
  },
  {
    q: "Do I need the Play Store or App Store?",
    a: "No. Install from this website (Add to Home Screen). It opens as the loyalty app, then takes you to login.",
  },
  {
    q: "Can staff log in too?",
    a: "Yes. Use Login in the menu, choose Staff, and enter the PIN. Staff issue QR codes and confirm rewards on a phone or tablet.",
  },
];

export default function LoyaltyProgramPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Loyalty program", path: "/loyalty" },
        ])}
      />
      <section className="kfs-page-head">
        <p className="kfs-kicker">Loyalty program</p>
        <h1>1 point per litre. Rewards at the pump.</h1>
        <p>
          Fill petrol, diesel or Hi-Octane at Khurram Filling Station, scan the cashier QR, and
          collect points on your phone.
        </p>
      </section>

      <section className="kfs-section">
        <p className="kfs-kicker dark">How it works</p>
        <h2>Four steps after you fill</h2>
        <p className="kfs-lead">
          The loyalty card lives on this website as an app. Customers earn points. Staff issue the
          QR and confirm rewards.
        </p>
        <div className="kfs-cards kfs-loyalty-steps">
          {STEPS.map((s) => (
            <article className="kfs-card" key={s.n}>
              <p className="kfs-step-n">{s.n}</p>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="kfs-section kfs-fuels">
        <p className="kfs-kicker dark">Rewards</p>
        <h2>What your points buy</h2>
        <p className="kfs-lead">1 loyalty point per litre filled. Redeem at the station desk.</p>
        <div className="kfs-cards kfs-reward-cards">
          {REWARDS.map((r) => (
            <article className="kfs-card" key={r.id}>
              <p className="kfs-reward-pts">{r.points} pts</p>
              <h3>{r.name}</h3>
              <p>{r.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="kfs-section">
        <p className="kfs-kicker dark">Login</p>
        <h2>Customers and staff</h2>
        <p className="kfs-lead">
          Use the Login button in the menu. Customers sign in with mobile number and OTP. Staff
          sign in with a PIN to issue QR codes and confirm rewards.
        </p>
        <ul className="kfs-checks">
          <li>Customer: name, mobile number, OTP — then scan and redeem</li>
          <li>Staff: PIN — issue fill QR and mark rewards as done</li>
          <li>Feedback after a visit stays with station staff only</li>
        </ul>
        <div className="kfs-actions" style={{ marginTop: 28 }}>
          <Link href="/login" className="kfs-btn kfs-btn-navy">
            Login
          </Link>
          <InstallAppButton className="kfs-btn kfs-btn-line" label="Install on your phone" />
        </div>
        <p id="ios-install" className="kfs-lead" style={{ marginTop: 18 }}>
          On iPhone: Share → Add to Home Screen. Then open the icon and log in.
        </p>
      </section>

      <section className="kfs-section kfs-faq">
        <p className="kfs-kicker dark">Questions</p>
        <h2>Loyalty program FAQ</h2>
        <div className="kfs-faq-list">
          {FAQS.map((item) => (
            <details key={item.q} className="kfs-faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="kfs-cta">
        <h2>Ready to collect points?</h2>
        <p>Log in as a customer after you fill, or as staff at the desk.</p>
        <div className="kfs-actions">
          <Link href="/login" className="kfs-btn kfs-btn-yellow">
            Login
          </Link>
          <Link href="/visit" className="kfs-btn kfs-btn-ghost">
            Visit the pump
          </Link>
        </div>
      </section>
    </>
  );
}
