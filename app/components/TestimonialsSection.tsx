"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  _id?: string;
  name: string;
  role: string;
  star: number;
  testimonial: string;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchTestimonials() {
      const res = await fetch('/api/public/testimonials');
      const data = await res.json();
      setTestimonials(data);
    }
    fetchTestimonials();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (testimonials.length > 0 ? (prev + 1) % testimonials.length : 0));
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, testimonials.length]);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="p0-8 pb-0 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-[#022d58] mb-2 drop-shadow-sm">What Our Clients Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-0">
            Trusted by leading financial institutions and businesses worldwide.
          </p>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div
            className={
              'group relative p-4 rounded-3xl bg-white border-2 border-black shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 flex flex-col items-center justify-center overflow-hidden min-h-[340px] max-w-2xl mx-auto'
            }
            style={{ textDecoration: 'none' }}
          >
            <div className="flex flex-col items-center pt-1 pb-1 px-1 w-full">
              <div className="mb-4 text-center">
                <p className="text-xl font-bold text-[#022d58]">{testimonials[currentSlide].name}</p>
                <p className="text-gray-600">{testimonials[currentSlide].role}</p>
              </div>
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentSlide].star)].map((_, i) => (
                  <Star
                    key={i}
                    className="fill-current text-yellow-400 stroke-black"
                    size={20}
                  />
                ))}
              </div>
              <blockquote className="text-2xl text-black font-medium mb-6 leading-relaxed text-center">
                &quot;{testimonials[currentSlide].testimonial}&quot;
              </blockquote>
            </div>
          </div>
          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors border border-black ${
                  index === currentSlide
                    ? 'bg-gradient-to-br from-[#ee8002] to-[#01ff5a]'
                    : 'bg-gray-300'
                }`}
                style={index === currentSlide ? { backgroundImage: 'linear-gradient(135deg, #ee8002 0%, #01ff5a 100%)' } : {}}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
