"use client";

import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import TaskList from "./TaskList";

export const dynamic = "force-dynamic";

export default function Tasks() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-100 to-blue-200 flex items-center justify-center">
        <p className="text-teal-600 text-lg">Loading...</p>
      </div>
    );
  }

  return <TaskList />;
}