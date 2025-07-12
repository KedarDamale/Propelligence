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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const res = await fetch("/api/public/services");
        if (res.ok) {
          const data = await res.json();
          setServices(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to fetch services:', res.status);
          setServices([]);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // Ensure services is always an array
  const safeServices = Array.isArray(services) ? services : [];
  const visibleServices = safeServices.slice(0, visibleCount);

  if (loading) {
    return (
      <section id="services" className="bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#022d58] mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

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
          {visibleServices.map((service, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={service._id || index}
                tabIndex={0}
                role="button"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') setExpandedIndex(isExpanded ? null : index); }}
                className={`group relative p-4 rounded-3xl bg-white border-2 border-black shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 flex flex-col items-center justify-center overflow-hidden no-underline cursor-pointer glow-blue ${isExpanded ? 'scale-105 border-4' : ''}`}
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
                    className={`expandable-content w-full overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col items-center ${isExpanded ? 'max-h-[600px] opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}
                  >
                    <div className="w-full flex justify-center">
                      <hr className="w-3/4 border-t-2 border-black my-2 transition-all duration-500" />
                    </div>
                    {/* DEBUG: Show service object for troubleshooting */}
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
                    {/* Horizontal line between description and button */}
                    <div className="w-full flex justify-center">
                      <hr className="w-3/4 border-t-2 border-black my-2 transition-all duration-500" />
                    </div>
                    {service.pdfUrl ? (
                                              <a
                          href={service.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 bg-[#022d58] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#003c96] transition-colors duration-300 flex items-center space-x-2 hero-title"
                          onClick={e => e.stopPropagation()}
                          style={{ textDecoration: 'none', fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
                          title="View Service PDF"
                        >
                          <ArrowRight size={18} className="mr-2" />
                          <span style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}>View Service PDF</span>
                        </a>
                    ) : (
                      <button
                        className="mt-4 bg-gray-400 text-white px-4 py-2 rounded-full font-semibold flex items-center space-x-2 cursor-not-allowed opacity-70 hero-title"
                        style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}
                        onClick={e => e.stopPropagation()}
                        disabled
                        title="No PDF available for this service"
                      >
                        <ArrowRight size={18} className="mr-2" />
                        <span style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}>View Service PDF</span>
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
        {visibleCount < safeServices.length && (
          <div className="text-center mb-8">
            <button
              className="bg-[#022d58] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#003c96] transition-colors duration-300 hero-title"
              style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}
              onClick={() => setVisibleCount(count => Math.min(count + 3, safeServices.length))}
            >
              <span style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}>Load More Services</span>
            </button>
          </div>
        )}
        {visibleCount >= safeServices.length && safeServices.length > 2 && (
          <div className="text-center mb-8">
            <button
              className="bg-[#022d58] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#003c96] transition-colors duration-300 hero-title"
              style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}
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
              <span style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}>Collapse Service Section</span>
            </button>
          </div>
        )}
        

      </div>
    </section>
  );
};

export default ServicesSection;


