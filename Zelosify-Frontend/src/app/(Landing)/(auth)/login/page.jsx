"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Check, ArrowRight, Sun, Moon, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export default function LoginPage() {
  const { login, verifyTotp } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Form states
  const [step, setStep] = useState(1);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      toast.error("Please enter both username and password");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await login(usernameOrEmail, password);
      toast.success(res.message || "Please enter your TOTP code");
      setStep(2);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTotpSubmit = async (e) => {
    e.preventDefault();
    if (!totp) {
      toast.error("Please enter your TOTP code");
      return;
    }

    setIsSubmitting(true);
    try {
      const userData = await verifyTotp(totp);
      toast.success("Login successful!");
      
      // Redirect based on role
      if (userData.role === "IT_VENDOR") {
        router.push("/vendor/openings");
      } else if (userData.role === "HIRING_MANAGER") {
        router.push("/hiring-manager/openings");
      } else if (userData.role === "BUSINESS_USER") {
        router.push("/business-user/digital-initiative");
      } else {
        router.push("/user");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Invalid TOTP code");
    } finally {
      setIsSubmitting(false);
    }
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
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row z-10 mt-8">
        
        {/* Left Side - Copy & Value Prop */}
        <div className="flex-1 p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
          <div className="max-w-xl">
            <h1 className="text-[44px] md:text-[52px] font-bold tracking-tight leading-[1.05] mb-6 text-zinc-900 dark:text-white">
              Securely access your vendor workspace.
            </h1>
            <p className="text-[17px] text-zinc-600 dark:text-zinc-400 mb-12 leading-relaxed">
              Log in to manage operations, review contracts, and submit profiles. Secured by Keycloak and Multi-Factor Authentication.
            </p>

            {/* Feature checks */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-transparent shadow-sm dark:shadow-none">
                <Check className="w-4 h-4 text-zinc-900 dark:text-white shrink-0" />
                <span className="text-sm text-zinc-600 dark:text-zinc-300 leading-tight">Enterprise-grade<br/>Security</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-transparent shadow-sm dark:shadow-none">
                <Check className="w-4 h-4 text-zinc-900 dark:text-white shrink-0" />
                <span className="text-sm text-zinc-600 dark:text-zinc-300 leading-tight">MFA enforced<br/>for all roles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form (Real Login) */}
        <div className="flex-1 p-8 lg:p-12 xl:p-16 flex items-center justify-center">
          <div className="w-full max-w-md bg-zinc-50 dark:bg-[#111111] border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none rounded-[24px] p-8">
            
            <h2 className="text-2xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-white">
              {step === 1 ? "Welcome back" : "Two-Factor Authentication"}
            </h2>
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
              {step === 1 
                ? "Enter your credentials to access your account." 
                : "Enter the 6-digit code from your authenticator app."}
            </p>

            {step === 1 ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Username or Email</label>
                  <input
                    type="text"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-zinc-300 dark:border-white/10 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 transition-all"
                    placeholder="Enter your username"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-zinc-300 dark:border-white/10 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 transition-all"
                    placeholder="••••••••"
                    disabled={isSubmitting}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleTotpSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Authenticator Code</label>
                  <input
                    type="text"
                    value={totp}
                    onChange={(e) => setTotp(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-zinc-300 dark:border-white/10 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 transition-all text-center tracking-widest text-lg font-mono"
                    placeholder="000000"
                    maxLength={6}
                    disabled={isSubmitting}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Login"}
                </button>
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="w-full py-2 text-[13px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
                >
                  Back to credentials
                </button>
              </form>
            )}
            
          </div>
        </div>
      </main>

    </div>
  );
}
