import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
          About khoyout
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[0.9fr_1.3fr] md:gap-16">
          {/* Photo slot - drop your photo at public/about.jpg */}
          <div className="overflow-hidden rounded-2xl border border-black/5 bg-teal-light">
            <Image
              src="/about.png"
              alt="Holy - founder of khoyout"
              width={500}
              height={500}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="max-w-[65ch] text-base leading-relaxed text-ink/70">
              Hey there! I&apos;m Holy, I&apos;m 18 and I&apos;m a fiber
              artist. I started my small business{" "}
              <a
                href="https://www.instagram.com/__khoyout/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-dark underline underline-offset-2"
              >
                @__khoyout
              </a>{" "}
              on August 2020, where I offer different kinds of customized and
              handmade fiber art.
            </p>

            <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-ink/70">
              khoyout means &ldquo;threads&rdquo; in Arabic, and that&apos;s
              really what this whole thing is built on: one thread at a time,
              turned into something you can hold, gift, or hang up and smile
              at. Every piece is crocheted by hand, no machines, no mass
              production &mdash; just yarn, a hook, and a lot of patience.
            </p>

            <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-ink/70">
              What started as a small hobby turned into a small business
              making car charms, plushies, and fully custom designs based on
              whatever the customer has in mind. If you can describe it,
              there&apos;s a good chance it can be crocheted.
            </p>

            <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-ink/70">
              I get to learn and try something new every day, and that&apos;s
              what I love most in the journey 🤍
            </p>

            <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-ink/70">
              Introduce yourself in the comments and let&apos;s get to know
              each other more 🥰
            </p>

            <a
              href="https://www.instagram.com/__khoyout/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-teal-dark underline underline-offset-4 transition hover:text-ink"
            >
              Follow @__khoyout on Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}