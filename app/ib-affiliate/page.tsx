import Navbar from "@/components/Navbar";
import Hero from "@/app/ib-affiliate/_components/Hero";
import BrokerTable from "@/app/ib-affiliate/_components/BrokerTable";
import Comparison from "@/app/ib-affiliate/_components/Comparison";
import WhyMTR from "@/app/ib-affiliate/_components/WhyMTR";
import WhoItsFor from "@/app/ib-affiliate/_components/WhoItsFor";
import Footer from "@/components/Footer";

export default function IBAffiliatePage() {
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