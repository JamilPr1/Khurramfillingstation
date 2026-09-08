import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { withStore } from "@/lib/store";

export const metadata: Metadata = pageMetadata({
  title: "Loyalty program",
  description:
    "Khurram Filling Station loyalty: earn points for every litre. Redeem snacks, a car wash, or rupees off your next fill. Install from the website and scan the cashier QR.",
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
    text: "Log in with your name, mobile number, and a PIN you choose. Staff use the station PIN. Admin sets rewards.",
  },
  {
    n: "03",
    title: "Fill as usual",
    text: "Petrol, HSD diesel or Hi-Octane at the pump. Staff enter the litres after you fill.",
  },
  {
    n: "04",
    title: "Scan the cashier QR",
    text: "Scan the one-time code. You earn points per litre. Redeem rewards at the desk.",
  },
];

export default async function LoyaltyProgramPage() {
  const { rewards, pointsPerLitre } = await withStore((s) => ({
    rewards: s.settings.rewards,
    pointsPerLitre: s.settings.pointsPerLitre,
  }));

  const faqs = [
    {
      q: "How do I earn points?",
      a: `${pointsPerLitre} point${pointsPerLitre === 1 ? "" : "s"} for every litre you fill. After payment, scan the cashier QR in the app. The code is one-time and expires in a few minutes.`,
    },
    {
      q: "What can I redeem?",
      a:
        rewards.length > 0
          ? rewards
              .map((r) =>
                r.kind === "discount" && r.discountPkr
                  ? `${r.name} (Rs ${r.discountPkr} off) at ${r.points} points`
                  : `${r.name} at ${r.points} points`,
              )
              .join("; ") + "."
          : "Ask at the desk. The station sets rewards in the admin login.",
    },
    {
      q: "Do I need the Play Store or App Store?",
      a: "No. Install from this website (Add to Home Screen). It opens as the loyalty app, then takes you to login.",
    },
    {
      q: "Can staff and admin log in too?",
      a: "Yes. Use Login in the menu. Staff enter the station PIN to issue QR codes. Admin signs in with email to set discounts and rewards.",
    },
  ];

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
        <h1>
          {pointsPerLitre} point{pointsPerLitre === 1 ? "" : "s"} per litre. Rewards at the pump.
        </h1>
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
        <p className="kfs-lead">
          {pointsPerLitre} loyalty point{pointsPerLitre === 1 ? "" : "s"} per litre filled. Redeem at
          the station desk. Admin can change these.
        </p>
        <div className="kfs-cards kfs-reward-cards">
          {rewards.map((r) => (
            <article className="kfs-card" key={r.id}>
              <p className="kfs-reward-pts">{r.points} pts</p>
              <h3>{r.name}</h3>
              <p>
                {r.kind === "discount" && r.discountPkr
                  ? `Rs ${r.discountPkr} off the next fill`
                  : r.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="kfs-section">
        <p className="kfs-kicker dark">Login</p>
        <h2>Customers, staff and admin</h2>
        <p className="kfs-lead">
          Use the Login button in the menu. Customers sign in with mobile number and a personal PIN.
          Staff use the station PIN. Admin sets rewards and discounts.
        </p>
        <ul className="kfs-checks">
          <li>Customer: name, mobile number, PIN, then scan and redeem</li>
          <li>Staff: PIN to issue fill QR and mark rewards as done</li>
          <li>Admin: email login to set points, discounts and the staff PIN</li>
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
          {faqs.map((item) => (
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
