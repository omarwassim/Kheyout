import Image from "next/image";

export default function Hero() {
  return (
    <section id="product" className="mx-auto max-w-7xl px-6 pb-16 pt-12 sm:pt-20">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-mustard-light px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-clay-dark">
            🧶 Handmade, one stitch at a time
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Crochet{" "}
            <span className="italic text-clay">Spider-Man</span>
            <br />
            Car Charm
          </h1>
          <p className="mt-6 max-w-[45ch] text-base leading-relaxed text-ink/60">
            Hand-crocheted, stitch by stitch, and made to hang from your
            mirror. Each one is made to order &mdash; reserve yours below.
          </p>
          <div className="mt-8 flex items-center gap-4">
            {/* <span className="font-display text-3xl font-semibold text-ink">
            450 EGP
            </span> */}
            <span className="rounded-full bg-teal-light px-3 py-1 text-xs font-medium text-teal-dark">
              Cash on delivery
            </span>
          </div>
          <a
            href="#reserve"
            className="mt-8 inline-block rounded-full bg-clay px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-clay-dark active:-translate-y-[1px]"
          >
            Reserve yours
          </a>
        </div>

        <div className="relative mx-auto max-w-sm md:max-w-none">
          {/* organic blob accent shapes */}
          <div
            className="absolute -inset-6 -z-10 bg-teal-light"
            style={{ borderRadius: "62% 38% 55% 45% / 45% 55% 45% 55%" }}
          />
          <div
            className="absolute -bottom-6 -right-4 -z-10 h-24 w-24 bg-mustard-light"
            style={{ borderRadius: "68% 32% 60% 40% / 40% 60% 40% 60%" }}
          />
          <div className="overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-soft">
            <Image
              src="/spiderman.png"
              alt="Handmade crochet Spider-Man car charm"
              width={600}
              height={780}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}