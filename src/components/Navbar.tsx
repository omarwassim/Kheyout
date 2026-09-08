import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="khoyout logo"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <span className="font-display text-lg font-semibold tracking-tight">
            khoyout
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-ink/70 sm:flex">
          <a href="#product" className="transition hover:text-teal-dark">
            Spider-Man
          </a>
          <a href="#about" className="transition hover:text-teal-dark">
            About
          </a>
          <a href="#reviews" className="transition hover:text-teal-dark">
            Reviews
          </a>
          <a href="#reserve" className="transition hover:text-teal-dark">
            Reserve
          </a>
        </nav>
        <a
          href="#reserve"
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream transition active:scale-[0.98]"
        >
          Reserve now
        </a>
      </div>
    </header>
  );
}
