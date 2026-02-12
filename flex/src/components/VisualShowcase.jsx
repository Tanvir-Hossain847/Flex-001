"use client";

import React, { useRef } from "react";
import { HiBolt, HiPaintBrush } from "react-icons/hi2";
import { FaSnowflake } from "react-icons/fa";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/autoplay";

gsap.registerPlugin(ScrollTrigger);

const variants = [
  {
    src: "https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882424/Flex_black_1_y5fi9i.png",
    name: "Obsidian",
    color: "#1a1a1a",
  },
  {
    src: "https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882424/Flex_blue_f16qpn.png",
    name: "Pacific",
    color: "#2563eb",
  },
  {
    src: "https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882424/Flex_red_hhethd.png",
    name: "Ember",
    color: "#740A03",
  },
  {
    src: "https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882422/flex_white_djnry7.png",
    name: "Arctic",
    color: "#e5e5e5",
  },
];

export default function VisualShowcase() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Animate the section heading
    gsap.from(".showcase-heading", {
      y: 40,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: ".showcase-heading",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    // Animate variant labels
    gsap.from(".variant-label", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      scrollTrigger: {
        trigger: ".swiper-section",
        start: "top 60%",
        toggleActions: "play none none reverse",
      },
    });

    // Animate the material section
    gsap.from(".material-item", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      
      scrollTrigger: {
        trigger: ".material-section",
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-primary text-base-content font-sans overflow-hidden selection:bg-secondary selection:text-primary-content">

      {/* 
        ================================================================
        EDITORIAL INTRO — "The Collection"
        ================================================================
      */}
      <section className="relative py-10 max-w-7xl mx-auto border-t border-base-content/5">
        <div className="showcase-heading grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-secondary font-mono text-xl">04</span>
              <div className="h-px w-12 bg-base-content/20"></div>
              <span className="text-sm uppercase tracking-widest text-base-content/40">The Collection</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-extralight leading-tight text-base-content">
              One bottle. <br />
              Four <span className="text-secondary italic font-medium">statements</span>.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base-content/60 text-lg leading-relaxed mb-6">
              Every Flex variant is crafted with the same uncompromising engineering.
              What changes is the character. Pick the one that speaks to you.
            </p>
            <div className="h-0.5 w-20 bg-secondary"></div>
          </div>
        </div>
      </section>

      {/* 
        ================================================================
        PRODUCT VARIANTS — Swiper Carousel
        ================================================================
      */}
      <section className="swiper-section relative py-20 bg-primary">
        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none">
          <h2 className="text-[18vw] font-black tracking-tighter text-base-content/[0.03] leading-none whitespace-nowrap">
            SERIES
          </h2>
        </div>

        {/* Glow behind active slide */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-secondary rounded-full blur-3xl opacity-10 pointer-events-none"></div>

        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 150,
            modifier: 2.5,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="mySwiper w-full max-w-full py-12 relative z-10"
        >
          {variants.map((item, index) => (
            <SwiperSlide
              key={index}
              className="w-[300px] md:w-[350px]"
            >
              <div className="relative w-full h-[400px] transition-transform duration-500">
                <Image
                  src={item.src}
                  alt={item.name}
                  fill
                  className="object-contain drop-shadow-xl"
                  sizes="(max-width: 768px) 100vw, 350px"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Variant Name Labels */}
        <div className="relative z-10 flex justify-center gap-8 md:gap-16 mt-8">
          {variants.map((item, index) => (
            <div key={index} className="variant-label flex flex-col items-center gap-2 group cursor-pointer">
              <div
                className="w-4 h-4 rounded-full border-2 border-base-content/20 group-hover:border-secondary transition-colors duration-300"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs uppercase tracking-widest text-base-content/40 group-hover:text-base-content transition-colors duration-300">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 
        ================================================================
        MATERIAL / CRAFT — Grid Section  
        ================================================================
      */}
      <section className="material-section relative py-32 px-6 md:px-20 max-w-7xl mx-auto border-t border-white/10">
        <div className="flex items-center gap-4 mb-16">
          <span className="text-secondary font-mono text-xl">05</span>
          <div className="h-px w-12 bg-white/20"></div>
          <span className="text-sm uppercase tracking-widest text-white/50">Material & Craft</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

          {/* Card 1 — 18/8 Stainless */}
          <div className="material-item group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 hover:border-secondary/40 transition-all duration-500">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            {/* Number badge */}
            <span className="text-xs font-mono text-white/20 mb-6 block">01</span>
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-secondary/15 border border-secondary/20 flex items-center justify-center mb-6 group-hover:bg-secondary/25 group-hover:border-secondary/40 group-hover:shadow-[0_0_25px_rgba(116,10,3,0.3)] transition-all duration-500">
              <HiBolt className="text-3xl text-red-400 group-hover:text-red-300 transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
              18/8 Stainless
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Medical-grade steel that resists corrosion and preserves pure flavor. No metallic aftertaste, ever.
            </p>
            <div className="h-[2px] w-0 bg-gradient-to-r from-secondary to-red-400 mt-6 group-hover:w-16 transition-all duration-500"></div>
          </div>

          {/* Card 2 — SureGrip™ Coat */}
          <div className="material-item group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 hover:border-secondary/40 transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="text-xs font-mono text-white/20 mb-6 block">02</span>
            <div className="w-16 h-16 rounded-2xl bg-secondary/15 border border-secondary/20 flex items-center justify-center mb-6 group-hover:bg-secondary/25 group-hover:border-secondary/40 group-hover:shadow-[0_0_25px_rgba(116,10,3,0.3)] transition-all duration-500">
              <HiPaintBrush className="text-3xl text-red-400 group-hover:text-red-300 transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
              SureGrip™ Coat
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Proprietary powder coat that is sweat-free, slip-resistant, and scratch-proof. Looks new for years.
            </p>
            <div className="h-[2px] w-0 bg-gradient-to-r from-secondary to-red-400 mt-6 group-hover:w-16 transition-all duration-500"></div>
          </div>

          {/* Card 3 — Vacuum Core */}
          <div className="material-item group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 hover:border-secondary/40 transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="text-xs font-mono text-white/20 mb-6 block">03</span>
            <div className="w-16 h-16 rounded-2xl bg-secondary/15 border border-secondary/20 flex items-center justify-center mb-6 group-hover:bg-secondary/25 group-hover:border-secondary/40 group-hover:shadow-[0_0_25px_rgba(116,10,3,0.3)] transition-all duration-500">
              <FaSnowflake className="text-3xl text-red-400 group-hover:text-red-300 transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
              Vacuum Core
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Double-wall vacuum insulation locks temperature in. 12 hours hot. 24 hours cold. No compromise.
            </p>
            <div className="h-[2px] w-0 bg-gradient-to-r from-secondary to-red-400 mt-6 group-hover:w-16 transition-all duration-500"></div>
          </div>

        </div>
      </section>
    </div>
  );
}
