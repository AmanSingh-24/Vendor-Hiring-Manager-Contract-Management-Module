"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import api from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, FileText, CheckCircle2, ChevronRight, Users } from "lucide-react";
import EmptyState from "@/components/UI/EmptyState";
import ErrorState from "@/components/UI/ErrorState";

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
  const [error, setError] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ isOpen: false, profileId: null, action: null });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(false);
    try {
      const profResponse = await api.get(`/hiring-manager/openings/${openingId}/profiles`);
      const result = profResponse.data.data || {};
      const profData = result.profiles || [];
      
      const mappedProfiles = profData.map(p => ({
        id: p.id,
        fileName: p.s3Key?.split('/').pop() || "Unknown",
        vendorName: p.uploadedByUser?.companyName || "Vendor",
        aiScore: p.aiEvaluation ? Math.round(p.aiEvaluation.score * 100) : 0,
        aiBadge: p.aiEvaluation ? p.aiEvaluation.badge : "Pending",
        aiBadgeColor: p.aiEvaluation ? (p.aiEvaluation.badge === "Recommended" ? "emerald" : p.aiEvaluation.badge === "Borderline" ? "yellow" : "red") : "zinc",
        aiSummary: p.aiEvaluation ? p.aiEvaluation.explanation : "AI evaluation pending...",
        latencyMs: p.aiEvaluation ? p.aiEvaluation.latencyMs : 0,
        confidence: p.aiEvaluation ? Math.round(p.aiEvaluation.confidence * 100) : 0,
        status: p.status
      }));

      const sorted = mappedProfiles.sort((a, b) => b.aiScore - a.aiScore);
      
      setOpening({ title: result.opening?.title || "Opening Details" });
      setProfiles(sorted);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [openingId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef(null);
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  const ROW_HEIGHT = 100; // Estimated row height
  const WINDOW_HEIGHT = 800; // Match the container maxHeight
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 3);
  const endIndex = Math.min(
    profiles.length - 1,
    Math.floor((scrollTop + WINDOW_HEIGHT) / ROW_HEIGHT) + 3
  );

  const visibleProfiles = profiles.slice(startIndex, endIndex + 1);
  const totalHeight = profiles.length * ROW_HEIGHT;
  const offsetY = startIndex * ROW_HEIGHT;

  const executeAction = async () => {
    const { profileId, action } = confirmAction;
    if (!profileId || !action) return;
    try {
      await api.post(`/hiring-manager/profiles/${profileId}/${action}`);
      // Optimistically update the UI
      setProfiles(prev => prev.map(p => 
        p.id === profileId ? { ...p, status: action === 'shortlist' ? 'SHORTLISTED' : 'REJECTED' } : p
      ));
      setConfirmAction({ isOpen: false, profileId: null, action: null });
    } catch (error) {
      console.error(`Failed to ${action} profile`, error);
      alert(`Failed to ${action} profile.`);
      setConfirmAction({ isOpen: false, profileId: null, action: null });
    }
  };

  const requestAction = (e, profileId, action) => {
    e.stopPropagation();
    setConfirmAction({ isOpen: true, profileId, action });
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
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
              <div className="col-span-4 h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="col-span-2 h-4 bg-zinc-200 dark:bg-zinc-800 rounded ml-4"></div>
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
                    <div className="col-span-4 space-y-2 pr-4">
                      <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                      <div className="w-4/5 h-3 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    </div>
                    <div className="col-span-2 flex justify-end pr-2">
                      <div className="w-16 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
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

  if (error) {
    return (
      <div className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => router.push("/hiring-manager/openings")}
            className="flex items-center gap-2 mb-8 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Requisitions
          </button>
          <ErrorState onRetry={fetchData} />
        </div>
      </div>
    );
  }

  if (!opening) {
    return (
      <div className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => router.push("/hiring-manager/openings")}
            className="flex items-center gap-2 mb-8 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Requisitions
          </button>
          <EmptyState title="Opening Not Found" message="The opening you are looking for does not exist." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <button 
              onClick={() => router.push("/hiring-manager/openings")}
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Requisitions
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight flex flex-wrap items-center gap-2 md:gap-3 leading-tight">
              {opening.title} <span className="text-zinc-500 dark:text-zinc-500 font-normal">Submissions</span>
            </h1>
          </div>
          
          <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex flex-wrap items-center gap-2 shrink-0">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-blue-700 dark:text-blue-400 font-medium text-xs md:text-sm">AI Analysis Complete</span>
            <span className="ml-1 md:ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 rounded-full text-blue-800 dark:text-blue-300 text-[10px] md:text-xs">
              {profiles.length} Total
            </span>
          </div>
        </div>

        {/* Data Area */}
        {profiles.length === 0 ? (
          <div className="mt-8">
            <EmptyState icon={Users} title="No Submissions Yet" message="Vendors have not submitted any candidates for this requisition." />
          </div>
        ) : (
          <div className="rounded-[24px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] overflow-hidden flex flex-col shadow-sm dark:shadow-none">
            
            <div className="overflow-x-auto custom-scrollbar">
              <div className="min-w-[1000px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#111111] text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider sticky top-0 z-10">
                  <div className="col-span-3 pl-2">Candidate & Vendor</div>
                  <div className="col-span-1 text-center">AI Score</div>
                  <div className="col-span-2 text-center">Match Badge</div>
                    <div className="col-span-4">AI Summary</div>
                    <div className="col-span-2 text-right pr-2">Action</div>
                </div>

                {/* Standard Body Container (Virtualization Added) */}
                <div 
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="overflow-y-auto custom-scrollbar relative bg-white dark:bg-[#0a0a0a]" 
                  style={{ maxHeight: '800px' }}
                >
                  <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
                    <div style={{ transform: `translateY(${offsetY}px)`, position: 'absolute', top: 0, left: 0, right: 0 }}>
                      {/* Visible Rows */}
                      {visibleProfiles.map((profile) => (
                    <div 
                      key={profile.id}
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
                      <div className="col-span-1 flex flex-col items-center justify-center">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                            {/* Background Track */}
                            <circle 
                              cx="18" cy="18" r="16" 
                              fill="transparent" 
                              className="stroke-zinc-200 dark:stroke-zinc-800" 
                              strokeWidth="3" 
                            />
                            {/* Progress Arc */}
                            <circle 
                              cx="18" cy="18" r="16" 
                              fill="transparent" 
                              className="stroke-black dark:stroke-white transition-all duration-1000 ease-in-out" 
                              strokeWidth="3" 
                              strokeDasharray="100.5" 
                              strokeDashoffset={100.5 - profile.aiScore} 
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="relative z-10 font-bold text-sm text-black dark:text-white">
                            {profile.aiScore}
                          </span>
                        </div>
                        <div className="mt-1 text-[10px] text-zinc-500 dark:text-white/70 font-mono tracking-wide">
                          ⏱ {profile.latencyMs}ms
                        </div>
                      </div>

                      {/* Match Badge */}
                      <div className="col-span-2 flex flex-col items-center justify-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 flex items-center gap-1.5 bg-transparent text-black dark:text-white
                          ${profile.aiBadgeColor === 'emerald' ? 'border-emerald-500' : 
                            profile.aiBadgeColor === 'blue' ? 'border-blue-500' : 
                            profile.aiBadgeColor === 'yellow' ? 'border-yellow-500' : 
                            profile.aiBadgeColor === 'red' ? 'border-red-500' : 
                            'border-zinc-500'}`}
                        >
                          {profile.aiScore > 70 && <CheckCircle2 className="w-3 h-3" />}
                          {profile.aiBadge}
                        </span>
                        <div className="mt-1 text-[10px] text-zinc-500 dark:text-white/70 font-medium tracking-wide">
                          CONF: {profile.confidence}%
                        </div>
                      </div>

                        {/* AI Summary */}
                        <div className="col-span-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pr-4">
                          {profile.aiSummary}
                        </div>
    
                        {/* Action */}
                        <div className="col-span-2 flex flex-row items-center justify-center gap-2 pr-2">
                          {profile.status === 'SUBMITTED' ? (
                            <>
                              <button 
                                onClick={(e) => requestAction(e, profile.id, 'shortlist')}
                                className="w-full h-8 px-1 rounded-md bg-transparent flex items-center justify-center gap-1 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors border border-emerald-500 text-emerald-700 dark:text-emerald-400"
                                title="Shortlist"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                <span className="text-xs font-semibold truncate">Shortlist</span>
                              </button>
                              <button 
                                onClick={(e) => requestAction(e, profile.id, 'reject')}
                                className="w-full h-8 px-1 rounded-md bg-transparent flex items-center justify-center gap-1 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border border-red-500 text-red-700 dark:text-red-400"
                                title="Reject"
                              >
                                <span className="font-bold text-sm leading-none shrink-0">×</span>
                                <span className="text-xs font-semibold truncate">Reject</span>
                              </button>
                            </>
                          ) : (
                            <span className="w-full text-xs font-semibold py-1.5 rounded-md flex items-center justify-center border border-zinc-900 dark:border-white bg-transparent text-black dark:text-white truncate px-1">
                              {profile.status}
                            </span>
                          )}
                        </div>

                  </div>
                ))}
                    </div>
                  </div>
                </div>
            
            {/* Footer Info */}
            <div className="p-3 bg-zinc-50 dark:bg-[#111111] border-t border-zinc-200 dark:border-white/10 text-xs text-zinc-500 text-center">
              Showing all {profiles.length} candidates.
            </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Confirmation Modal */}
      {confirmAction.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Confirm Action</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              Are you sure you want to <strong>{confirmAction.action}</strong> this candidate? This action cannot be undone and the vendor will be notified.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setConfirmAction({ isOpen: false, profileId: null, action: null })}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeAction}
                className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors ${
                  confirmAction.action === 'shortlist' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm {confirmAction.action === 'shortlist' ? 'Shortlist' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
