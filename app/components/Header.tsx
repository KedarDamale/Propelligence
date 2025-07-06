"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  const navItems = ['Services', 'Our Work', 'Testimonials', 'About Us', 'Contact'];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isMenuOpen ? 'bg-white' : (scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent')}`}>
      <nav className="container mx-auto px-2 sm:px-6 py-2 min-h-0">
        <div className="flex justify-between items-center min-h-0">
          {/* Logo */}
          <div className="flex items-center space-x-4 ml-[0px] group">
            <Link href="/">
              <span className="flex items-start pt-4 cursor-pointer">
                <Image src="/Company-logo-svg.svg" alt="Propelligence Logo" width={70} height={70} className="w-20 h-20 rounded-xl object-contain mt-[-12px]" priority />
              </span>
            </Link>
            <div className="flex flex-col justify-center h-full ml-[-20px] mt-[12px]">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight  mb-0">Propelligence</h1>
              <p className="text-sm font-bold text-gray-900 mt-0">Advisors Private Limited</p>
            </div>
          </div>
          {/* Navigation - always hamburger, always dropdown style */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg transition-colors group">
            {isMenuOpen ? <X size={35} /> : <Menu size={35} />}
          </button>
        </div>
        {/* Dropdown Menu - always visible on all screen sizes when open */}
        <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute top-full left-0 w-full bg-white shadow-2xl z-50 rounded-b-[3.4rem] border-b-2 border-[#022d58] backdrop-blur-sm"
          >
            <div className="py-6 px-8 space-y-4 flex flex-col items-end">
              {navItems.map((item, idx) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="block text-[#000e1b] transition-all duration-300 font-bold text-right w-full rounded-lg px-4 py-2 shadow-sm text-lg border border-black hover:scale-101 hover:shadow-lg focus:scale-105 focus:shadow-lg focus:outline-none"
                  onClick={e => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    const el = document.getElementById(item.toLowerCase().replace(' ', '-'));
                    if (el) {
                      const rect = el.getBoundingClientRect();
                      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                      const elementTop = rect.top + scrollTop;
                      const viewportHeight = window.innerHeight;
                      // Scroll so the top of the section is a little above the middle of the viewport
                      const offset = viewportHeight * 0.3; // 30% from the top
                      const scrollTo = elementTop - offset;
                      window.scrollTo({ top: scrollTo, behavior: 'smooth' });
                    }
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    delay: isMenuOpen
                      ? 0.12 + 0.08 * idx // opening: staggered down
                      : 0.12 + 0.08 * (navItems.length - idx - 1), // closing: staggered up
                    duration: 0.32,
                    ease: "easeOut"
                  }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
