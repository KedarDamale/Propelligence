"use client";
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#ee800227] to-[#01ff5a49] text-[#022d58] pt-8 pb-4">
      <div className="container mx-auto px-6">
        <div className="md:max-w-6xl md:mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-12 md:gap-24">
          {/* Contact Info */}
          <div className="mb-0 md:mb-0 flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-4 tracking-wide text-[#022d58]">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#022d58]" />
                <a href="mailto:info@propelligence.com" className="hover:underline text-[#022d58]">info@propelligence.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#022d58]" />
                <a href="tel:+91XXXXXXXXXX" className="hover:underline text-[#022d58]">+91 XXXXXXXXXX</a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#022d58] mt-1" />
                <span className="text-[#022d58]">XXXXXXXXXXXXXXXXXXXXXXXXXXX</span>
              </div>
            </div>
          </div>
          {/* Social Media */}
          <div className="mb-1 md:mb-0 flex flex-col items-center md:items-end">
            <h4 className="text-lg font-semibold mb-4 tracking-wide text-[#022d58]">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-[#022d58]/10 border border-[#022d58]/20 rounded-full flex items-center justify-center transition-colors hover:bg-pink-500 hover:text-white">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-[#022d58]/10 border border-[#022d58]/20 rounded-full flex items-center justify-center transition-colors hover:bg-[#0077b5] hover:text-white">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-[#022d58]/10 border border-[#022d58]/20 rounded-full flex items-center justify-center transition-colors hover:bg-black hover:text-white">
                <FaXTwitter size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-[#022d58]/20 mt-3 pt-4 text-center">
          <p className="text-[#022d58] text-xs tracking-wide">© {new Date().getFullYear()} Propelligence Advisors Private Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
