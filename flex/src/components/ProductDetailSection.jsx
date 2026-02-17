"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const ProductDetailSection = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(() => {
    // --- Hero Parallax ---
    gsap.to(textRef.current, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // --- Hotspots Entry & Auto-Reveal ---
    // --- Hotspots Entry & Auto-Reveal ---
    gsap.fromTo(".hotspot-group", 
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "elastic.out(1, 0.75)",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 60%", // Animate when product is in view
          toggleActions: "play none none reverse",
        },
      }
    );

    // Auto-reveal hotspots on scroll
    gsap.to(".hotspot-line", {
      scaleX: 1,
      duration: 0.4,
      ease: "expo.out",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top 35%",
        toggleActions: "play none none reverse",
      },
    });

    gsap.to(".hotspot-detail", {
      opacity: 1,
      x: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: "expo.out",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top 35%",
        toggleActions: "play none none reverse",
      },
    });

    // --- Editorial Section Animations ---
    
    // Parallax Watermark
    gsap.to(".watermark", {
      xPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: ".editorial-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      }
    });

    // Clipping Mask Text Reveal
    gsap.fromTo(".reveal-text", 
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".editorial-section",
          start: "top 75%", // Trigger earlier
          toggleActions: "play none none reverse", // Allow re-play
        }
      }
    );

    // Description and line reveal
    gsap.fromTo(".editorial-content-reveal", 
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".editorial-section",
          start: "top 65%",
          toggleActions: "play none none reverse",
        }
      }
    );

    gsap.fromTo(".editorial-line", 
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.2,
        ease: "expo.inOut",
        scrollTrigger: {
          trigger: ".editorial-section",
          start: "top 65%",
          toggleActions: "play none none reverse",
        }
      }
    );

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="bg-primary text-base-content font-sans overflow-hidden selection:bg-secondary selection:text-primary-content"
    >
      {/* 
        ================================================================
        HERO SECTION
        ================================================================
      */}
      <section
        ref={heroRef}
        className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      >
        {/* Massive Background Text (Parallax) */}
        <div
          ref={textRef}
          className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none mb-60 select-none"
        >
          <h1 className="text-[20vw] md:text-[23vw] font-black tracking-tighter text-base-content/5 leading-none whitespace-nowrap uppercase">
            FLEX
          </h1>
        </div>

        {/* Floating Abstract Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-base-content/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute bottom-40 left-10 w-20 h-20 border border-secondary/30 rounded-full animate-[bounce_5s_infinite]"></div>

        {/* Main Product Image Container */}
        <div className="relative z-10 w-11/12 md:w-full flex justify-center items-center mt-20">
          {/* Glowing Backlight */}
          <div className="absolute w-96 h-96 bg-secondary rounded-full blur-3xl opacity-20"></div>

          <div className="relative w-11/12 md:max-w-230 transition-transform duration-500 hover:scale-[1.01]">
            <Image
              src="https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882423/Transparent-Model_z7lplb.png"
              alt="Flex Thermos"
              width={800}
              height={1600}
              className="w-full h-auto object-contain drop-shadow-2xl"
              priority
            />

            {/* HOTSPOT 1: Smart Lid */}
            <div className="hotspot-group absolute top-[12%] right-[25%] group">
              <div className="relative w-4 h-4 cursor-pointer">
                <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-75"></div>
                <div className="relative w-4 h-4 bg-white rounded-full border-2 border-primary"></div>
              </div>
              <div className="hotspot-line absolute top-2 left-4 w-12 md:w-20 h-px bg-base-content/50 origin-left scale-x-0"></div>
              <div className="hotspot-detail absolute -top-3 left-16 md:left-24 opacity-0 -translate-x-4">
                <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-secondary">
                  Smart Lid
                </h4>
                <p className="text-[10px] md:text-xs text-base-content/70 whitespace-nowrap font-medium">
                  Leak-proof technology
                </p>
              </div>
            </div>

            {/* HOTSPOT 2: Double Wall */}
            <div className="hotspot-group absolute top-[45%] left-[28%] group">
              <div className="relative w-4 h-4 cursor-pointer">
                <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-75"></div>
                <div className="relative w-4 h-4 bg-white rounded-full border-2 border-primary"></div>
              </div>
              <div className="hotspot-line absolute top-2 right-4 w-12 md:w-20 h-px bg-base-content/50 origin-right scale-x-0"></div>
              <div className="hotspot-detail absolute -top-3 right-16 md:right-24 opacity-0 translate-x-4 text-right">
                <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-secondary">
                  Vacuum Core
                </h4>
                <p className="text-[10px] md:text-xs text-base-content/70 whitespace-nowrap font-medium">
                  24h Cold / 12h Hot
                </p>
              </div>
            </div>

            {/* HOTSPOT 3: Base */}
            <div className="hotspot-group absolute bottom-[15%] right-[32%] group">
              <div className="relative w-4 h-4 cursor-pointer">
                <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-75"></div>
                <div className="relative w-4 h-4 bg-white rounded-full border-2 border-primary"></div>
              </div>
              <div className="hotspot-line absolute top-2 left-4 w-12 md:w-20 h-px bg-base-content/50 origin-left scale-x-0"></div>
              <div className="hotspot-detail absolute -top-3 left-16 md:left-24 opacity-0 -translate-x-4">
                <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-secondary">
                  Non-Slip
                </h4>
                <p className="text-[10px] md:text-xs text-base-content/70 whitespace-nowrap font-medium">
                  Silicone Protection
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-pulse text-base-content">
          <span className="text-[10px] tracking-[0.3em] font-light">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-base-content to-transparent"></div>
        </div>
      </section>

      {/* 
        ================================================================
        EDITORIAL / STORY SECTION
        ================================================================
      */}
      <section className="editorial-section relative z-10 py-40 overflow-hidden bg-primary">
         {/* Background Watermark */}
         <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <span className="watermark text-[30vw] font-black tracking-tighter uppercase whitespace-nowrap">
                CRAFTED
            </span>
         </div>

         <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20">
            <div className="flex flex-col gap-0 text-center md:text-left">
                <div className="overflow-hidden mb-[-1vw]">
                    <h2 className="reveal-text text-6xl md:text-8xl lg:text-[10vw] font-black leading-[0.9] uppercase tracking-tighter text-base-content">
                        Designed
                    </h2>
                </div>
                <div className="overflow-hidden flex justify-center md:justify-end mb-[-1vw]">
                    <h2 className="reveal-text text-6xl md:text-8xl lg:text-[10vw] font-black leading-[0.9] uppercase tracking-tighter text-secondary italic">
                        For The
                    </h2>
                </div>
                <div className="overflow-hidden">
                    <h2 className="reveal-text text-6xl md:text-8xl lg:text-[10vw] font-black leading-[0.9] uppercase tracking-tighter text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)' }}>
                        Elite
                    </h2>
                </div>
            </div>

            <div className="mt-24 flex flex-col md:flex-row items-end justify-between gap-12">
                <div className="max-w-2xl editorial-content-reveal">
                    <p className="text-2xl md:text-4xl font-light text-base-content/60 leading-[1.1] tracking-tight">
                        Everything we build is a testament to the <br/>
                        <span className="text-base-content font-bold uppercase tracking-widest text-lg md:text-xl inline-block mt-4 py-2 px-4 border border-base-content/20 bg-base-content/5">
                            uncompromising pursuit of perfection
                        </span> 
                        <br/> No shortcuts. No filler. Just pure utility.
                    </p>
                </div>
                <div className="flex flex-col items-end gap-6 editorial-content-reveal">
                     <div className="editorial-line h-px w-48 bg-secondary origin-right"></div>
                     <span className="text-secondary font-mono tracking-[0.6em] text-xs uppercase text-right">Legacy of <br className="md:hidden"/> Excellence</span>
                </div>
            </div>
         </div>
      </section>

      {/* 
        ================================================================
        CTA SECTION
        ================================================================
      */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-primary z-30">
        {/* Ambient Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/10 via-primary to-primary"></div>

        <div className="relative z-10">
          <h2 className="text-6xl md:text-8xl font-black uppercase mb-12 tracking-tighter opacity-90 scale-y-110 text-base-content leading-none">
            Elevate <br/> Your <span className="text-secondary italic">Game</span>
          </h2>

          <button className="group relative px-16 py-4 border border-base-content/20 bg-black/40 backdrop-blur-xl overflow-hidden rounded-full transition-all duration-500 hover:border-secondary/50 hover:shadow-[0_0_40px_rgba(116,10,3,0.3)]">
            <span className="relative z-10 text-xl font-black tracking-[0.4em] group-hover:text-white transition-colors duration-300 text-base-content">
              PRE-ORDER NOW
            </span>
            <div className="absolute inset-0 bg-secondary transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[expo.out]"></div>
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailSection;
