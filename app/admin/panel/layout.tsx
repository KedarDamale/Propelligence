"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const sidebarLinks = [
  { name: "Services", href: "/admin/panel/services" },
  { name: "Blogs", href: "/admin/panel/blogs" },
  { name: "Testimonials", href: "/admin/panel/testimonials" },
];

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("admin-auth") !== "true") {
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#ee800227] to-[#01ff5a49]">
      <aside className="w-64 bg-white/95 backdrop-blur-md border-r-2 border-[#022d58]/20 flex flex-col p-6 shadow-2xl h-screen sticky top-0">
        {/* Company Logo and Title */}
        <div className="flex flex-col items-center space-y-0 mb-8">
          <Image
            src="/Company-logo-svg.svg"
            alt="Propelligence Logo"
            width={80}
            height={80}
            className="w-16 h-16 rounded-xl object-contain drop-shadow-lg"
            priority
            draggable={false}
          />
          <div className="text-center">
            <h1 className="text-lg font-bold text-[#022d58] leading-tight">Propelligence</h1>
            <p className="text-sm font-semibold text-[#022d58]">Advisors Private Limited</p>
          </div>
        </div>
        
        {/* Admin Panel Title */}
        <div className="text-center mb-6">
          <Link href="/admin/panel" className="block">
            <h2 className="text-xl font-bold text-[#022d58] mb-2 hover:text-[#003c96] transition-colors duration-300 cursor-pointer">Admin Panel</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#022d58] to-[#003c96] mx-auto rounded-full"></div>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col gap-3">
          {sidebarLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="hover:bg-gradient-to-r hover:from-[#022d58] hover:to-[#003c96] hover:text-white rounded-xl px-4 py-3 transition-all duration-300 font-semibold text-[#022d58] border-2 border-transparent hover:border-[#022d58]/20"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        {/* Logout Button */}
        <div className="mt-auto pt-6 border-t-2 border-[#022d58]/10 pb-4">
          <button 
            onClick={() => {
              localStorage.removeItem("admin-auth");
              router.push("/admin/login");
            }}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 relative z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
      
      <main className="flex-1 p-6 md:p-8 bg-transparent">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-[#022d58]/20 p-6 md:p-8 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
