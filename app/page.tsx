import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BrokerTable from "@/components/BrokerTable";
import Comparison from "@/components/Comparison";
import WhyMTR from "@/components/WhyMTR";
import WhoItsFor from "@/components/WhoItsFor";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050d0c]">
      <Navbar />
      <Hero />
      <BrokerTable />
      <Comparison />
      <WhyMTR />
      <WhoItsFor />
      <Footer />
    </main>
  );
}
