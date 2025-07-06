"use client";
import React, { useEffect, useState } from "react";
import { ArrowRight, ChevronDown } from 'lucide-react';

interface Service {
  _id?: string;
  title: string;
  short_desc: string;
  long_desc: string;
  pdfUrl?: string;
}

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    async function fetchServices() {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
    }
    fetchServices();
  }, []);

  return (
    <section id="services" className=" bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-[#022d58] mb-2">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive financial risk management solutions designed to protect and grow your business.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {services.slice(0, visibleCount).map((service, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={service._id || index}
                tabIndex={0}
                role="button"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') setExpandedIndex(isExpanded ? null : index); }}
                className={`group relative p-4 rounded-3xl bg-white border-2 border-black shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 flex flex-col items-center justify-center overflow-hidden no-underline cursor-pointer ${isExpanded ? 'scale-105 border-4' : ''}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="flex flex-col items-center pt-1 pb-1 px-1 w-full">
                  <h3 className="text-2xl font-extrabold md:font-semibold text-[#022d58] mb-2 text-center tracking-tight drop-shadow-sm">
                    {service.title}
                  </h3>
                  <p className={`text-lg font-semibold leading-relaxed mb-2 text-center transition-colors duration-300 ${isExpanded ? 'text-black font-extrabold' : 'text-gray-700'}`}>
                    {service.short_desc}
                  </p>
                  <div
                    className={`expandable-content w-full overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col items-center ${isExpanded ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}
                  >
                    <div className="w-full flex justify-center">
                      <hr className="w-3/4 border-t-2 border-black my-2 transition-all duration-500" />
                    </div>
                    <div className="flex justify-center w-full">
                      <p className="text-gray-800 text-base font-normal leading-relaxed text-center transition-all duration-500 whitespace-pre-line break-words max-w-xl mx-auto">
                        {typeof service.long_desc === 'string' && service.long_desc.split('\n').map((line, idx) => (
                          <span key={idx}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </p>
                    </div>
                    {/* New horizontal line between long desc and download button */}
                    <div className="w-full flex justify-center">
                      <hr className="w-3/4 border-t-2 border-black my-2 transition-all duration-500" />
                    </div>
                    {isExpanded && service.pdfUrl && (
                      <a
                        href={service.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 bg-[#022d58] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#003c96] transition-colors duration-300 flex items-center space-x-2"
                        onClick={e => e.stopPropagation()}
                        style={{ textDecoration: 'none' }}
                      >
                        <ArrowRight size={18} className="mr-2" />
                        View Broucher
                      </a>
                    )}
                    {isExpanded && !service.pdfUrl && (
                      <button
                        className="mt-4 bg-gray-400 text-white px-4 py-2 rounded-full font-semibold cursor-not-allowed flex items-center space-x-2"
                        onClick={e => e.stopPropagation()}
                        disabled
                      >
                        <ArrowRight size={18} className="mr-2" />
                        No Broucher
                      </button>
                    )}
                  </div>
                </div>
                {/* Expand Arrow Icon */}
                <span className="absolute bottom-3 right-3">
                  <ChevronDown
                    size={28}
                    className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-black' : 'text-black'}`}
                  />
                </span>
              </div>
            );
          })}
        </div>
        {visibleCount < services.length && (
          <div className="text-center mb-8">
            <button
              className="bg-[#022d58] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#003c96] transition-colors duration-300"
              onClick={() => setVisibleCount(count => Math.min(count + 3, services.length))}
            >
              Load More Services
            </button>
          </div>
        )}
        {visibleCount >= services.length && services.length > 2 && (
          <div className="text-center mb-8">
            <button
              className="bg-[#022d58] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#003c96] transition-colors duration-300"
              onClick={() => {
                setVisibleCount(3);
                setExpandedIndex(null);
                setTimeout(() => {
                  const firstService = document.querySelector('[role="button"]');
                  if (firstService) {
                    firstService.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 100);
              }}
            >
              Collapse Service Section
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;


