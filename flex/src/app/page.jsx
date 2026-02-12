import Hero from "@/components/Hero";
import ProductDetailSection from "@/components/ProductDetailSection";
import VisualShowcase from "@/components/VisualShowcase";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <main>
      <Hero></Hero>
      <WhyChooseUs></WhyChooseUs>
      <ProductDetailSection></ProductDetailSection>
      <VisualShowcase></VisualShowcase>
    </main>
  );
}
