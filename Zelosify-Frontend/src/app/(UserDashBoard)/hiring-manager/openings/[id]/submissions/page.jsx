"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import api from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, FileText, CheckCircle2, ChevronRight } from "lucide-react";

// The height of a single row in pixels (needed for virtualization)
const ROW_HEIGHT = 88;
const CONTAINER_HEIGHT = 600; // Viewport height for the table body

export default function SubmissionsEvaluationTable() {
  const params = useParams();
  const router = useRouter();
  const openingId = params.id;

  const [opening, setOpening] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Virtualization state
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // We don't have a getOpeningById endpoint for HM yet, so let's just use the profiles endpoint
        const profResponse = await api.get(`/hiring-manager/openings/${openingId}/profiles`);
        const profData = profResponse.data.data || [];
        
        // Transform the nested hiringProfiles back to the format the UI expects
        const mappedProfiles = profData.map(p => ({
          id: p.id,
          fileName: p.s3Key?.split('/').pop() || "Unknown",
          vendorName: p.uploadedByUser?.firstName ? `${p.uploadedByUser.firstName} ${p.uploadedByUser.lastName}` : "Vendor",
          aiScore: p.recommendationScore || 0,
          aiBadge: p.recommended ? "Recommended" : "Needs Review",
          aiBadgeColor: p.recommended ? "emerald" : "yellow",
          aiSummary: p.recommendationReason || "No summary yet",
          status: p.status
        }));

        // Sort by AI score descending
        const sorted = mappedProfiles.sort((a, b) => b.aiScore - a.aiScore);
        
        setOpening({ title: "Opening Details" }); // Dummy title since we don't have getOpeningById for HM
        setProfiles(sorted);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [openingId]);

  // Handle scroll to track position
  const handleScroll = (e) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Calculate virtualization bounds
  const totalHeight = profiles.length * ROW_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 3); // Buffer of 3 rows above
  const endIndex = Math.min(
    profiles.length - 1, 
    Math.floor((scrollTop + CONTAINER_HEIGHT) / ROW_HEIGHT) + 3 // Buffer of 3 rows below
  );
  
  const visibleProfiles = useMemo(() => {
    return profiles.slice(startIndex, endIndex + 1).map((profile, i) => ({
      ...profile,
      virtualIndex: startIndex + i
    }));
  }, [profiles, startIndex, endIndex]);

  if (isLoading) {
    return (
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="w-32 h-4 bg-zinc-200 dark:bg-zinc-800 rounded mb-4"></div>
              <div className="w-64 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
            </div>
            <div className="w-48 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
          </div>

          <div className="rounded-[24px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] overflow-hidden flex flex-col shadow-sm dark:shadow-none">
            
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#111111]">
              <div className="col-span-3 h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="col-span-1 h-4 bg-zinc-200 dark:bg-zinc-800 rounded mx-4"></div>
              <div className="col-span-2 h-4 bg-zinc-200 dark:bg-zinc-800 rounded mx-4"></div>
              <div className="col-span-5 h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="col-span-1 h-4 bg-zinc-200 dark:bg-zinc-800 rounded ml-4"></div>
            </div>

            <div className="overflow-y-hidden bg-white dark:bg-[#0a0a0a]" style={{ height: 600 }}>
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-zinc-100 dark:border-white/5 items-center">
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg shrink-0"></div>
                    <div className="space-y-2 w-full">
                      <div className="w-3/4 h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                      <div className="w-1/2 h-3 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <div className="w-24 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                  </div>
                  <div className="col-span-5 space-y-2 pr-4">
                    <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    <div className="w-4/5 h-3 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                  </div>
                  <div className="col-span-1 flex justify-end pr-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 h-10 bg-zinc-50 dark:bg-[#111111] border-t border-zinc-200 dark:border-white/10"></div>
          </div>

        </div>
      </div>
    );
  }

  if (!opening) return <div className="p-8 text-zinc-900 dark:text-white">Opening not found</div>;

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <button 
              onClick={() => router.push("/hiring-manager/openings")}
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Requisitions
            </button>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
              {opening.title} <span className="text-zinc-500 dark:text-zinc-500 font-normal">Submissions</span>
            </h1>
          </div>
          
          <div className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-400 font-medium">AI Analysis Complete</span>
            <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 rounded-full text-blue-800 dark:text-blue-300 text-xs">
              {profiles.length} Total
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-[24px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] overflow-hidden flex flex-col shadow-sm dark:shadow-none">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#111111] text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider sticky top-0 z-10">
            <div className="col-span-3 pl-2">Candidate & Vendor</div>
            <div className="col-span-1 text-center">AI Score</div>
            <div className="col-span-2 text-center">Match Badge</div>
            <div className="col-span-5">AI Summary</div>
            <div className="col-span-1 text-right pr-2">Action</div>
          </div>

          {/* Virtualized Body Container */}
          <div 
            ref={containerRef}
            className="overflow-y-auto custom-scrollbar relative bg-white dark:bg-[#0a0a0a]"
            style={{ height: CONTAINER_HEIGHT }}
            onScroll={handleScroll}
          >
            {/* Inner height enforcer */}
            <div style={{ height: totalHeight, position: 'relative' }}>
              
              {/* Visible Rows */}
              {visibleProfiles.map((profile) => (
                <div 
                  key={profile.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    transform: `translateY(${profile.virtualIndex * ROW_HEIGHT}px)`,
                    height: ROW_HEIGHT,
                    width: '100%',
                  }}
                  className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-[#151515] transition-colors items-center group cursor-pointer"
                >
                  
                  {/* Candidate Info */}
                  <div className="col-span-3 flex items-center gap-3 overflow-hidden pl-2">
                    <div className="p-2.5 bg-zinc-100 dark:bg-[#1a1a1a] rounded-lg shrink-0">
                      <FileText className="w-5 h-5 text-zinc-500 dark:text-zinc-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{profile.fileName.replace(".pdf", "")}</p>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">from {profile.vendorName}</p>
                    </div>
                  </div>

                  {/* AI Score */}
                  <div className="col-span-1 flex justify-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2
                      ${profile.aiScore > 85 ? 'text-emerald-700 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-400/30 dark:bg-emerald-400/10' : 
                        profile.aiScore > 70 ? 'text-blue-700 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-400/30 dark:bg-blue-400/10' : 
                        profile.aiScore > 50 ? 'text-yellow-700 border-yellow-200 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-400/30 dark:bg-yellow-400/10' : 
                        'text-red-700 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-400/30 dark:bg-red-400/10'}`}
                    >
                      {profile.aiScore}
                    </div>
                  </div>

                  {/* Match Badge */}
                  <div className="col-span-2 flex justify-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5
                      ${profile.aiBadgeColor === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 
                        profile.aiBadgeColor === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' : 
                        profile.aiBadgeColor === 'yellow' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20' : 
                        'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}
                    >
                      {profile.aiScore > 70 && <CheckCircle2 className="w-3 h-3" />}
                      {profile.aiBadge}
                    </span>
                  </div>

                  {/* AI Summary */}
                  <div className="col-span-5 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-snug pr-4">
                    {profile.aiSummary}
                  </div>

                  {/* Action */}
                  <div className="col-span-1 flex justify-end pr-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-zinc-200 dark:group-hover:bg-white/10 transition-colors">
                      <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-white" />
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
          
          {/* Footer Info */}
          <div className="p-3 bg-zinc-50 dark:bg-[#111111] border-t border-zinc-200 dark:border-white/10 text-xs text-zinc-500 text-center">
            Showing all {profiles.length} candidates. Powered by native DOM virtualization.
          </div>
        </div>

      </div>
    </div>
  );
}
