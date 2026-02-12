import Hero from "@/components/Hero";
import ProductDetailSection from "@/components/ProductDetailSection";
import VisualShowcase from "@/components/VisualShowcase";
import ReviewsSection from "@/components/ReviewsSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductDetailSection />
      <VisualShowcase />
      <ReviewsSection />
    </main>
  );
}
