"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Check, ArrowRight, Sun, Moon, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/MockAuthContext";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const { loginAsVendor, loginAsHiringManager } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  const handleDemoLogin = (role) => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (role === "vendor") {
        loginAsVendor();
        router.push("/vendor/openings");
      } else {
        loginAsHiringManager();
        router.push("/hiring-manager/openings");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] text-zinc-900 dark:text-white flex flex-col relative overflow-hidden transition-colors duration-200">
      
      {/* Background Subtle Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-100 dark:bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Navbar */}
      <header className="w-full flex items-center justify-between px-8 py-8 z-10 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <img src="/favicon.ico" alt="Zelosify Logo Light" className="w-6 h-6 block dark:hidden" />
          <img src="/favicon1.ico" alt="Zelosify Logo Dark" className="w-6 h-6 hidden dark:block" />
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">zelosify</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
          <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Features</Link>
          <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">FAQ</Link>
          <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Help Center</Link>
        </nav>

        <div className="flex items-center gap-4">
          
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors mr-2"
              title="Toggle Theme"
            >
              {currentTheme === "dark" ? (
                <Sun className="w-4 h-4 text-zinc-400 hover:text-white" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-600 hover:text-black" />
              )}
            </button>
          )}

          <button className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
            Get Started
          </button>
          <button className="px-4 py-2 bg-zinc-50 dark:bg-[#111111] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-[#1a1a1a] transition-colors hidden md:block">
            Book demo
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row z-10 mt-8">
        
        {/* Left Side - Copy & Value Prop */}
        <div className="flex-1 p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
          <div className="max-w-xl">
            <h1 className="text-[44px] md:text-[52px] font-bold tracking-tight leading-[1.05] mb-6 text-zinc-900 dark:text-white">
              Let's understand how your team<br/>manages vendors today.
            </h1>
            <p className="text-[17px] text-zinc-600 dark:text-zinc-400 mb-12 leading-relaxed">
              Tell us about your vendor operations, contracts, and current challenges. We'll review your setup and recommend the best way to use Zelosify.
            </p>

            {/* Feature checks */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-transparent shadow-sm dark:shadow-none">
                <Check className="w-4 h-4 text-zinc-900 dark:text-white shrink-0" />
                <span className="text-sm text-zinc-600 dark:text-zinc-300 leading-tight">No cost or<br/>commitment</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-transparent shadow-sm dark:shadow-none">
                <Check className="w-4 h-4 text-zinc-900 dark:text-white shrink-0" />
                <span className="text-sm text-zinc-600 dark:text-zinc-300 leading-tight">Your information<br/>stays private</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-transparent shadow-sm dark:shadow-none">
                <Check className="w-4 h-4 text-zinc-900 dark:text-white shrink-0" />
                <span className="text-sm text-zinc-600 dark:text-zinc-300 leading-tight">A practical next step,<br/>not a generic pitch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form (Mock Login) */}
        <div className="flex-1 p-8 lg:p-12 xl:p-16 flex items-center justify-center">
          <div className="w-full max-w-md bg-zinc-50 dark:bg-[#111111] border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none rounded-[24px] p-8">
            
            <h2 className="text-2xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-white">Tell us about your vendor setup</h2>
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
              Share a few details so we can guide the conversation toward the right starting point.
              <br/><br/>
              <span className="italic text-yellow-600 dark:text-yellow-500/80">Developer Note: Choose a persona below to bypass Keycloak and view the dashboards.</span>
            </p>

            <div className="space-y-6">
              {/* IT Vendor Mock Login */}
              <div className="space-y-2">
                <button 
                  onClick={() => handleDemoLogin("vendor")}
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-zinc-100 dark:bg-[#1a1a1a] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-sm font-medium rounded-lg hover:bg-zinc-200 dark:hover:bg-[#222] shadow-sm dark:shadow-none transition-colors disabled:opacity-50 text-left px-5 flex justify-between items-center"
                >
                  <span>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</span>
                    ) : "1. Log in as IT Vendor"}
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                </button>
              </div>

              {/* Hiring Manager Mock Login */}
              <div className="space-y-2">
                <button 
                  onClick={() => handleDemoLogin("hm")}
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm dark:shadow-none transition-colors disabled:opacity-50 text-left px-5 flex justify-between items-center"
                >
                  <span>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</span>
                    ) : "2. Log in as Hiring Manager"}
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </main>

    </div>
  );
}
