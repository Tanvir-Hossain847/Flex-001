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
  { label: "Contact", href: "/contact" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Home", href: "/" },
];

export default function Navbar() {
  const { user, userData, logout } = useAuth();
  const { cartCount } = useCart();
  const menuRef = useRef(null);
  const itemsRef = useRef([]);
  const iconRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const radius = 140;
    const total = navLinks.length;

    gsap.killTweensOf(itemsRef.current);

    // Spread links over a larger arc to prevent overlap
    const arcSpread = Math.PI * 0.5; // Tighter arc (approx 90 deg) for better centering
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
          <div className="cursor-pointer transition-transform duration-200 hover:scale-105 z-50 relative">
            <Image
              src="https://res.cloudinary.com/do3iu9q7d/image/upload/v1770826040/transperent_logo_fskhub.png"
              alt="Logo"
              width={60}
              height={60}
              priority
            />
          </div>
        </Link>

        {/* Desktop Menu (GSAP Arc) - Hidden on Mobile */}
        <div
          ref={menuRef}
          className="relative hidden md:flex items-center justify-center w-100 pl-30 py-4"
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

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-4 z-50 relative">
          {/* Cart Icon */}
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

          {/* Admin Panel Icon */}
          {userData?.role === "admin" && (
            <Link href="/admin" className="relative group" title="Admin Panel">
              <Shield size={22} className="text-amber-400 group-hover:text-amber-300 transition-colors duration-200" />
            </Link>
          )}

          {/* Authentication Links (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
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
                <div className="text-right">
                  <p className="text-white text-sm font-medium">
                    {user.displayName || user.email}
                  </p>
                </div>
                {user.photoURL && (
                  <Link href={userData?.role === "admin" ? "/admin" : "/dashboard"}>
                    <div className="avatar">
                      <div className={`w-10 rounded-full ring ring-offset-base-100 ring-offset-2 ${userData?.role === "admin" ? "ring-amber-400" : "ring-secondary"}`}>
                        <img src={user.photoURL} alt="avatar" />
                      </div>
                    </div>
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

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <BsXDiamond size={24} /> : <div className="space-y-1.5">
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-4 h-0.5 bg-white ml-auto"></span>
            </div>}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center animate-in fade-in duration-200 md:hidden">
            <nav className="flex flex-col items-center gap-8 text-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-bold text-white hover:text-secondary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px w-10 bg-white/10 my-4" />
              {!user ? (
                <div className="flex flex-col gap-4">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-xl text-white">Log In</Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-xl text-secondary font-bold">Register</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                   <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-xl text-white">Dashboard</Link>
                   <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-xl text-red-500">Logout</button>
                </div>
              )}
            </nav>
          </div>
        )}
      </nav>
    </header>
  );
}
