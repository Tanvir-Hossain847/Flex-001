"use client";

import React, { useRef } from "react";
import { FaStar, FaStarHalfAlt, FaCheckCircle, FaQuoteLeft, FaUserCircle } from "react-icons/fa";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reviews = [
  {
    name: "Marcus T.",
    location: "Brooklyn, NY",
    rating: 5,
    date: "Jan 28, 2026",
    variant: "Flex Black",
    title: "Best bottle I've ever owned",
    text: "I've tried every premium bottle on the market. The Flex Black keeps my coffee hot through an entire 12-hour shift. The SureGrip coat is no joke — dropped it twice, zero scratches.",
    verified: true,
  },
  {
    name: "Aisha R.",
    location: "Toronto, CA",
    rating: 5,
    date: "Feb 3, 2026",
    variant: "Flex Blue",
    title: "Gym essential. Period.",
    text: "The electrolyte-friendly design is something I didn't know I needed. No weird metallic taste like my old bottle. My water actually tastes clean. Worth every penny.",
    verified: true,
  },
  {
    name: "Javier M.",
    location: "Austin, TX",
    rating: 4.5,
    date: "Jan 15, 2026",
    variant: "Flex Red",
    title: "Looks insane, performs better",
    text: "Got this for my daily runs and it's been a game changer. Ice water stays ice cold for the entire day in Texas heat. The red colorway gets compliments everywhere I go.",
    verified: true,
  },
  {
    name: "Priya K.",
    location: "London, UK",
    rating: 5,
    date: "Feb 8, 2026",
    variant: "Flex White",
    title: "Minimalist perfection",
    text: "Clean design, incredible build quality. I carry it to meetings and it looks as premium as anything on the table. Three months in and it still looks brand new.",
    verified: true,
  },
  {
    name: "Daniel W.",
    location: "Melbourne, AU",
    rating: 5,
    date: "Jan 22, 2026",
    variant: "Flex Black",
    title: "Replaced all my other bottles",
    text: "I bought one for myself and ended up getting three more for my family. The vacuum insulation is unreal — put ice in at 6am, still there at midnight. Not an exaggeration.",
    verified: true,
  },
];

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<FaStar key={i} className="text-amber-400" />);
    } else if (i - 0.5 === rating) {
      stars.push(<FaStarHalfAlt key={i} className="text-amber-400" />);
    } else {
      stars.push(<FaStar key={i} className="text-white/10" />);
    }
  }
  return <div className="flex gap-0.5">{stars}</div>;
};

export default function ReviewsSection() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Heading Animation
    gsap.from(".reviews-heading", {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: ".reviews-section",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    // Cards Animation
    gsap.from(".review-card", {
      y: 60,
      opacity: 0,
      duration: 0.8,
      
      scrollTrigger: {
        trigger: ".reviews-grid",
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }, { scope: containerRef });

  // Compute average rating
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div ref={containerRef} className="bg-primary text-base-content font-sans overflow-hidden relative z-10 w-full">
      <section className="reviews-section relative py-32 max-w-7xl mx-auto border-t border-white/10 px-6 md:px-20">

        {/* Section Header */}
        <div className="reviews-heading mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-secondary font-mono text-xl">06</span>
            <div className="h-px w-12 bg-white/20"></div>
            <span className="text-sm uppercase tracking-widest text-white/50">Reviews</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <h2 className="text-4xl md:text-6xl font-extralight leading-tight text-white max-w-2xl">
              Trusted by the <br />
              <span className="text-secondary italic font-medium">relentless</span>.
            </h2>

            {/* Aggregate rating */}
            <div className="flex items-center gap-6 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 backdrop-blur-sm">
              <div className="text-center">
                <span className="text-4xl font-bold text-white block leading-none mb-1">{avgRating}</span>
                <span className="text-white/30 text-xs uppercase tracking-widest">Average</span>
              </div>
              <div className="h-10 w-px bg-white/10"></div>
              <div>
                <StarRating rating={parseFloat(avgRating)} />
                <p className="text-xs text-white/40 mt-2 font-mono">{reviews.length} VERIFIED REVIEWS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="reviews-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className={`review-card group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-8 hover:border-secondary/40 transition-all duration-500 flex flex-col ${
                 // Center the last 2 items on large screens if we have 5 items
                 index >= 3 ? "lg:col-span-1" : ""
              }`}
              // Inline style for larger screens to center the bottom row if desired, 
              // or just keep them in grid. Let's keep strict grid for reliability.
            >
               {/* Hover Glow Effect */}
               <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              {/* Top Row: User Icon & Rating */}
              <div className="relative z-10 flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                        <FaUserCircle size={20} />
                    </div>
                    <div>
                         <p className="text-sm font-bold text-white leading-tight">{review.name}</p>
                         <p className="text-[10px] uppercase tracking-wider text-white/40">{review.location}</p>
                    </div>
                </div>
                <div className="bg-black/40 rounded-full px-3 py-1 border border-white/5">
                    <StarRating rating={review.rating} />
                </div>
              </div>

              {/* Quote Icon Background */}
              <FaQuoteLeft className="absolute top-8 right-8 text-6xl text-white/[0.02] group-hover:text-secondary/10 transition-colors duration-500 pointer-events-none" />

              {/* Title */}
              <h3 className="relative z-10 text-lg font-bold text-white mb-3 leading-snug group-hover:text-secondary transition-colors duration-300">
                "{review.title}"
              </h3>

              {/* Body */}
              <p className="relative z-10 text-sm text-gray-400 leading-relaxed mb-8 flex-grow">
                {review.text}
              </p>

              {/* Footer: Variant & Badge */}
              <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    <span className="text-xs text-white/50 font-medium">{review.variant}</span>
                </div>
                
                {review.verified && (
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <FaCheckCircle className="text-xs" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Verified Buyer</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Centering logic for bottom row (optional polish) */}
        <div className="hidden lg:block mt-6"></div> 

      </section>
    </div>
  );
}
