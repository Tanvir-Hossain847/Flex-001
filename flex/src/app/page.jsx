import Hero from "@/components/Hero";
import OurProducts from "@/components/OurProducts";
import ProductDetailSection from "@/components/ProductDetailSection";
import VisualShowcase from "@/components/VisualShowcase";
import ReviewsSection from "@/components/ReviewsSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <OurProducts />
      <ProductDetailSection />
      <VisualShowcase />
      <ReviewsSection />
    </main>
  );
}
