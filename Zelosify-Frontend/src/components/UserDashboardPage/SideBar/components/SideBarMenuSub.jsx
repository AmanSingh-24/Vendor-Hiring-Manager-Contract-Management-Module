import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";

// SidebarMenuSub component - memoized
export const SidebarMenuSub = memo(
  ({ children, isOpen, isExpanded, className, ...props }) => {
    const isVisible = isOpen && isExpanded;

    return (
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isVisible ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul
          data-sidebar="menu-sub"
          className={`ml-3 pl-1 border-l border-border mt-1 space-y-1 ${
            isVisible ? "pointer-events-auto" : "pointer-events-none"
          } ${className || ""}`}
          {...props}
        >
          {children}
        </ul>
      </div>
    );
  }
);
SidebarMenuSub.displayName = "SidebarMenuSub";

// SidebarMenuSubItem component - memoized
export const SidebarMenuSubItem = memo(
  ({ item, isActive, isOpen, ...props }) => {
    const router = useRouter();

    const handleClick = useCallback(() => {
      router.push(item.href);
    }, [router, item.href]);

    return (
      <li {...props}>
        <button
          onClick={handleClick}
          className={`
          w-full rounded-md flex items-center gap-2 px-3 py-2 text-sm
          ${
            isActive
              ? "bg-black text-white font-medium dark:bg-white dark:text-black shadow-sm"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          }
        `}
        >
          {item.icon && (
            <item.icon
              className={`h-5 w-5 ${
                isActive
                  ? "text-white dark:text-black"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            />
          )}
          {isOpen && <span>{item.title}</span>}
        </button>
      </li>
    );
  }
);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
