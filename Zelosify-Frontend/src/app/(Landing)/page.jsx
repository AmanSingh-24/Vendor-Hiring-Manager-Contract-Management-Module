"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function LandingPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] text-zinc-900 dark:text-white flex flex-col relative overflow-hidden transition-colors duration-200">
      
      {/* Background Subtle Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] bg-emerald-50 dark:bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <header className="w-full flex items-center justify-between px-8 py-8 z-10 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2">
          {/* Logo from public folder */}
          <img src="/favicon.ico" alt="Zelosify Logo Light" className="w-6 h-6 block dark:hidden" />
          <img src="/favicon1.ico" alt="Zelosify Logo Dark" className="w-6 h-6 hidden dark:block" />
          <span className="text-xl font-bold tracking-tight">zelosify</span>
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

          <Link 
            href="/register" 
            className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Get Started
          </Link>
          <Link 
            href="/login" 
            className="px-4 py-2 bg-zinc-50 dark:bg-[#111111] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-sm font-medium rounded-xl hover:bg-zinc-100 dark:hover:bg-[#1a1a1a] transition-colors hidden md:block"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center z-10 mt-16 pb-32">
        
        {/* Subtle pill badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#151515] text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer hover:bg-zinc-100 dark:hover:bg-[#111111] transition-colors">
          <span>For teams managing 25–500+ vendors</span>
          <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-[#1a1a1a] flex items-center justify-center">
            <ArrowRight className="w-3 h-3 text-zinc-900 dark:text-white" />
          </div>
        </div>

        {/* Massive Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold tracking-normal leading-[1.05] max-w-7xl mb-6 text-zinc-900 dark:text-white">
          The operating system for every<br />vendor you pay.
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-100 max-w-3xl mb-10 leading-relaxed">
          Unify contracts, obligations, timesheets, renewals, and invoices in one platform. so.<br />what you pay always matches what you signed.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/register"
            className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Get Started
          </Link>
          <Link 
            href="/login"
            className="px-6 py-3 bg-zinc-50 dark:bg-[#111111] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-sm font-medium rounded-xl hover:bg-zinc-100 dark:hover:bg-[#1a1a1a] transition-colors"
          >
            Login
          </Link>
        </div>

        {/* Footer text */}
        <p className="text-md text-zinc-500 font-medium">
          Realize tangible savings within 60 days or we'll build your use case at no cost
        </p>

      </main>

    </div>
  );
}
