import { X, Menu } from "lucide-react";
import { memo } from "react";
import Link from "next/link";

// eslint-disable-next-line react/display-name
const SidebarHeader = memo(({ isOpen, toggleSidebar }) => (
  <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex gap-7 items-center justify-between px-5">
    {isOpen && (
      <span className="text-sm font-bold text-zinc-500 tracking-widest">
        Dashboard
      </span>
    )}
    <button
      onClick={toggleSidebar}
      className={`rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center ${
        isOpen ? "" : "w-full"
      }`}
    >
      {isOpen ? (
        <X className="h-7 w-7 p-1 text-gray-600 dark:text-gray-300" />
      ) : (
        <Menu className="h-7 w-7 p-1 text-gray-600 dark:text-gray-300" />
      )}
    </button>
  </div>
));

export default SidebarHeader;
