"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function FeatureGrid() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
    });

    // Animate text
    tl.from(textRef.current?.children || [], {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.15,
    });

    // Animate images
    tl.from(
      containerRef.current.querySelectorAll(".feature-image"),
      {
        opacity: 0,
        y: 30,
        scale: 0.96,
        duration: 1,
        ease: "power3.out",
        stagger: 0.18,
      },
      "-=0.5",
    );

    // Animate feature list
    tl.from(
      listRef.current?.children || [],
      {
        opacity: 0,
        y: 15,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
      },
      "-=0.7",
    );
  }, []);

  const features = [
    "No Plastic",
    "24H Cold Retention",
    "12H Heat Lock",
    "100% BPA Free Steel",
  ];

  return (
    <section className="bg-black py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Heading */}
        <div className="mb-16 flex items-center gap-4">
          <span className="h-px w-12 bg-gray-600" />
          <h2 className="text-2xl font-semibold text-white">Flex Features</h2>
        </div>

        {/* Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-6 md:auto-rows-[240px] gap-4 md:gap-6"
        >
          {/* Text Block */}
          <div
            ref={textRef}
            className="md:col-span-2 md:row-span-1 space-y-4 self-start"
          >
            <h3 className="text-lg font-medium text-white">Built Different</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Flex Flask is engineered for the streets, the gym, and the grind.
              Double-wall insulation keeps your drinks ice cold for 24 hours and
              hot for 12. Stainless steel. Zero compromise.
            </p>
          </div>

          {/* Image 1 */}
          <div className="feature-image md:col-span-2 md:row-span-1 relative rounded-xl overflow-hidden">
            <Image
              src="https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882422/image3_mmczl1.jpg"
              alt="Flex Flask product"
              fill
              className="object-cover
               hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Image 2 */}
          <div className="feature-image md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden">
            <Image
              src="https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882423/image_1_ircwqt.jpg"
              alt="Flex Flask portrait"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Image 3 */}
          <div className="feature-image md:col-span-4 md:row-span-1 relative rounded-xl overflow-hidden">
            <Image
              src="https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882423/image2_kjzqa6.jpg"
              alt="Flex Flask wide"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Image 4 */}
          <div className="feature-image md:col-span-2 md:row-span-1 relative rounded-xl overflow-hidden">
            <Image
              src="https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882423/image4_b3zxl9.jpg"
              alt="Flex Flask extra"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Image 5 */}
          <div className="feature-image md:col-span-2 md:row-span-1 relative rounded-xl overflow-hidden">
            <Image
              src="https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882423/image5_guepg7.jpg"
              alt="Flex Flask extra"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Feature List */}
          <div
            ref={listRef}
            className="md:col-span-2 md:row-span-1 space-y-4 self-end"
          >
            {features.map((item) => (
              <div
                key={item}
                className="border-b border-gray-700 pb-2 text-sm text-gray-300 cursor-pointer"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
