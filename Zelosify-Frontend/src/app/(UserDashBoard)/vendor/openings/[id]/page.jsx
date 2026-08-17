"use client";
import React, { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { ArrowLeft, UploadCloud, FileText, Trash2, CheckCircle2, Loader2, Users } from "lucide-react";
import EmptyState from "@/components/UI/EmptyState";
import ErrorState from "@/components/UI/ErrorState";

export default function OpeningDetail() {
  const params = useParams();
  const router = useRouter();
  const openingId = params.id;

  const [opening, setOpening] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(false);
    try {
      const response = await api.get(`/vendor/openings/${openingId}`);
      const opData = response.data;
      setOpening(opData);
      // Transform the nested hiringProfiles back to the format the UI expects, if needed
      const profData = opData.hiringProfiles?.map(p => ({
        id: p.id,
        fileName: p.s3Key.split('/').pop(),
        uploadDate: p.submittedAt,
        status: p.status
      })) || [];
      setProfiles(profData);
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

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    try {
      // Simulate multiple uploads
      for (const file of acceptedFiles) {
        // 1. Get Presigned URL
        const presignRes = await api.post(`/vendor/openings/${openingId}/profiles/presign`, {
          filename: file.name,
          contentType: file.type || "application/pdf"
        });
        const { presignedUrl, s3Key } = presignRes.data;

        // 2. Upload to S3 directly
        await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type || "application/pdf" }
        });

        // 3. Notify Backend to save profile
        const uploadRes = await api.post(`/vendor/openings/${openingId}/profiles/upload`, {
          s3Key
        });

        const savedProfile = uploadRes.data.profile;
        setProfiles(prev => [{
          id: savedProfile.id,
          fileName: file.name,
          uploadDate: new Date().toISOString(),
          status: savedProfile.status || "PROCESSING"
        }, ...prev]);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  }, [openingId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true 
  });

  const handleDelete = async (profileId) => {
    try {
      // Optimistic delete
      setProfiles(prev => prev.filter(p => p.id !== profileId));
      // Real API doesn't have a delete profile endpoint right now, but optimistic remove is fine for demo
      // await api.delete(`/vendor/profiles/${profileId}`);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
        <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
          <div className="w-32 h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          
          <div className="p-8 rounded-[24px] bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none">
            <div className="flex justify-between items-start mb-4">
              <div className="w-1/3 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
              <div className="w-24 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
            </div>
            <div className="space-y-3 mb-6 max-w-3xl">
              <div className="w-full h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="w-full h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="w-2/3 h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            </div>
            <div className="flex gap-6">
              <div className="w-32 h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="w-40 h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-40 h-6 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="p-12 h-64 rounded-[24px] border-2 border-dashed border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#050505]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={() => router.push("/vendor/openings")}
            className="flex items-center gap-2 mb-8 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Openings
          </button>
          <ErrorState onRetry={fetchData} />
        </div>
      </div>
    );
  }

  if (!opening) {
    return (
      <div className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={() => router.push("/vendor/openings")}
            className="flex items-center gap-2 mb-8 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Openings
          </button>
          <EmptyState title="Opening Not Found" message="The opening you are looking for does not exist or you do not have permission to view it." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Back Button */}
        <button 
          onClick={() => router.push("/vendor/openings")}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Openings
        </button>

        {/* Header Card */}
        <div className="p-8 rounded-[24px] bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{opening.title}</h1>
            <span className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-200 dark:border-blue-500/20">
              {opening.contractType}
            </span>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 max-w-3xl">
            {opening.description}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
            <span className="truncate">Location: <strong className="text-zinc-900 dark:text-zinc-300">{opening.location}</strong></span>
            <span className="truncate">Manager: <strong className="text-zinc-900 dark:text-zinc-300">{opening.hiringManagerName}</strong></span>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Submit Candidates</h2>
          
          <div 
            {...getRootProps()} 
            className={`p-12 rounded-[24px] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center
              ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/5' : 'border-zinc-300 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/20 bg-zinc-50 dark:bg-[#050505]'}`}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <>
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <p className="text-zinc-900 dark:text-white font-medium">Uploading to secure S3 vault...</p>
                <p className="text-sm text-zinc-500 mt-1">Simulating backend processing</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center mb-4">
                  <UploadCloud className="w-8 h-8 text-zinc-600 dark:text-white" />
                </div>
                <p className="text-lg text-zinc-900 dark:text-white font-medium mb-2">
                  {isDragActive ? "Drop resumes here..." : "Drag & drop PDF resumes"}
                </p>
                <p className="text-sm text-zinc-500">
                  You can upload multiple files at once. Only PDFs are accepted.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Uploaded Profiles List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mt-10">Submitted Profiles</h2>
          
          {profiles.length === 0 ? (
            <EmptyState icon={Users} title="No candidates submitted" message="You haven't uploaded any candidate profiles for this opening yet." />
          ) : (
            <div className="grid gap-3">
              {profiles.map(profile => (
                <div key={profile.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a] hover:bg-zinc-50 dark:hover:bg-[#111111] shadow-sm dark:shadow-none transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 dark:bg-[#1a1a1a] rounded-lg">
                      <FileText className="w-5 h-5 text-red-500 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">{profile.fileName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-500">
                          {new Date(profile.uploadDate).toLocaleString()}
                        </span>
                        {profile.status === "PROCESSING" ? (
                          <span className="flex items-center gap-1 text-[10px] text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-200 dark:border-transparent">
                            <Loader2 className="w-3 h-3 animate-spin" /> AI Analyzing
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-transparent">
                            <CheckCircle2 className="w-3 h-3" /> Processed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(profile.id); }}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:text-zinc-500 dark:hover:text-red-400 dark:hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Delete Profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
