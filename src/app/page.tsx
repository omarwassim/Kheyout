import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Reviews from "@/components/Reviews";
import ReservationForm from "@/components/ReservationForm";
import DiscountModal from "@/components/DiscountModal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-[100dvh] bg-cream">
      <DiscountModal />
      <Navbar />
      <Hero />
      <About />
      <Reviews />
      <section id="reserve" className="border-t border-black/5 bg-white">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Reserve your Spider-Man
          </h2>
          <p className="mt-2 text-sm text-ink/50">
            Fill in your details below. Payment is cash on delivery.
          </p>
          <div className="mt-8">
            <ReservationForm />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
