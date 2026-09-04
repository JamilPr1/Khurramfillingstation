"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Btn, Note, ScreenHeader, SelectField } from "@/components/ui";
import { FEEDBACK_TOPICS } from "@/lib/config";

export default function FeedbackPage() {
  const router = useRouter();
  const [stars, setStars] = useState(5);
  const [topic, setTopic] = useState(FEEDBACK_TOPICS[0]);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stars, topic, comment }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not send");
      return;
    }
    router.replace("/customer");
  }

  return (
    <>
      <ScreenHeader title="Feedback" subtitle="Sent to station staff only" />
      <form onSubmit={onSubmit} className="kfs-app-body">
        <div className="card mb-4 px-4 py-4 text-center">
          <p className="mb-2 text-xs font-medium text-[#667066]">Rating</p>
          <div className="flex justify-center gap-2 text-2xl">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setStars(n)}
                className={n <= stars ? "text-[#f9d900]" : "text-[#d5d8d2]"}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <SelectField label="Topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
          {FEEDBACK_TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </SelectField>
        <label className="mb-3 block text-[13px] font-medium">
          Comment (optional)
          <textarea
            className="kfs-app-input"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Anything we should know…"
          />
        </label>
        {error ? <Note error>{error}</Note> : null}
        <Btn type="submit" disabled={busy}>
          {busy ? "Sending…" : "Send feedback"}
        </Btn>
      </form>
    </>
  );
}
