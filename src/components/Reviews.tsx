import { reviews } from "@/lib/data/reviews";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rating ? "fill-teal" : "fill-black/10"}`}
        >
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
        What customers say
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reviews.map((review) => (
          <div
            key={review.name}
            className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_20px_40px_-25px_rgba(0,0,0,0.15)]"
          >
            <Stars rating={review.rating} />
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              &ldquo;{review.text}&rdquo;
            </p>
            <p className="mt-4 text-sm font-medium text-ink">{review.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
