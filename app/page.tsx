import Navbar from "@/components/Navbar";
import HomeBrokerList from "@/components/HomeBrokerList";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050d0c]">
      <Navbar />
      <HomeBrokerList />
      <Footer />
    </main>
  );
}