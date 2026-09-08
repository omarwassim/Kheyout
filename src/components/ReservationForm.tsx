"use client";

import { useState, useRef, FormEvent, useEffect } from "react";

const BASE_PRICE = 530;
const DISCOUNT_PERCENT = 15;

type Step = "form" | "review" | "success";
type Status = "idle" | "submitting" | "error";

interface FormState {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  quantity: number;
  description: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  addressLine1: "",
  quantity: 1,
  description: "",
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ReservationForm() {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [imageName, setImageName] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderTotal, setOrderTotal] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasDiscount(localStorage.getItem("kheyout_discount_email") !== null);
  }, []);

  // Math.floor keeps this in sync with the server: 530 * 0.85 = 450.5 -> clean 450
  const unitPrice = hasDiscount
    ? Math.floor(BASE_PRICE * (1 - DISCOUNT_PERCENT / 100))
    : BASE_PRICE;
  const total = unitPrice * form.quantity;

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image must be smaller than 5MB.");
      return;
    }
    setImageName(file.name);
    setImageData(await fileToDataUrl(file));
  }

  function goToReview(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    setStep("review");
  }

  async function confirmOrder() {
    setStatus("submitting");
    setErrorMsg("");

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      addressLine1: form.addressLine1,
      quantity: form.quantity,
      description: form.description || undefined,
      customDesignImage: imageData || undefined,
    };

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setOrderTotal(data.totalPrice);
      setStep("success");
      setStatus("idle");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setStatus("error");
    }
  }

  function startOver() {
    setForm(EMPTY_FORM);
    setImageName(null);
    setImageData(null);
    setStatus("idle");
    setErrorMsg("");
    setStep("form");
  }

  // --- SUCCESS ---
  if (step === "success") {
    return (
      <div className="rounded-2xl border border-teal/30 bg-teal-light p-8 text-center">
        <h3 className="font-display text-xl font-semibold text-teal-dark">
          Reservation received
        </h3>
        <p className="mt-2 text-sm text-ink/70">
          Thank you! Your total is{" "}
          <span className="font-semibold text-ink">{orderTotal} EGP</span>{" "}
          (cash on delivery). We&apos;ll contact you shortly to confirm.
        </p>
        <button
          onClick={startOver}
          className="mt-6 rounded-full bg-ink px-6 py-2 text-sm font-medium text-cream transition active:scale-[0.98]"
        >
          Make another reservation
        </button>
      </div>
    );
  }

  // --- REVIEW ---
  if (step === "review") {
    const rows: { label: string; value: string }[] = [
      { label: "Name", value: form.name },
      { label: "Email", value: form.email },
      { label: "Phone", value: form.phone },
      { label: "Address", value: form.addressLine1 },
      { label: "Quantity", value: String(form.quantity) },
      { label: "Payment", value: "Cash on delivery" },
    ];
    if (form.description) {
      rows.push({ label: "Notes", value: form.description });
    }

    return (
      <div className="space-y-5">
        <h3 className="font-display text-lg font-semibold text-ink">
          Review your order
        </h3>
        <p className="text-sm text-ink/50">
          Check everything below. You can go back and edit before confirming.
        </p>

        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <dl className="divide-y divide-black/5">
            {rows.map((row) => (
              <div key={row.label} className="flex justify-between gap-4 py-2.5 text-sm">
                <dt className="text-ink/50">{row.label}</dt>
                <dd className="text-right font-medium text-ink">{row.value}</dd>
              </div>
            ))}
            {imageName && (
              <div className="flex justify-between gap-4 py-2.5 text-sm">
                <dt className="text-ink/50">Custom design</dt>
                <dd className="text-right font-medium text-ink">{imageName}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-teal-light px-5 py-4">
          <div className="text-sm text-ink/70">
            {hasDiscount ? (
              <span className="font-medium text-teal-dark">
                15% discount applied
              </span>
            ) : (
              <span>Standard price</span>
            )}
          </div>
          <div className="text-right">
            {hasDiscount && (
              <span className="mr-2 text-xs text-ink/40 line-through">
                {BASE_PRICE * form.quantity} EGP
              </span>
            )}
            <span className="font-display text-lg font-semibold text-ink">
              {total} EGP
            </span>
          </div>
        </div>

        {status === "error" && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMsg}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep("form")}
            className="flex-1 rounded-full border border-black/10 py-3 text-sm font-medium text-ink transition hover:border-black/20"
          >
            Edit order
          </button>
          <button
            type="button"
            onClick={confirmOrder}
            disabled={status === "submitting"}
            className="flex-1 rounded-full bg-ink py-3 text-sm font-medium text-cream transition active:scale-[0.98] disabled:opacity-60"
          >
            {status === "submitting" ? "Placing order..." : "Confirm order"}
          </button>
        </div>
      </div>
    );
  }

  // --- FORM ---
  return (
    <form onSubmit={goToReview} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-ink">
            Full name
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
            placeholder="Your name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
            placeholder="you@example.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-medium text-ink">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
            placeholder="01xxxxxxxxx"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="quantity" className="text-sm font-medium text-ink">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            required
            value={form.quantity}
            onChange={(e) =>
              updateField("quantity", Math.max(1, Number(e.target.value) || 1))
            }
            className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="addressLine1" className="text-sm font-medium text-ink">
          Address (line 1)
        </label>
        <input
          id="addressLine1"
          required
          value={form.addressLine1}
          onChange={(e) => updateField("addressLine1", e.target.value)}
          className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
          placeholder="Street, building, city"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium text-ink">
          Notes <span className="font-normal text-ink/40">(optional)</span>
        </label>
        <textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
          placeholder="Anything we should know about your order"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">Payment method</span>
        <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-ink/70">
          <span className="h-2 w-2 rounded-full bg-teal" />
          Cash on delivery
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-black/15 bg-white p-5">
        <p className="text-sm font-medium text-ink">
          Custom design reference{" "}
          <span className="font-normal text-ink/40">(optional)</span>
        </p>
        <p className="mt-1 text-xs text-ink/50">
          Upload a photo if you&apos;d like a custom design instead of the
          standard Spider-Man.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full border border-black/10 bg-cream px-4 py-2 text-xs font-medium text-ink transition hover:border-teal/40"
          >
            Choose photo
          </button>
          {imageName && (
            <span className="truncate text-xs text-ink/60">{imageName}</span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-teal-light px-5 py-4">
        <div className="text-sm text-ink/70">
          {hasDiscount ? (
            <span className="font-medium text-teal-dark">
              15% discount applied
            </span>
          ) : (
            <span>Unlock 15% off by entering your email above</span>
          )}
        </div>
        <div className="text-right">
          {hasDiscount && (
            <span className="mr-2 text-xs text-ink/40 line-through">
              {BASE_PRICE * form.quantity} EGP
            </span>
          )}
          <span className="font-display text-lg font-semibold text-ink">
            {total} EGP
          </span>
        </div>
      </div>

      {errorMsg && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-full bg-ink py-3 text-sm font-medium text-cream transition active:scale-[0.98]"
      >
        Review order
      </button>
    </form>
  );
}