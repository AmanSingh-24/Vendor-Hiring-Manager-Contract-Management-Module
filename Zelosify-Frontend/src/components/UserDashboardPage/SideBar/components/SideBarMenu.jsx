import { ChevronDown, ChevronRight } from "lucide-react";
import { memo } from "react";

// SidebarMenu component - memoized
export const SidebarMenu = memo(({ children, className, ...props }) => {
  return (
    <ul
      data-sidebar="menu"
      className={`flex w-full min-w-0 flex-col gap-2 ${className || ""}`}
      {...props}
    >
      {children}
    </ul>
  );
});
SidebarMenu.displayName = "SidebarMenu";

// SidebarMenuItem component - memoized
export const SidebarMenuItem = memo(({ children, className, ...props }) => {
  return (
    <li
      data-sidebar="menu-item"
      className={`group/menu-item relative ${className || ""}`}
      {...props}
    >
      {children}
    </li>
  );
});
SidebarMenuItem.displayName = "SidebarMenuItem";

// SidebarMenuButton component - memoized
export const SidebarMenuButton = memo(
  ({
    icon: Icon,
    title,
    isActive,
    onClick,
    isOpen,
    hasSubmenu,
    isExpanded,
    className,
    ...props
  }) => {
    return (
      <button
        data-sidebar="menu-button"
        data-active={isActive}
        onClick={onClick}
        className={`
        flex w-full items-center ${
          isOpen ? "justify-between" : "justify-center"
        } px-3 py-2 text-sm rounded-md
        ${
          isActive
            ? "bg-black text-white font-medium dark:bg-white dark:text-black shadow-sm"
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        }
        ${className || ""}
      `}
        {...props}
      >
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon
              className={`h-5 w-5 ${
                isActive
                  ? "text-white dark:text-black"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            />
          )}
          {isOpen && <span>{title}</span>}
        </div>
        {isOpen &&
          hasSubmenu &&
          (isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ))}
      </button>
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";
