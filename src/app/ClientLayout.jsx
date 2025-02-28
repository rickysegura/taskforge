"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ClientLayout({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPath = useRef(null);

  useEffect(() => {
    const currentPath = `${pathname}${searchParams.toString() ? `?${searchParams}` : ""}`;

    // If there's a previous path and it differs from the current path, show loading
    if (previousPath.current !== null && previousPath.current !== currentPath) {
      setIsLoading(true);

      // Simulate loading completion after a short delay (adjust as needed)
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500); // 500ms delay, tweak this based on your app’s latency

      return () => clearTimeout(timer);
    }

    // Update previous path
    previousPath.current = currentPath;
  }, [pathname, searchParams]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <svg
            className="animate-spin h-12 w-12 text-teal-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      {children}
    </>
  );
}