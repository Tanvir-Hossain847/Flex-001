"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import FeatureGrid from "./FeatureGrid";

export default function AboutUs() {
  const container = useRef(null);

  useGSAP(
    () => {
      // HERO BIG IMPACT
      gsap.from(".street-title", {
        y: 150,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });

      // STATS POP IN
      gsap.from(".stat", {
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 80%",
        },
        scale: 0.5,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      });
    },
    { scope: container },
  );

  // MAGNETIC HOVER EFFECT
  const handleMove = (e, el) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 1.5;
    const y = e.clientY - rect.top - rect.height / 1.5;

    gsap.to(el, {
      x: x * 0.1,
      y: y * 0.1,
      duration: 0.3,
    });
  };

  const resetMove = (el) => {
    gsap.to(el, { x: 0, y: 0, duration: 0.5 });
  };

  const images = [
    "image_1_ircwqt.jpg",
    "image2_kjzqa6.jpg",
    "image3_mmczl1.jpg",
    "image4_b3zxl9.jpg",
    "image5_guepg7.jpg",
    "image6_pao3qx.jpg",
  ];

  return (
    <div ref={container} className="bg-black text-white overflow-hidden">
      {/* HERO STREET SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-6 text-center overflow-hidden">
        {/* Optional background image */}
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882423/Transparent-Model_z7lplb.png"
            alt="Flex Flask Hero"
            fill
            className="object-cover brightness-50"
          />
        </div>

        {/* Floating gradient shapes (optional) */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-red-600 opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>

        {/* Text content */}
        <div className="relative z-10 space-y-6">
          <h1 className="street-title text-[8vw] md:text-[7vw] font-extrabold uppercase leading-tight tracking-tight">
            FLEX
            <br />
            FLASK
          </h1>
          <p className="text-lg md:text-xl text-gray-300 tracking-wider">
            Built Different. Engineered for the Streets, Gym, and Grind.
          </p>
          <div className="mt-8 flex justify-center gap-6">
            <button className="px-8 py-3 bg-red-600 text-white font-semibold uppercase rounded-full hover:bg-red-700 transition">
              Shop Now
            </button>
            <button className="px-8 py-3 border border-gray-400 text-gray-300 font-semibold uppercase rounded-full hover:bg-gray-800 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <FeatureGrid />

      {/* STREET INFO BLOCK */}
      <section className="py-32 px-6 md:px-20 bg-black border-t border-gray-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text */}
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-extrabold uppercase text-white leading-tight">
              No Plastic.
              <br />
              No Limits.
            </h2>
            <h3 className="text-xl md:text-2xl font-semibold text-red-500">
              Built for Life on the Go
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Flex Flask is engineered for the streets, the gym, and the grind.
              Double-wall insulation keeps your drinks ice cold for 24 hours and
              hot for 12. Stainless steel. Zero compromise. Built to last. Sleek
              design, durable build, and BPA-free materials — all in one.
            </p>
          </div>

          {/* Right Side - Image */}
          <div className="relative w-full h-80 md:h-[28rem] rounded-xl overflow-hidden">
            <Image
              src="https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882423/image6_pao3qx.jpg"
              alt="Flex Flask lifestyle"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-section py-32 bg-[#0d0d0d] text-center">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16">
          <div className="stat">
            <h3 className="text-5xl font-black text-red-500">24H</h3>
            <p className="mt-4 text-gray-400 uppercase tracking-widest">
              Cold Retention
            </p>
          </div>

          <div className="stat">
            <h3 className="text-5xl font-black text-red-500">12H</h3>
            <p className="mt-4 text-gray-400 uppercase tracking-widest">
              Heat Lock
            </p>
          </div>

          <div className="stat">
            <h3 className="text-5xl font-black text-red-500">100%</h3>
            <p className="mt-4 text-gray-400 uppercase tracking-widest">
              BPA Free Steel
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-40 bg-gradient-to-r from-black via-gray-900 to-black text-center overflow-hidden">
        {/* Optional floating shapes */}
        <div className="absolute -top-20 left-1/4 w-72 h-72 bg-red-500 opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl animate-pulse-slow"></div>

        {/* CTA Content */}
        <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-extrabold uppercase text-white leading-tight tracking-tight">
            Stay Cold.
            <br />
            Stay Bold.
          </h2>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
            Your perfect companion for every adventure. Sleek, durable, and
            engineered for life on the go.
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <button className="px-8 py-3 bg-red-600 text-white font-semibold uppercase rounded-full hover:bg-red-700 transition">
              Shop Now
            </button>
            <button className="px-8 py-3 border border-gray-400 text-gray-300 font-semibold uppercase rounded-full hover:bg-gray-800 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
