"use client";
import React, { useState, useEffect } from "react";
import api from "@/services/api";
import { Briefcase, MapPin, Calendar, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/UI/EmptyState";
import ErrorState from "@/components/UI/ErrorState";

export default function VendorOpeningsList() {
  const [openings, setOpenings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  const fetchOpenings = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const response = await api.get("/vendor/openings");
      setOpenings(response.data.data || []);
    } catch (error) {
      console.error("Failed to load openings", error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenings();
  }, []);

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">Available Openings</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">View and submit candidates to active contracts from hiring managers.</p>
          </div>
        </div>

        {/* Content Area */}
        {error ? (
          <ErrorState onRetry={fetchOpenings} />
        ) : isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                    <div className="w-48 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                    <div className="w-16 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="w-24 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                    <div className="w-32 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block space-y-2">
                    <div className="w-32 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md ml-auto"></div>
                    <div className="w-24 h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md ml-auto"></div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                </div>
              </div>
            ))}
          </div>
        ) : openings.length === 0 ? (
          <EmptyState title="No Openings Found" message="There are currently no active job openings available." />
        ) : (
          <div className="grid gap-4">
            {openings.map((opening) => (
              <div 
                key={opening.id} 
                onClick={() => router.push(`/vendor/openings/${opening.id}`)}
                className="group p-6 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/15 shadow-sm dark:shadow-none transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Info */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-zinc-100 dark:bg-[#1a1a1a] rounded-lg">
                      <Briefcase className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
                    </div>
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {opening.title}
                    </h2>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-500/20">
                      {opening.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{opening.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span className="truncate">Posted: {opening.postedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                      <span className="truncate">{opening.contractType}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <p className="text-sm text-zinc-900 dark:text-white font-medium">{opening.hiringManager}</p>
                    <p className="text-xs text-zinc-500">Hiring Manager</p>
                  </div>
                  <div className="p-2 rounded-full bg-zinc-100 dark:bg-white/5 group-hover:bg-zinc-200 dark:group-hover:bg-white/10 transition-colors">
                    <ExternalLink className="w-5 h-5 text-zinc-600 dark:text-white" />
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
