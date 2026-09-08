export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-ink/50 sm:flex-row">
        <span>&copy; {new Date().getFullYear()} khoyout Handmade Products</span>
        <a
          href="https://www.instagram.com/__khoyout/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-teal-dark"
        >
          Instagram
        </a>
      </div>
    </footer>
  );
}
