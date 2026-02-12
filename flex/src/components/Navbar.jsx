"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { BsXDiamond } from "react-icons/bs";

gsap.registerPlugin(useGSAP);

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Support", href: "/support" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const menuRef = useRef(null);
  const itemsRef = useRef([]);
  const iconRef = useRef(null);

  useGSAP(
    () => {
      gsap.set(itemsRef.current, {
        opacity: 0,
        x: 0,
        y: 30,
        scale: 0.8,
      });
    },
    { scope: menuRef }
  );

  const handleEnter = () => {
    // Enlarge icon
    gsap.to(iconRef.current, { scale: 1.5, duration: 0.3, ease: "power3.out" });

    const radius = 90; 
    const total = navLinks.length;

    gsap.killTweensOf(itemsRef.current);

    // Spread links over a larger arc to prevent overlap
    const arcSpread = Math.PI / 1.5; // 90 degrees
    const startAngle = Math.PI / 2 - arcSpread / 2; // center arc above icon

    itemsRef.current.forEach((el, index) => {
      const angle = startAngle + (index / (total - 1)) * arcSpread;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius; 

      gsap.to(el, {
        x,
        y,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  };

  const handleLeave = () => {
    // Shrink icon back
    gsap.to(iconRef.current, { scale: 1, duration: 0.3, ease: "power3.inOut" });

    gsap.killTweensOf(itemsRef.current);
    gsap.to(itemsRef.current, {
      x: 0,
      y: 30,
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: "power3.inOut",
      overwrite: "auto",
    });
  };

  return (
    <header className="w-full bg-black shadow-xl shadow-secondary">
      <nav className="max-w-11/12 mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="cursor-pointer">
            <Image
              src="https://res.cloudinary.com/do3iu9q7d/image/upload/v1770826040/transperent_logo_fskhub.png"
              alt="Logo"
              width={60}
              height={60}
            />
          </div>
        </Link>

        {/* Center Arc Menu */}
        <div
          ref={menuRef}
          className="relative flex items-center justify-center w-100"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          {/* Icon */}
          <div ref={iconRef} className="cursor-pointer z-10">
            <BsXDiamond size={25} className="text-white" />
          </div>

          {/* Arc Links */}
          <ul className="absolute list-none p-0 m-0">
            {navLinks.map((link, index) => (
              <li
                key={link.label}
                ref={(el) => (itemsRef.current[index] = el)}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <Link
                  href={link.href}
                  className="px-4 py-2 bg-white shadow-lg rounded-full text-sm text-black font-medium hover:bg-[#FF0B55] hover:text-white transition"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <Link
          href="/signup"
          className="bg-[#CF0F47] text-white px-6 py-2 rounded-lg hover:bg-[#FF0B55] transition"
        >
          Start Now
        </Link>
      </nav>
    </header>
  );
}
