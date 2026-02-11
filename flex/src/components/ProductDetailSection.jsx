"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const features = [
  { 
    title: "THERMALCORE", 
    subtitle: "TEMPERATURE CONTROL",
    desc: "Engineered with double-wall vacuum insulation to keep beverages hot for 12 hours or cold for 24." 
  },
  { 
    title: "AEROSPACE", 
    subtitle: "GRADE MATERIAL",
    desc: "Constructed with 18/8 Pro-Grade Stainless Steel for pure taste and zero flavor transfer." 
  },
  { 
    title: "SUREGRIP", 
    subtitle: "FINISH",
    desc: "Proprietary powder coat means an easy-grip, sweat-free, and extra-durable bottle." 
  },
];

const ProductDetailSection = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const scrollSectionRef = useRef(null);

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

      // --- Hotspots Entry ---
      gsap.from(".hotspot-group", {
        scale: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "elastic.out(1, 0.75)",
        delay: 0.8
      });

      // --- Scroll Section Pinning & Reveal ---
      const blocks = gsap.utils.toArray(".feature-block");
      
      ScrollTrigger.create({
        trigger: scrollSectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: ".sticky-image",
        scrub: true,
      });

      blocks.forEach((block) => {
        gsap.from(block.querySelectorAll(".anim-text"), {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            scrollTrigger: {
                trigger: block,
                start: "top 60%", 
                end: "top 20%",
                scrub: 1,
                toggleActions: "play none none reverse"
            }
        });
      });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-primary text-base-content font-sans overflow-hidden selection:bg-secondary selection:text-primary-content">
      
      {/* 
        ================================================================
        HERO SECTION
        ================================================================
      */}
      <section ref={heroRef} className="relative h-[100%] w-full flex items-center justify-center overflow-hidden">
        
        {/* Massive Background Text (Parallax) */}
        <div ref={textRef} className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none">
            <h1 className="text-[20vw] md:text-[23vw] font-black tracking-tighter text-base-content/5 leading-none whitespace-nowrap">
                FLEX 
            </h1>
        </div>

        {/* Floating Abstract Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-base-content/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute bottom-40 left-10 w-20 h-20 border border-secondary/30 rounded-full animate-[bounce_5s_infinite]"></div>

        {/* Main Product Image Container */}
        <div className="relative z-10 w-full flex justify-center items-center mt-20">
             {/* Glowing Backlight */}
             <div className="absolute w-96 h-96 bg-secondary rounded-full blur-3xl opacity-20"></div>

             <div className="relative lg:w-250 transition-transform duration-500 hover:scale-[1.02]">
                <Image 
                    src="https://i.ibb.co.com/7tJYwqLD/Transparent-Model.png" 
                    alt="Flex Thermos" 
                    width={800} 
                    height={1600} 
                    className="lg:w-300 h-auto object-contain drop-shadow-2xl"
                    priority
                />

                {/* HOTSPOT 1: Smart Lid */}
                <div className="hotspot-group absolute top-[12%] right-[25%] group">
                    <div className="relative w-4 h-4 cursor-pointer">
                        <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-75"></div>
                        <div className="relative w-4 h-4 bg-white rounded-full border-2 border-primary"></div>
                    </div>
                    <div className="absolute top-2 left-4 w-16 md:w-24 h-px bg-base-content/50 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -top-3 left-20 md:left-28 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75">
                         <h4 className="text-sm font-bold uppercase tracking-widest text-secondary">Smart Lid</h4>
                         <p className="text-xs text-base-content/70 whitespace-nowrap">Leak-proof seal technology</p>
                    </div>
                </div>           

                 {/* HOTSPOT 2: Double Wall */}
                <div className="hotspot-group absolute top-[45%] left-[28%] group">
                    <div className="relative w-4 h-4 cursor-pointer">
                        <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-75"></div>
                        <div className="relative w-4 h-4 bg-white rounded-full border-2 border-primary"></div>
                    </div>
                    <div className="absolute top-2 right-4 w-16 md:w-24 h-px bg-base-content/50 origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -top-3 right-20 md:right-28 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75 text-right">
                         <h4 className="text-sm font-bold uppercase tracking-widest text-secondary">Vacuum Core</h4>
                         <p className="text-xs text-base-content/70 whitespace-nowrap">24h Cold / 12h Hot</p>
                    </div>
                </div>

                 {/* HOTSPOT 3: Base */}
                <div className="hotspot-group absolute bottom-[15%] right-[32%] group">
                    <div className="relative w-4 h-4 cursor-pointer">
                        <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-75"></div>
                        <div className="relative w-4 h-4 bg-white rounded-full border-2 border-primary"></div>
                    </div>
                    <div className="absolute top-2 left-4 w-16 md:w-24 h-px bg-base-content/50 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -top-3 left-20 md:left-28 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75">
                         <h4 className="text-sm font-bold uppercase tracking-widest text-secondary">Silicone Base</h4>
                         <p className="text-xs text-base-content/70 whitespace-nowrap">Anti-slip protection</p>
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
      <section className="relative z-10 py-15 px-6 md:px-20 max-w-7xl mx-auto border-t border-base-content/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8">
                <h2 className="text-4xl md:text-6xl font-extralight leading-tight mb-8 text-base-content">
                    Designed for the <br /> <span className="text-secondary italic font-medium">relentless</span>. <br/>
                    Engineered for <br /> <span className="font-bold text-base-content">perfection</span>.
                </h2>
            </div>
            <div className="lg:col-span-4">
                 <p className="text-base-content/60 text-lg leading-relaxed mb-6">
                    The Flex Bottle isn't just a container; it's a statement. Crafted from aerospace-grade materials and designed with a minimalist philosophy, it strikes the perfect balance between raw utility and elegant aesthetics.
                </p>
                <div className="h-0.5 w-20 bg-secondary"></div>
            </div>
        </div>
      </section>

      {/* 
        ================================================================
        SCROLL DETAILS (SPLIT VIEW)
        ================================================================
      */}
      <section ref={scrollSectionRef} className="relative min-h-[300vh] flex flex-col md:flex-row bg-neutral">
        
        {/* Sticky Image Side */}
        <div className="sticky-image hidden md:flex w-1/2 h-screen sticky top-0 items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-base-content/5 to-transparent"></div>
            
            <div className="relative w-210 h-110">
                 <Image 
                  src="https://i.ibb.co.com/7tJYwqLD/Transparent-Model.png" 
                  alt="Thermos Detail" 
                  fill
                  className="drop-shadow-2xl"
                />
            </div>
        </div>

        {/* Scrolling Content Side */}
        <div className="w-full md:w-1/2 relative z-10">
             <div className="flex flex-col">
                {features.map((item, i) => (
                    <div key={i} className="feature-block min-h-screen flex flex-col justify-center px-12 md:px-24 border-l border-base-content/5 hover:bg-base-content/[0.02] transition-colors duration-500">
                        <div className="anim-text mb-4 flex items-center gap-4">
                            <span className="text-secondary font-mono text-xl">0{i+1}</span>
                            <div className="h-px w-12 bg-base-content/20"></div>
                        </div>
                        <h3 className="anim-text text-5xl md:text-6xl font-bold mb-2 tracking-tight text-neutral-content">
                            {item.title}
                        </h3>
                        <h4 className="anim-text text-xl md:text-2xl font-light text-neutral-content/50 mb-8 uppercase tracking-widest">
                            {item.subtitle}
                        </h4>
                        <p className="anim-text text-lg text-neutral-content/60 max-w-md leading-relaxed">
                            {item.desc}
                        </p>
                    </div>
                ))}
             </div>
        </div>

      </section>

       {/* 
        ================================================================
        CTA SECTION
        ================================================================
      */}
       <section className="h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden bg-primary">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 via-primary to-primary"></div>
            
            <div className="relative z-10">
                <h2 className="text-5xl md:text-8xl font-black uppercase mb-12 tracking-tighter opacity-90 scale-y-125 text-base-content">
                    Elevate
                </h2>
                
                <button className="group relative px-12 py-3 border border-base-content/20 bg-black/50 backdrop-blur-md overflow-hidden rounded-full transition-all duration-300 hover:border-base-content/50 hover:shadow-xl">
                    <span className="relative z-10 text-xl font-bold tracking-[0.3em] group-hover:text-primary transition-colors duration-300 text-base-content">
                        PRE-ORDER
                    </span>
                    <div className="absolute inset-0 bg-base-content transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                </button>
            </div>
       </section>
    </div>
  );
};

export default ProductDetailSection;
