"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await res.json();
      
      if (data.authenticated) {
        // Set secure HTTP-only cookie via API
        await fetch("/api/auth/set-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authenticated: true }),
        });
        
        router.push("/admin/panel");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ee800227] to-[#01ff5a49] flex items-center justify-center p-4 md:p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 items-center">
          {/* Left Side - Company Logo */}
          <div className="text-center space-y-6 md:space-y-8 animate-fade-in-up">
            <div className="flex flex-col items-center space-y-0 md:space-y-0">
              <Image
                src="/Company-logo-svg.svg"
                alt="Propelligence Logo"
                width={200}
                height={200}
                className="w-32 h-32 md:w-48 md:h-48 rounded-xl object-contain drop-shadow-2xl"
                priority
                draggable={false}
              />
              <div className="text-center">
                <h1 className="text-xl md:text-2xl font-bold text-[#022d58] leading-tight">Propelligence</h1>
                <p className="text-base md:text-lg font-semibold text-[#022d58]">Advisors Private Limited</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-[#022d58]/20 w-full max-w-sm md:max-w-md">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#022d58] mb-2">Admin Login</h2>
                <p className="text-sm md:text-base text-gray-600">Enter your credentials to continue</p>
              </div>
              
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-[#022d58] mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 md:p-4 border-2 border-[#022d58]/20 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#022d58] focus:outline-none transition-all duration-300 text-[#022d58] placeholder-gray-500 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-[#022d58] mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 md:p-4 border-2 border-[#022d58]/20 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#022d58] focus:outline-none transition-all duration-300 text-[#022d58] placeholder-gray-500 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>
                
                {error && (
                  <div className="p-3 md:p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-center font-medium text-sm md:text-base">
                    {error}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#022d58] to-[#003c96] text-white py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
              
              <div className="mt-4 md:mt-6 text-center">
                <p className="text-xs md:text-sm text-gray-500">
                  Secure access to Propelligence admin panel
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
