"use client";

import { FormEvent, useState } from "react";
import { STATION } from "@/lib/config";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setOk("");
    setErr("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, message }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setErr(data.error || "Could not send");
      return;
    }
    setOk("Message sent. We will get back to you.");
    setName("");
    setPhone("");
    setEmail("");
    setMessage("");
  }

  return (
    <section className="kfs-contact" id="contact" aria-labelledby="kfs-contact-title">
      <p className="kfs-kicker dark">Contact</p>
      <h2 id="kfs-contact-title">Send a message</h2>
      <p>Ask about fuels, the pump, or the loyalty card. Or call {STATION.phone}.</p>
      <form onSubmit={onSubmit}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
        </label>
        <label>
          Mobile
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            inputMode="tel"
            autoComplete="tel"
          />
        </label>
        <label>
          Email (optional)
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
        <label>
          Message
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>
        {err ? <p className="kfs-contact-err">{err}</p> : null}
        {ok ? <p className="kfs-contact-ok">{ok}</p> : null}
        <button className="kfs-btn kfs-btn-yellow" type="submit" disabled={busy}>
          {busy ? "Sending…" : "Send message"}
        </button>
      </form>
    </section>
  );
}
