import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Services } from "@/components/Services";
import { Team } from "@/components/Team";
import { OrderForm } from "@/components/OrderForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <Services />
        <Team />
        <OrderForm />
      </main>
      <Footer />
    </>
  );
}
