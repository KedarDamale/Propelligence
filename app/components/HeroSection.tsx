"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const HeroSection = () => {
  return (
      <section className="py-12 md:py-20 md:pb-8 bg-gradient-to-br from-[#ee800227] to-[#01ff5a49] pt-28 md:pt-32">
        <div className="container mx-auto max-w-6xl px-6 py-8 pb-0 md:pb-0">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up text-center">
              <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl font-bold text-gray-900 leading-tight hero-title">
                Mitigate financial risks with<br />
                <span className="text-5xl sm:text-6xl md:text-6xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#022d58] to-[#003c96] relative inline-block mt-2 pb-2 text-center hero-title">
                  Propelligence
                  <span className="block text-xl sm:text-2xl md:text-2xl lg:text-2xl text-black font-bold mt-1 tracking-wide text-center hero-title">Advisors Private Limited</span>
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mx-auto md:mx-0 max-w-md md:max-w-none">
                Expert financial risk management solutions tailored for modern
                businesses. Transform uncertainty into strategic advantage with
                our proven methodologies.
              </p>
              
              {/* Button - visible on mobile, hidden on desktop */}
              <div className="md:hidden flex justify-center w-full">
                <button
                  className="group bg-gradient-to-r from-[#022d58] to-[#003c96] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2 hero-title"
                  style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}
                  onClick={() => {
                    const el = document.getElementById('services');
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
                >
                  <span style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}>Explore Our Services</span>
                  <ArrowRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={20}
                  />
                </button>
              </div>
            </div>
            {/* Hero Illustration */}
            <div className="relative flex justify-center md:justify-end items-center md:items-end m-0 p-0 drop-shadow-2xl md:-mt-32" style={{padding: 0, margin: 0}}>
              <Image
                src="./accountent.svg"
                alt="Accountant Illustration"
                width={400}
                height={384}
                className="object-contain drop-shadow-2xl md:w-[430px] md:h-[430px]"
                priority
                draggable={false}
                style={{padding: 0, margin: 0, maxWidth: '100%', height: 'auto'}}
              />
            </div>
          </div>
          {/* Button - hidden on mobile, visible on desktop */}
          <div className="hidden md:flex justify-center w-full mb-6 mt-4">
            <button
              className="group bg-gradient-to-r from-[#022d58] to-[#003c96] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2 hero-title"
              style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}
              onClick={() => {
                const el = document.getElementById('services');
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
            >
              <span style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}>Explore Our Services</span>
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </button>
          </div>
        </div>
      </section>
      
  );
};

export default HeroSection;
