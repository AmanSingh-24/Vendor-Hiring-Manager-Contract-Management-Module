"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Moon, Sun, AlertTriangle, BadgeDollarSign, FileCheck, LayoutGrid, ChevronDown, Globe } from "lucide-react";
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
          <span>For teams managing 25-500+ vendors</span>
          <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-[#1a1a1a] flex items-center justify-center">
            <ArrowRight className="w-3 h-3 text-zinc-900 dark:text-white" />
          </div>
        </div>

        {/* Massive Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold tracking-normal leading-[1.05] max-w-7xl mb-6 text-zinc-900 dark:text-white">
          The operating system for every<br className="hidden md:block" />vendor you pay.
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-100 max-w-3xl mb-10 leading-relaxed">
          Unify contracts, obligations, timesheets, renewals, and invoices in one platform. so.<br className="hidden md:block" />what you pay always matches what you signed.
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

      <ValuePropSection />
      <FaqSection />
      <Footer />

    </div>
  );
}

const ValuePropSection = () => (
  <section className="w-full max-w-6xl mx-auto py-24 px-6 relative z-10">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">Your vendor spend is leaking. Quietly.</h2>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">Vendor value leaks through small, overlooked mismatches in rate, renewal, or unowned obligations.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#111111]">
      <div className="p-8 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-white/10 flex flex-col gap-4">
        <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight mt-2">The renewal nobody caught</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">A software license auto-renews because the cancellation window was buried.</p>
      </div>
      <div className="p-8 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-white/10 flex flex-col gap-4">
        <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center shrink-0">
          <BadgeDollarSign className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight mt-2">The rate nobody checked</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">You negotiated a volume discount, but AP is still paying list price.</p>
      </div>
      <div className="p-8 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-white/10 flex flex-col gap-4">
        <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center shrink-0">
          <FileCheck className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight mt-2">Promised, never scheduled</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">A security review is promised in a PDF nobody opens until audit time.</p>
      </div>
      <div className="p-8 flex flex-col gap-4">
        <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center shrink-0">
          <LayoutGrid className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight mt-2">Spreadsheets holding it together</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Contracts in drives, renewals in spreadsheets. Zelosify unifies it all.</p>
      </div>
    </div>

    <p className="text-center mt-12 text-zinc-900 dark:text-white font-medium">Zelosify closes every one of these gaps from one AI command center.</p>
  </section>
);

const FaqSection = () => {
  const faqs = [
    "How is Zelosify different from Contract Lifecycle Management tools?",
    "Who is Zelosify built for?",
    "What if Zelosify isn't the right fit?",
    "How long does implementation take?",
    "How do AI credits work? What happens if I run out?",
    "Is our contract data safe?"
  ];
  return (
    <section className="w-full max-w-4xl mx-auto py-24 px-6 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">Frequently Asked Questions</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Discover quick and comprehensive answers to common questions about our platform, services, and features.</p>
      </div>
      
      <div className="bg-zinc-50 dark:bg-[#111111] rounded-3xl border border-zinc-200 dark:border-white/10 overflow-hidden">
        {faqs.map((faq, index) => (
          <div key={index} className={`flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-100 dark:hover:bg-[#161616] transition-colors ${index !== faqs.length - 1 ? 'border-b border-zinc-200 dark:border-white/5' : ''}`}>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{faq}</span>
            <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="w-full border-t border-zinc-200 dark:border-white/10 mt-24 relative z-10 bg-white dark:bg-[#000000]">
    <div className="max-w-7xl mx-auto py-16 px-6">
      <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
        <div className="flex items-start gap-2 shrink-0">
          <img src="/favicon.ico" alt="Zelosify Logo Light" className="w-6 h-6 block dark:hidden" />
          <img src="/favicon1.ico" alt="Zelosify Logo Dark" className="w-6 h-6 hidden dark:block" />
          <span className="text-xl font-bold tracking-tight">zelosify</span>
        </div>
        
        <div className="flex flex-col gap-6 md:w-2/3">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">Zelosify - the AI VendorOps platform. From contract to payment.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-zinc-900 dark:text-white text-sm mb-1">Product</h4>
              <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Features</Link>
              <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Pricing</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-zinc-900 dark:text-white text-sm mb-1">Resources</h4>
              <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Help Center</Link>
              <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Blog</Link>
              <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">FAQ</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-zinc-900 dark:text-white text-sm mb-1">Company</h4>
              <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Contact</Link>
              <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">LinkedIn</Link>
              <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">X</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-zinc-900 dark:text-white text-sm mb-1">Legal</h4>
              <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Terms & Conditions</Link>
              <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Acceptable Use Policy</Link>
              <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Cookie Policy</Link>
              <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Refund Policy</Link>
              <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Cookie Settings</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-zinc-200 dark:border-white/10">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">© 2026 Zelosify Pvt. Ltd. All rights reserved.</p>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors">
          <Globe className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">English</span>
          <ChevronDown className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        </button>
      </div>
    </div>
  </footer>
);

