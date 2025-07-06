"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#ee8002]/40 to-[#01ff5a]/40">
      <div className="bg-white/90 rounded-3xl shadow-2xl border-4 border-black p-6 flex flex-col items-center max-w-xs w-full">
        <h1 className="text-5xl font-extrabold text-[#022d58] drop-shadow mb-2">404</h1>
        <h2 className="text-2xl font-bold text-[#022d58] mb-1">Page Not Found</h2>
        <p className="text-base text-gray-700 mb-6 text-center">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <button className="bg-[#022d58] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#003c96] transition-colors duration-300 flex items-center space-x-2">
            <ArrowLeft size={18} className="mr-2" />
            Go to Home Page
          </button>
        </Link>
      </div>
    </div>
  );
}
