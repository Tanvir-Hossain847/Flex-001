"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

const colorMap = {
  OBSIDIAN: "#050509",
  PACIFIC: "#0066FF",
  EMBER: "#C3110C",
  ARCTIC: "#F5F5F7",
};

export default function Hero() {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const bgTextRef = useRef(null);
  const containerRef = useRef(null);

  const [thermos, setThermos] = useState([]);
  const [index, setIndex] = useState(0);
  const isAnimatingRef = useRef(false);
  const indexRef = useRef(0);
  indexRef.current = index;

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/thermos");
        const data = await response.json();

        const formattedData = data.map((item) => ({
          ...item,
          color: colorMap[item.color] || "#000000",
          text: item.description,
          highlight: item.highlight.join(" • "),
        }));

        setThermos(formattedData);
      } catch (error) {
        console.error("Error fetching thermos:", error);
      }
    };
    fetchData();
  }, []);

  const active = thermos[index];
  const isWhite = active?.color === "#F5F5F7";
  const isRed = active?.color === "#C3110C";
  const textColor = isWhite ? "text-gray-900" : "text-white";
  const borderColor = isWhite ? "border-gray-900/10" : "border-white/10";

  // Navigation Logic
  const go = (direction) => {
    if (isAnimatingRef.current || thermos.length === 0) return;
    const next =
      direction === "next"
        ? (indexRef.current + 1) % thermos.length
        : (indexRef.current - 1 + thermos.length) % thermos.length;
    changeSlide(next);
  };

  const goToIndex = (i) => {
    if (i === indexRef.current || isAnimatingRef.current) return;
    changeSlide(i);
  };

  // Auto-swap every 5 seconds
  useEffect(() => {
    if (thermos.length === 0) return;
    const interval = setInterval(() => {
      if (!isAnimatingRef.current) {
        go("next");
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [index, thermos.length]);

  const changeSlide = (nextIndex) => {
    isAnimatingRef.current = true;
    setIndex(nextIndex);

    // Animate transition
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        startFloatAnimation();
      },
    });

    // Image Animation
    tl.fromTo(
      imageRef.current,
      { opacity: 0, scale: 0.8, y: 50, rotation: -5 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        duration: 0.8,
        ease: "power3.out",
      }
    ).fromTo(
      textRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
      "-=0.6"
    );
  };

  const startFloatAnimation = () => {
    if (!imageRef.current) return;
    gsap.killTweensOf(imageRef.current);
    gsap.to(imageRef.current, {
      y: -20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.8,
    });
  };

  // Initial Entrance Animation
  useEffect(() => {
    if (thermos.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set([bgTextRef.current, containerRef.current], { opacity: 0 });
      gsap.set(imageRef.current, { opacity: 0, scale: 0.8, y: 50 });
      if (textRef.current) {
        gsap.set(textRef.current.children, { opacity: 0, y: 20 });
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(containerRef.current, { opacity: 1, duration: 0.5 })
        .to(bgTextRef.current, { opacity: 1, scale: 1, duration: 1 }, "-=0.2")
        .to(
          imageRef.current,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            onComplete: startFloatAnimation,
          },
          "-=0.5"
        )
        .to(
          textRef.current.children,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
          },
          "-=0.6"
        );
    }, heroRef);

    return () => ctx.revert();
  }, [thermos.length]);

  // Parallax Effect on Mouse Move
  const handleMouseMove = (e) => {
    if (!bgTextRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;

    gsap.to(bgTextRef.current, {
      x: x * 2,
      y: y * 2,
      duration: 1,
      ease: "power2.out",
    });
  };

  if (thermos.length === 0) {
    return null; // Let the global loader handle the empty state initially
  }

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full z-0  min-h-[85vh] md:min-h-[75vh] flex flex-col items-center justify-center overflow-hidden  shadow-2xl transition-colors duration-700 ease-in-out border py-5 ${borderColor}  `}
      style={{
        background: `radial-gradient(circle at center, ${active.color}dd 0%, ${active.color} 40%, #000000 100%)`,
      }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        {/* Background Elements */}
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px] opacity-30 animate-pulse ${
            isWhite ? "bg-gray-400" : "bg-white mix-blend-overlay"
          }`}
        ></div>
        <div
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[80px] opacity-20 animate-pulse delay-1000 ${
            isWhite ? "bg-gray-300" : "bg-white mix-blend-overlay"
          }`}
        ></div>
      </div>

      {/* Big Background Text */}
      <h1
        ref={bgTextRef}
        className={`absolute top-1/5 left-1/3 -translate-x-1/2 -translate-y-1/2 text-[18vw] leading-none font-black tracking-widest select-none pointer-events-none transition-colors duration-500 whitespace-nowrap ${
          isWhite ? "text-black/10" : isRed ? "text-white/20" : "text-white/10"
        }`}
      >
        FLEX
      </h1>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full h-full px-6 md:px-16 py-12 md:py-0">
        {/* Left: Image Section */}
        <div className="flex flex-col items-center justify-center relative h-[80vh] md:h-auto">
          <Image
            ref={imageRef}
            src={active.image}
            alt={active.name}
            width={500}
            height={500}
            className="w-auto h-[60%] md:h-200 max-h-[500px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] z-20"
          />

          {/* Navigation Controls */}
          <div className="flex items-center gap-6 mt-3 md:mt-0 backdrop-blur-md bg-white/10 p-2 rounded-full border border-white/10 shadow-lg">
            <button
              onClick={() => go("prev")}
              className="p-3 hover:bg-white/20 rounded-full transition-colors active:scale-95 text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex gap-2 mx-2">
              {thermos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === index ? "bg-white w-6" : "bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => go("next")}
              className="p-3 hover:bg-white/20 rounded-full transition-colors active:scale-95 text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right: Description Section */}
        <div
          className={`flex flex-col justify-center items-start md:items-start ${textColor}`}
        >
          <div
            ref={textRef}
            className={`w-full max-w-lg p-8 md:p-10 rounded-3xl backdrop-blur-md shadow-2xl border transition-colors duration-500 overflow-hidden relative ${
              isWhite ? "bg-white/40 border-white/50" : "bg-black/20 border-white/10"
            }`}
          >
            {/* Decorative element inside card */}
            <div className="absolute top-0 right-0 p-6 opacity-20">
              <svg
                className="w-16 h-16"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>

            <p className="text-sm font-bold tracking-[0.2em] uppercase mb-2 opacity-70">
              {active.name.replace("Flex ", "")} Edition
            </p>
            <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tight leading-none">
              {active.name}
            </h2>
            <p className="text-lg font-medium opacity-90 mb-6 italic">
              {active.tagline}
            </p>

            <div className="h-px w-20 bg-current opacity-30 mb-6"></div>

            <p className="text-base md:text-lg opacity-85 leading-relaxed mb-8">
              {active.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
