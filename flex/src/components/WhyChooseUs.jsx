"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    id: 1,
    title: "Thermodynamics, Mastered.",
    subtitle: "12H HOT / 24H COLD",
    description:
      "Stop drinking lukewarm coffee. Our double-wall vacuum insulation creates a thermal barrier that locks temperature in. Your morning brew stays steaming hot until your evening commute.",
    image:
      "https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882423/image_1_ircwqt.jpg",
    align: "left",
  },
  {
    id: 2,
    title: "Built for War (and Commutes).",
    subtitle: "AEROSPACE GRADE STEEL",
    description:
      "Glass shatters. Plastic cracks. Flex survives. Constructed from 18/8 pro-grade stainless steel with a proprietary powder coat finish that resists scratches, dents, and drops.",
    image:
      "https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882423/image2_kjzqa6.jpg",
    align: "right",
  },
  {
    id: 3,
    title: "Zero Leaks. Zero Panic.",
    subtitle: "PRECISION SEAL TECHNOLOGY",
    description:
      "Toss it in your bag with your laptop. Our lid engineering ensures a completely airtight seal. No moisture, no condensation, no disasters. Just pure confidence.",
    image:
      "https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882422/image3_mmczl1.jpg",
    align: "left",
  },
];

const WhyChooseUs = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const sections = gsap.utils.toArray(".feature-row");

      sections.forEach((section) => {
        const img = section.querySelector(".feature-img");
        const text = section.querySelector(".feature-text");

        // Text Reveal Animation
        gsap.from(text, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });

        // Image Parallax Effect (Image moves slower than scroll)
        gsap.fromTo(
          img,
          { y: -20, scale: 1.1 },
          {
            y: 20,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="bg-neutral text-neutral-content py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-32">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={`feature-row flex flex-col lg:flex-row items-center gap-12 md:gap-16 lg:gap-24 ${
              feature.align === "right" ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Text Side */}
            <div className="feature-text flex-1 space-y-6 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 text-secondary font-mono text-sm tracking-widest uppercase">
                <span className="text-xl">0{index + 1}</span>
                <div className="h-px w-12 bg-secondary"></div>
                <span>{feature.subtitle}</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black leading-tight">
                {feature.title}
              </h2>

              <p className="text-lg md:text-xl text-neutral-content/60 leading-relaxed max-w-lg mx-auto lg:mx-0">
                {feature.description}
              </p>

              <button className="group flex items-center gap-3 text-white font-bold mt-4 mx-auto lg:mx-0 hover:text-secondary transition-colors duration-300">
                <span>Learn more</span>
                <span className="group-hover:translate-x-2 transition-transform duration-300">
                  →
                </span>
              </button>
            </div>
            {/* Image Side */}
            <div className="flex-1 w-full relative aspect-[4/5] md:aspect-square overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-secondary/10 mix-blend-overlay z-10 pointer-events-none"></div>
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="feature-img object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
