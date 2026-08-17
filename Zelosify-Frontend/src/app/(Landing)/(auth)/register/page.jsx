"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Check, ArrowRight, Sun, Moon, Loader2, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    phoneNumber: "+1",
    department: "IT",
    role: "IT_VENDOR", // default
    tenantId: "309b0dba-9a33-4230-86f5-122748c7dc54", // Demo tenant
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.firstName) {
      toast.error("Please fill out all required fields.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await register(formData);
      
      // Save QR code globally/localStorage so setup-totp can use it
      if (res.qrCode) {
        localStorage.setItem("totp_qr_code", res.qrCode);
      }
      
      toast.success(res.message || "Registration successful!");
      router.push("/setup-totp");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to register. Please try again.");
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

          <Link href="/login" className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
            Login
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row z-10 mt-8 mb-16">
        
        {/* Left Side - Copy & Value Prop */}
        <div className="flex-1 p-4 md:p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
          <div className="max-w-xl">
            <h1 className="text-[36px] md:text-[44px] lg:text-[52px] font-bold tracking-tight leading-[1.05] mb-6 text-zinc-900 dark:text-white">
              Create your secure workspace.
            </h1>
            <p className="text-[17px] text-zinc-600 dark:text-zinc-400 mb-12 leading-relaxed">
              Join Zelosify as an IT Vendor or Hiring Manager to instantly manage candidates, AI evaluations, and job requisitions.
            </p>

            {/* Feature checks */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-transparent shadow-sm dark:shadow-none">
                <Check className="w-4 h-4 text-zinc-900 dark:text-white shrink-0" />
                <span className="text-sm text-zinc-600 dark:text-zinc-300 leading-tight">Instant access<br/>after setup</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-transparent shadow-sm dark:shadow-none">
                <Check className="w-4 h-4 text-zinc-900 dark:text-white shrink-0" />
                <span className="text-sm text-zinc-600 dark:text-zinc-300 leading-tight">MFA enforced<br/>for all roles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-4 md:p-8 lg:p-12 xl:p-16 flex items-center justify-center">
          <div className="w-full max-w-lg bg-zinc-50 dark:bg-[#111111] border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none rounded-[24px] p-6 md:p-8">
            
            <h2 className="text-2xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-white">
              Get Started
            </h2>
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
              Enter your details to create an account. You will set up two-factor authentication on the next step.
            </p>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">First Name <span className="text-red-500 ml-0.5">*</span></label>
                  <input
                    type="text" name="firstName" value={formData.firstName} onChange={handleChange} required
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-zinc-300 dark:border-white/10 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Last Name <span className="text-red-500 ml-0.5">*</span></label>
                  <input
                    type="text" name="lastName" value={formData.lastName} onChange={handleChange} required
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-zinc-300 dark:border-white/10 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address <span className="text-red-500 ml-0.5">*</span></label>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-zinc-300 dark:border-white/10 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Username <span className="text-red-500 ml-0.5">*</span></label>
                <input
                  type="text" name="username" value={formData.username} onChange={handleChange} required
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-zinc-300 dark:border-white/10 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password <span className="text-red-500 ml-0.5">*</span></label>
                <input
                  type="password" name="password" value={formData.password} onChange={handleChange} required
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-zinc-300 dark:border-white/10 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Role <span className="text-red-500 ml-0.5">*</span></label>
                <select
                  name="role" value={formData.role} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-zinc-300 dark:border-white/10 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 transition-all"
                >
                  <option value="IT_VENDOR">IT Vendor</option>
                  <option value="HIRING_MANAGER">Hiring Manager</option>
                </select>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                {!isSubmitting && <UserPlus className="w-4 h-4" />}
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-zinc-500">
                  Already have an account? <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Log in</Link>
                </p>
              </div>
            </form>
            
          </div>
        </div>
      </main>

    </div>
  );
}
