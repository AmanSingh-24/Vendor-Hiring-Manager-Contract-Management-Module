import React from "react";
import { FolderOpen } from "lucide-react";

export default function EmptyState({ 
  icon: Icon = FolderOpen, 
  title = "No Data Found", 
  message = "There is currently nothing to display here." 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-[#0a0a0a]/50">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-4">
        <Icon className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
        {message}
      </p>
    </div>
  );
}
