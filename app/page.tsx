"use client";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import OurWorkSection from "./components/OurWorkSection";
import TestimonialsSection from "./components/TestimonialsSection";
import AboutUsSection from "./components/AboutUsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <div className="my-12" />
      <div className="my-12" />
      <ServicesSection />
      <div className="my-12" />
      <hr className="border-t-2 border-[#001f3f] w-[70%] mx-auto" />
      <div className="my-12" />
      <OurWorkSection />
      <div className="my-12" />
      <hr className="border-t-2 border-[#001f3f] w-[70%] mx-auto" />
      <div className="my-12" />
      <TestimonialsSection />
      <div className="my-12" />
      <hr className="border-t-2 border-[#001f3f] w-[70%] mx-auto" />
      <div className="my-12" />
      <AboutUsSection />
      <div className="my-12" />
      <hr className="border-t-2 border-[#001f3f] w-[70%] mx-auto" />
      <div className="my-12" />
      <ContactSection />
      <div className="my-12" />
      <Footer />
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out 0.2s both;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite 1.5s;
        }
      `}</style>
    </div>
  );
};

export default App;