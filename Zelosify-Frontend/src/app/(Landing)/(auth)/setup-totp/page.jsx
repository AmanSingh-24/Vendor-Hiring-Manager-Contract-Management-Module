"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Sun, Moon, Loader2, ShieldCheck, QrCode } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function SetupTotpPage() {
  const { completeRegistration } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    setMounted(true);
    // Retrieve QR code from local storage
    const storedQr = localStorage.getItem("totp_qr_code");
    if (storedQr) {
      setQrCode(storedQr);
    }
  }, []);

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  const handleDone = async () => {
    setIsSubmitting(true);
    try {
      await completeRegistration();
      // Clear from local storage for security
      localStorage.removeItem("totp_qr_code");
      router.push("/login");
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] text-zinc-900 dark:text-white flex flex-col relative overflow-hidden transition-colors duration-200">
      
      {/* Background Subtle Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Navbar */}
      <header className="w-full flex items-center justify-between px-8 py-8 z-10 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <img src="/favicon.ico" alt="Zelosify Logo Light" className="w-6 h-6 block dark:hidden" />
          <img src="/favicon1.ico" alt="Zelosify Logo Dark" className="w-6 h-6 hidden dark:block" />
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">zelosify</span>
        </div>

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

          <Link href="/login" className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
            Login
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full flex flex-col items-center justify-center z-10 mt-8 mb-32 px-4">
        
        <div className="w-full max-w-xl bg-zinc-50 dark:bg-[#111111] border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none rounded-[24px] p-8 md:p-12 text-center relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>

          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">
            Secure Your Account
          </h1>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed max-w-md mx-auto">
            Scan this QR code with your authenticator app (like Google Authenticator or Authy) to set up two-factor authentication.
          </p>

          <div className="flex justify-center mb-10">
            <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm relative">
              {qrCode ? (
                <img src={qrCode} alt="TOTP QR Code" className="w-48 h-48 object-contain" />
              ) : (
                <div className="w-48 h-48 flex flex-col items-center justify-center text-zinc-400 space-y-2">
                  <QrCode className="w-8 h-8 opacity-50" />
                  <span className="text-xs font-medium">QR Code missing</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 mb-8 text-left flex items-start gap-3">
            <div className="mt-0.5">
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed font-medium">
              After scanning the QR code, your app will start generating 6-digit codes. Click "I've scanned the code" to proceed to login.
            </p>
          </div>

          <button 
            onClick={handleDone}
            disabled={isSubmitting || !qrCode}
            className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black text-[15px] font-medium rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "I've scanned the code"}
            {!isSubmitting && <ArrowRight className="w-5 h-5" />}
          </button>
          
        </div>
      </main>

    </div>
  );
}
