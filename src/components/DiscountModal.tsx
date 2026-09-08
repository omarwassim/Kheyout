"use client";

import { useEffect, useState, FormEvent } from "react";

const STORAGE_KEY = "khoyout_discount_email";
const SEEN_KEY = "khoyout_discount_modal_seen";

export default function DiscountModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const alreadySeen = localStorage.getItem(SEEN_KEY);
    const alreadySubscribed = localStorage.getItem(STORAGE_KEY);
    if (!alreadySeen && !alreadySubscribed) {
      const timer = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function close() {
    localStorage.setItem(SEEN_KEY, "true");
    setOpen(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      localStorage.setItem(STORAGE_KEY, email);
      localStorage.setItem(SEEN_KEY, "true");
      setStatus("success");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setStatus("error");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 text-ink/40 transition hover:text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M1 1L17 17M17 1L1 17"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {status === "success" ? (
          <div className="text-center">
            <h3 className="font-display text-xl font-semibold text-ink">
              You&apos;re in!
            </h3>
            <p className="mt-2 text-sm text-ink/60">
              Your 15% discount will be applied automatically at checkout
              when you reserve with this email.
            </p>
            <button
              onClick={close}
              className="mt-6 rounded-full bg-ink px-6 py-2 text-sm font-medium text-cream"
            >
              Continue browsing
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-display text-xl font-semibold text-ink">
              Get 15% off
            </h3>
            <p className="mt-2 text-sm text-ink/60">
              Leave your email and get 15% off your Spider-Man reservation.
            </p>
            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
              />
              {status === "error" && (
                <p className="text-xs text-red-600">{errorMsg}</p>
              )}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="rounded-full bg-teal py-2.5 text-sm font-medium text-white transition hover:bg-teal-dark active:scale-[0.98] disabled:opacity-60"
              >
                {status === "submitting" ? "Submitting..." : "Get my discount"}
              </button>
              <button
                type="button"
                onClick={close}
                className="text-xs text-ink/40 underline underline-offset-2"
              >
                No thanks
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
