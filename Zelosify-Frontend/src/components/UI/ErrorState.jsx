import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "./shadcn/button";

export default function ErrorState({ 
  title = "Something went wrong", 
  message = "An error occurred while loading the data. Please try again later.",
  onRetry = null
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-red-200 dark:border-red-900/30 rounded-2xl bg-red-50/50 dark:bg-red-950/10">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/50 mb-4">
        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
        {title}
      </h3>
      <p className="text-sm text-red-600/80 dark:text-red-400/80 max-w-sm mb-6">
        {message}
      </p>
      
      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="gap-2 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
