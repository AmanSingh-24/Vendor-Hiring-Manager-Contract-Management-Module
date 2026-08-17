"use client";
import { memo, useEffect, useState, useRef } from "react";
import { Moon, Search, Sun, Menu } from "lucide-react";
import UserProfile from "./UserProfile";
import Notification from "./Notification";
import { useTheme } from "next-themes";

const Header = memo(({ isSidebarOpen, toggleSidebar }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Unified function to close both when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get current theme (Use resolvedTheme to correctly detect system theme)
  const currentTheme = theme === "system" ? resolvedTheme : theme;

  // Toggle Notifications
  const toggleNotifications = (e) => {
    e.stopPropagation();
    setShowNotifications((prev) => !prev);
    setIsProfileOpen(false); // Close profile if notification opens
  };

  // Toggle Profile
  const toggleProfile = (e) => {
    e.stopPropagation();
    setIsProfileOpen((prev) => !prev);
    setShowNotifications(false); // Close notifications if profile opens
  };

  return (
    <header
      className={`${
        isSidebarOpen ? "lg:pl-[16rem]" : "lg:pl-[5rem]"
      } pl-0 h-16 flex items-center justify-between sticky top-0 z-30 bg-background border-b border-border transition-all duration-300`}
    >
      <div className="flex items-center justify-between px-4 lg:px-6 w-full">
        
        {/* Left Side: Mobile Menu Button & Custom Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 -ml-2 rounded-md text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = "/"}>
            <img src="/assets/logos/zelosify_Dark.png" alt="Zelosify Light Logo" className="h-6 w-auto block dark:hidden" />
            <img src="/assets/logos/main-logo.png" alt="Zelosify Dark Logo" className="h-6 w-auto hidden dark:block" />
          </div>
        </div>

        {/* <div className="flex items-center gap-4 flex-1">
          <div className="hidden md:flex items-center max-w-md flex-1">
            <div className="relative w-full">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-4 py-2 w-full border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </div> */}

        <div className="flex items-center gap-2">
          {/* Toggle Theme Button */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={currentTheme === "dark"} //  Ensure correct theme detection
              onChange={() =>
                setTheme(currentTheme === "dark" ? "light" : "dark")
              }
            />
            <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 dark:border dark:border-gray-700 rounded-full peer peer-checked:after:translate-x-6 rtl:peer-checked:after:-translate-x-6 after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black">
              {currentTheme === "dark" ? (
                <Moon className="absolute left-1 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
              ) : (
                <Sun className="absolute right-1 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
              )}
            </div>
          </label>

          {/* Bell Icon to Open Notifications */}
          {/* <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
          </div> */}

          <UserProfile
            toggleNotifications={toggleNotifications}
            isProfileOpen={isProfileOpen}
            toggleProfile={toggleProfile}
            profileRef={profileRef}
          />
        </div>
      </div>

      {/* Notification Popup */}
      {showNotifications && (
        <Notification
          notificationRef={notificationRef}
          setShowNotifications={setShowNotifications}
        />
      )}
    </header>
  );
});

Header.displayName = "Header";
export default Header;
