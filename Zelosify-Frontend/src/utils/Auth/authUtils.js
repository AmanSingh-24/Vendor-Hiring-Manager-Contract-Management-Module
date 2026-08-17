/**
 * Authentication utility functions for managing user authentication state
 * and related operations across the application.
 */

/**
 * Get user role from cookies
 * @returns {string|null} User role or null if not found
 */
export const getUserRole = () => {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  const roleCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("role=")
  );

  return roleCookie ? roleCookie.split("=")[1].trim() : null;
};

/**
 * Get redirect path based on user role
 * @param {string} role - User role
 * @returns {string} Path to redirect to
 */
export const getRoleRedirectPath = (role) => {
  switch (role) {
    case "VENDOR_MANAGER":
      return "/user";
    case "BUSINESS_USER":
      return "/business-user/digital-initiative";
    case "IT_VENDOR":
      return "/vendor/payments";
    default:
      return "/login"; // Let middleware handle it
  }
};

/**
 * Handle role-based redirection
 * @param {string} role - User role
 * @param {function} router - Next.js router
 * @returns {void}
 */
export const handleRoleBasedRedirect = (role) => {
  const path = getRoleRedirectPath(role);
  window.location.href = path;
};

/**
 * Clear all authentication data (cookies and localStorage).
 * 
 * Uses our own Next.js API route (/api/auth/clear-session) to clear
 * HTTP-Only cookies. This avoids the circular dependency where the
 * backend's /auth/logout requires a valid (non-expired) token.
 * 
 * Returns a Promise so callers can await before redirecting.
 */
export const clearAuthData = async () => {
  // 1. Clear the role cookie from JS (this one is accessible)
  document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // 2. Clear localStorage
  localStorage.removeItem("zelosify_user");

  // 3. Call our Next.js API route to clear HTTP-Only cookies server-side
  //    This runs on the SAME origin, so it can clear cookies without auth.
  try {
    await fetch("/api/auth/clear-session", {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {
    // If this fails, we still redirect — cookies will be stale but
    // the middleware will see them as expired JWT and redirect to login anyway.
    console.error("Failed to clear session cookies:", e);
  }
};
