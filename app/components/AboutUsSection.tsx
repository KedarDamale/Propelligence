"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { FaInstagram, FaXTwitter, FaLinkedin } from "react-icons/fa6";

const AboutUsSection = () => {
  const [expanded, setExpanded] = useState(false);
  const aboutText =
    "With over a decade of experience in financial risk management, Propelligence stands at the forefront of innovative risk solutions. We combine cutting-edge technology with deep industry expertise to help businesses navigate complex financial landscapes.";

  const experiance = 1;
  const client_served = 20;
  const assets_managed = 3;

  const board_members = [
    {
      imagepath: null,
      name: "Mandar Joshi",
      title: "Founder",
      desc: "lorem ipshum lorem ipshum lorem ipshum lorem ipshum lorem ipshum lorem ipshum lorem ipshum lorem ipshum lorem ipshum",
      insta_link: null,
      x_link: null,
      linkdin_link: null
    },
    {
      imagepath: "public\\board_members_photo\\kanchan.jpg",
      name: "Kanchan Damale",
      title: "Founder",
      desc: "lorem ipshumlorem ipshumlorem ipshumlorem ipshumlorem ipshumlorem ipshumlorem ipshumlorem ipshumlorem ipshumlorem ipshumlorem ipshum",
      insta_link: "https://www.instagram.com/phil_salt",
      x_link: null,
      linkdin_link: null
    }
  ];
  // Intersection Observer for triggering animation on scroll
  const statsRef = useRef<HTMLDivElement>(null);
  const [animateStats, setAnimateStats] = useState(false);
  useEffect(() => {
    const ref = statsRef.current;
    if (!ref) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateStats(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, []);

  // Animated counter hook
  function useCountUp(target: number, duration = 2200, start: boolean) {
    const [count, setCount] = React.useState(0);
    useEffect(() => {
      if (!start) return;
      let current = 0;
      const stepTime = Math.max(Math.floor(duration / target), 50); // slower animation
      const step = () => {
        current++;
        setCount(current);
        if (current < target) {
          setTimeout(step, stepTime);
        }
      };
      step();
    }, [target, duration, start]);
    return count;
  }

  // Animated values (only animate when in view)
  const animatedExperience = useCountUp(experiance, 2200, animateStats);
  const animatedClients = useCountUp(client_served, 2200, animateStats);
  const animatedAssets = useCountUp(assets_managed, 2200, animateStats);

  const words = aboutText.split(" ");
  const shortDesc =
    words.length > 20 ? words.slice(0, 20).join(" ") + "..." : aboutText;

  const [currentBoard, setCurrentBoard] = useState(0);
  const nextBoard = React.useCallback(() => {
    setCurrentBoard((prev) => (prev + 1) % board_members.length);
  }, [board_members.length]);
  useEffect(() => {
    const timer = setInterval(nextBoard, 5000);
    return () => clearInterval(timer);
  }, [nextBoard]);

  return (
    <section id="about-us" className="bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          {/* About Us Title */}
          <h2 className="text-4xl font-bold text-[#022d58] mb-2 drop-shadow-sm text-center w-full">
            About Us
          </h2>

          {/* Add padding between title and stats */}
          <div className="h-6" />

          {/* Animated Stats */}
          <div
            ref={statsRef}
            className="flex flex-col items-center mb-8 w-full text-center"
          >
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl md:text-3xl font-bold text-[#022d58]">
                {animatedExperience}+
              </span>
              <span className="text-base md:text-lg font-medium text-[#222] mt-1 text-center">
                Years Experience
              </span>
            </div>
            <div className="flex flex-col items-center justify-center mt-6">
              <span className="text-2xl md:text-3xl font-bold text-[#022d58]">
                {animatedClients}+
              </span>
              <span className="text-base md:text-lg font-medium text-[#222] mt-1 text-center">
                Clients Served
              </span>
            </div>
            <div className="flex flex-col items-center justify-center mt-6">
              <span className="text-3xl md:text-4xl font-bold text-[#022d58]">
                ₹{animatedAssets}Cr+
              </span>
              <span className="text-lg md:text-xl font-medium text-[#222] mt-1 text-center">
                Assets Managed
              </span>
            </div>
          </div>
          {/* Company Info */}
          <div
            tabIndex={0}
            role="button"
            onClick={() => setExpanded((e) => !e)}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") setExpanded((e) => !e);
            }}
            className={`group relative p-4 rounded-3xl border-2 border-black shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 flex flex-col items-center justify-center overflow-hidden no-underline cursor-pointer w-full max-w-2xl mx-auto glow-blue ${
              expanded
                ? "bg-gray-100 scale-105 border-4"
                : "bg-white"
            }`}
            style={{ textDecoration: "none" }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-[#022d58] mb-2 drop-shadow-sm text-center">
              About company
            </h3>
            <div
              className={`w-full flex flex-col items-center pt-1 pb-1 px-1 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                expanded
                  ? "max-h-96 opacity-100 mt-2"
                  : "max-h-20 opacity-100 mt-0"
              }`}
              style={{ overflow: "hidden" }}
            >
              {expanded ? (
                <p className="text-xl leading-relaxed mb-2 text-center transition-colors duration-300 text-black ">
                  {aboutText}
                </p>
              ) : (
                <p className="text-xl leading-relaxed mb-2 text-center transition-colors duration-300 text-gray-700">
                  {shortDesc}
                </p>
              )}
            </div>
            <span className="absolute bottom-3 right-3">
              <ChevronDown
                size={28}
                className={`transition-transform duration-300 ${
                  expanded ? "rotate-180 text-black" : "text-black"
                }`}
              />
            </span>
          </div>
          <div className="h-4" />
     
          {/* Founder/Board Members Section */}
          <div className="w-full flex flex-col items-center mt-4">
            <div className="text-center mb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-[#022d58] mb-2 drop-shadow-sm text-center">
                Our Board Members
              </h2>
            </div>
            <div className="relative max-w-2xl mx-auto w-full">
              <div className="group relative p-6 rounded-3xl bg-white border-2 border-black shadow-lg flex flex-col items-center justify-center overflow-hidden min-h-[340px] w-full max-w-full backdrop-blur-md glow-blue">
                {/* Image or Initial */}
                {board_members[currentBoard].imagepath && typeof board_members[currentBoard].imagepath === 'string' ? (
                  <Image
                    src={board_members[currentBoard].imagepath.replace(/^public[\\/]/, '/').replace(/\\/g, '/')}
                    alt={board_members[currentBoard].name}
                    width={112}
                    height={112}
                    className="w-28 h-28 object-cover rounded-full border-2 border-[#022d58] mb-4 shadow-md bg-white"
                  />
                ) : (
                  <div className="w-28 h-28 flex items-center justify-center rounded-full border-2 border-[#022d58] mb-4 shadow-md bg-gradient-to-br from-[#022d58] to-[#01ff5a]">
                    <span className="text-white font-bold text-5xl">
                      {board_members[currentBoard].name.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Name */}
                <p className="text-2xl font-bold text-[#022d58] mb-1">
                  {board_members[currentBoard].name}
                </p>
                {/* Title */}
                <p className="text-lg text-[#022d58] font-semibold mb-2">
                  {board_members[currentBoard].title}
                </p>
                {/* Description */}
                <p className="text-base text-black leading-relaxed mb-4 text-center">
                  {board_members[currentBoard].desc}
                </p>
                {/* Social Links */}
                <div className="flex space-x-4 mt-2 justify-center">
                  {board_members[currentBoard].insta_link && (
                    <a
                      href={board_members[currentBoard].insta_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <FaInstagram className="w-7 h-7 text-[#E4405F] hover:text-[#C13584] transition-colors" />
                    </a>
                  )}
                  {board_members[currentBoard].x_link && (
                    <a
                      href={board_members[currentBoard].x_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="X"
                    >
                      <FaXTwitter className="w-7 h-7 text-black hover:text-[#1DA1F2] transition-colors" />
                    </a>
                  )}
                  {board_members[currentBoard].linkdin_link && (
                    <a
                      href={board_members[currentBoard].linkdin_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin className="w-7 h-7 text-[#0077B5] hover:text-[#005983] transition-colors" />
                    </a>
                  )}
                </div>
              </div>
              {/* Dots Indicator */}
              <div className="flex justify-center mt-8 space-x-2">
                {board_members.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBoard(index)}
                    className={`w-3 h-3 rounded-full transition-colors border border-black ${
                      index === currentBoard
                        ? 'bg-gradient-to-br from-[#ee8002] to-[#01ff5a]'
                        : 'bg-gray-300'
                    }`}
                    style={index === currentBoard ? { backgroundImage: 'linear-gradient(135deg, #ee8002 0%, #01ff5a 100%)' } : {}}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
