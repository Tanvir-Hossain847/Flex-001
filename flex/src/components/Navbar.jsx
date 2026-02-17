"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { BsXDiamond } from "react-icons/bs";
import { ShoppingBag, Shield } from "lucide-react";

gsap.registerPlugin(useGSAP);

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Support", href: "/support" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { user, userData, logout } = useAuth();
  const { cartCount } = useCart();
  const menuRef = useRef(null);
  const itemsRef = useRef([]);
  const iconRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  // Scroll-aware background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll(); // initial check
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const handleEnter = useCallback(() => {
    // Enlarge icon
    gsap.to(iconRef.current, { scale: 1.5, duration: 0.3, ease: "power3.out" });

    const radius = 90;
    const total = navLinks.length;

    gsap.killTweensOf(itemsRef.current);

    // Spread links over a larger arc to prevent overlap
    const arcSpread = Math.PI / 1; // wider arc for 4 items
    const startAngle = Math.PI / 2 - arcSpread / 2;

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
  }, []);

  const handleLeave = useCallback(() => {
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
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md shadow-xl shadow-secondary"
          : "bg-black"
      }`}
    >
      <nav className="max-w-7xl mx-auto py-4 px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label="Home">
          <div className="cursor-pointer transition-transform duration-200 hover:scale-105">
            <Image
              src="https://res.cloudinary.com/do3iu9q7d/image/upload/v1770826040/transperent_logo_fskhub.png"
              alt="Logo"
              width={60}
              height={60}
              priority
            />
          </div>
        </Link>

        {/* Center Arc Menu */}
        <div
          ref={menuRef}
          className="relative flex items-center justify-center w-100 pl-30 py-4"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          {/* Icon */}
          <div
            ref={iconRef}
            className="cursor-pointer z-10 will-change-transform"
            role="button"
            aria-label="Navigation menu"
            tabIndex={0}
            onFocus={handleEnter}
            onBlur={handleLeave}
          >
            <BsXDiamond
              size={25}
              className="text-white transition-colors duration-200"
            />
          </div>

          {/* Arc Links */}
          <ul className="absolute list-none p-0 m-0">
            {navLinks.map((link, index) => (
              <li
                key={link.label}
                ref={(el) => (itemsRef.current[index] = el)}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
              >
                <Link
                  href={link.href}
                  className="px-4 py-2 bg-white shadow-lg rounded-full text-sm text-black font-medium hover:bg-secondary hover:text-white hover:scale-110 hover:shadow-[0_0_20px_rgba(255,11,85,0.4)] transition-all duration-200 inline-block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          {/* Cart Icon - Always visible */}
          {/* Cart Icon - Visible to everyone EXCEPT admin */ }
          {userData?.role !== "admin" && (
            <Link href="/dashboard/cart" className="relative group">
              <ShoppingBag size={22} className="text-white group-hover:text-secondary transition-colors duration-200" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,11,85,0.5)] animate-in zoom-in duration-300">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Admin Panel Icon - Admin only */}
          {userData?.role === "admin" && (
            <Link href="/admin" className="relative group" title="Admin Panel">
              <Shield size={22} className="text-amber-400 group-hover:text-amber-300 transition-colors duration-200" />
            </Link>
          )}

          {!user ? (
            <>
              <Link
                href="/login"
                className="text-white px-4 py-2 text-sm font-medium hover:text-secondary transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="bg-secondary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#FF0B55] hover:shadow-[0_0_20px_rgba(255,11,85,0.3)] active:scale-95 transition-all duration-200"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-white text-sm font-medium">
                  {user.displayName || user.email}
                </p>
              </div>
              {user.photoURL && (
                <Link href={userData?.role === "admin" ? "/admin" : "/dashboard"}>
                  {" "}
                  <div className="avatar">
                    <div className={`w-10 rounded-full ring ring-offset-base-100 ring-offset-2 ${userData?.role === "admin" ? "ring-amber-400" : "ring-secondary"}`}>
                      <img src={user.photoURL} alt="avatar" />
                    </div>
                  </div>{" "}
                </Link>
              )}
              <button
                onClick={() => logout()}
                className="text-white px-4 py-2 text-sm font-medium hover:text-secondary transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
