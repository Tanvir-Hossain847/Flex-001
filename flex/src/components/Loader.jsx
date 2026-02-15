"use client";

import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { gsap } from "gsap";

const Loader = forwardRef((props, ref) => {
  const container = useRef(null);
  const flRef = useRef(null);
  const exRef = useRef(null);
  const taglineRef = useRef(null);

  useImperativeHandle(ref, () => ({
    animateOut: () => {
      return gsap.to(container.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    },
  }));

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power4.out" },
    });

    gsap.set(flRef.current, { x: "-150%", opacity: 0 });
    gsap.set(exRef.current, { x: "150%", opacity: 0 });
    gsap.set(taglineRef.current, { y: 40, opacity: 0 });

    tl.to(flRef.current, {
      x: "0%",
      opacity: 1,
      duration: 1.2,
    })
      .to(
        exRef.current,
        {
          x: "0%",
          opacity: 1,
          duration: 1.2,
        },
        "-=1.1"
      )
      .to(
        [flRef.current, exRef.current],
        {
          scale: 1.1,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        },
        "-=0.2"
      )
      .to(
        taglineRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
        },
        "-=0.4"
      );
  }, []);

  return (
    <div
      ref={container}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute w-[450px] h-[450px] rounded-full bg-red-600 blur-[200px] opacity-20" />

      <div className="relative flex items-center text-7xl md:text-9xl font-black uppercase tracking-tight">
        <span ref={flRef} className="text-white">
          FL
        </span>
        <span ref={exRef} className="text-red-600">
          EX
        </span>
      </div>

      <p
        ref={taglineRef}
        className="mt-6 text-gray-400 uppercase tracking-[0.4em] text-xs md:text-sm font-mono"
      >
        flex your life
      </p>
    </div>
  );
});

Loader.displayName = "Loader";

export default Loader;
