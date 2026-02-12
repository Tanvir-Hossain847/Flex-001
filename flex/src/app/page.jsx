import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import ProductDetailSection from "@/components/ProductDetailSection";
import VisualShowcase from "@/components/VisualShowcase";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer"; // Ensure this is imported

export default function Home() {
  return (
    <main>
      <Hero />
      <WhyChooseUs />
      <ProductDetailSection />
      <VisualShowcase />
      <ReviewsSection />
      <Footer />
    </main>
  );
}
