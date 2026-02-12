"use client";

import Link from "next/link";
import Image from "next/image";
import { FaTwitter, FaInstagram, FaLinkedinIn, FaTiktok } from "react-icons/fa";
import { HiArrowLongRight } from "react-icons/hi2";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Flex Black", href: "/products/black" },
      { label: "Flex Blue", href: "/products/blue" },
      { label: "Flex Red", href: "/products/red" },
      { label: "Flex White", href: "/products/white" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/story" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "Warranty", href: "/warranty" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

const socialLinks = [
  { icon: FaTwitter, href: "https://twitter.com" },
  { icon: FaInstagram, href: "https://instagram.com" },
  { icon: FaLinkedinIn, href: "https://linkedin.com" },
  { icon: FaTiktok, href: "https://tiktok.com" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white py-20 border-t border-white/10 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/5 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-20">
          
          {/* Brand & Newsletter Column */}
          <div className="md:col-span-5 space-y-8">
            <Link href="/" className="inline-block">
               <Image
                  src="https://res.cloudinary.com/do3iu9q7d/image/upload/v1770826040/transperent_logo_fskhub.png"
                  alt="Flex Logo"
                  width={80}
                  height={80}
                  className="w-20 active:scale-95 transition-transform duration-200"
                />
            </Link>
            <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
              Engineered for the relentless. <br/>
              Hydration evolved.
            </p>
            
            <div className="pt-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Subscribe to the drop</h4>
              <div className="flex items-center border-b border-white/20 pb-2 max-w-sm group focus-within:border-secondary transition-colors duration-300">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-transparent border-none outline-none text-white placeholder-white/30 w-full font-light"
                />
                <button className="text-white/50 group-focus-within:text-white hover:text-secondary transition-colors duration-300">
                  <HiArrowLongRight size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link 
                        href={link.href} 
                        className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-white/30 text-xs">
          <p>&copy; {new Date().getFullYear()} Flex Inc. All rights reserved.</p>
          
          <div className="flex items-center gap-6 my-4 md:my-0">
             <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
             <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
             <Link href="/cookies" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social, idx) => (
              <a 
                key={idx} 
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300"
              >
                <social.icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
