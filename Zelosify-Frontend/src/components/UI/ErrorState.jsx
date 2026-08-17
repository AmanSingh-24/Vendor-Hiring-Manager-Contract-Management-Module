import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "./shadcn/button";

export default function ErrorState({ 
  title = "Something went wrong", 
  message = "An error occurred while loading the data. Please try again later.",
  onRetry = null
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
        <AlertTriangle className="w-8 h-8 text-zinc-900 dark:text-zinc-100" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
        {message}
      </p>
      
      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="gap-2 border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
