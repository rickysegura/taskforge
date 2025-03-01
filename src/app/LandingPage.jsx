"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/tasks");
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-blue-200 to-purple-200">
        <p className="text-teal-600 text-lg">Loading...</p>
      </div>
    );
  }

  const features = [
    {
      title: "Simple Task Management",
      desc: "Easily add, edit, and complete tasks with a clean, intuitive interface.",
      icon: <path d="M15 25 L20 35 L40 15" stroke="#2dd4bf" strokeWidth="4" strokeLinecap="round" />,
    },
    {
      title: "Secure Authentication",
      desc: "Sign in securely with email or Google, keeping your tasks safe.",
      icon: <path d="M15 25 L20 35 L40 15" stroke="#2dd4bf" strokeWidth="4" strokeLinecap="round" />,
    },
    {
      title: "Persistent Storage",
      desc: "Your tasks sync with TaskForge, always there when you return.",
      icon: <path d="M15 25 L20 35 L40 15" stroke="#2dd4bf" strokeWidth="4" strokeLinecap="round" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-blue-200 to-purple-200 text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center p-6 shadow-xl backdrop-blur-md bg-white bg-opacity-80">
        <div className="flex items-center gap-3 animate-fadeIn">
          <svg
            width="48"
            height="48"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 hover:scale-110"
          >
            <path d="M10 10H30V30H10V10Z" stroke="#2dd4bf" strokeWidth="4" />
            <path d="M15 15H25" stroke="#2dd4bf" strokeWidth="2" />
            <path d="M15 20H25" stroke="#2dd4bf" strokeWidth="2" />
            <path d="M15 25H20" stroke="#2dd4bf" strokeWidth="2" />
          </svg>
          <h1 className="text-3xl font-extrabold tracking-tight text-teal-600">TaskForge</h1>
        </div>
        <div className="flex gap-4 items-center">
          <Link
            href="/auth"
            className="px-6 py-2 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between p-10 mx-6 mt-6">
        <div className="max-w-md animate-fadeIn">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 text-gray-800">
            Forge Your Productivity
          </h2>
          <p className="text-xl font-medium mb-8 text-gray-600">
            Organize your tasks, stay on track, and boost your efficiency with
            TaskForge—your ultimate productivity companion.
          </p>
          <Link
            href="/auth"
            className="inline-block px-8 py-4 rounded-full text-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Start Now
          </Link>
        </div>
        <div
          className="mt-10 md:mt-0 md:ml-10 transform hover:scale-105 transition-transform duration-300 animate-fadeIn"
          style={{ animationDelay: "0.5s" }}
        >
          <svg width="350" height="350" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="50" y="50" width="200" height="200" rx="15" fill="#e6fffa" stroke="#2dd4bf" strokeWidth="5" />
            <path d="M80 80H220" stroke="#2dd4bf" strokeWidth="5" strokeLinecap="round" />
            <path d="M80 120H220" stroke="#2dd4bf" strokeWidth="5" strokeLinecap="round" />
            <path d="M80 160H180" stroke="#2dd4bf" strokeWidth="5" strokeLinecap="round" />
            <circle cx="260" cy="40" r="35" fill="#2dd4bf" />
            <path d="M245 25L275 55" stroke="white" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="p-10 rounded-2xl mx-6 shadow-xl backdrop-blur-md bg-white bg-opacity-80">
        <h3 className="text-4xl font-bold text-center mb-12 text-gray-800">Why TaskForge?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md bg-teal-50 bg-opacity-70 text-gray-800 group animate-fadeIn"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <svg
                className="mb-4 transform transition-transform duration-300 group-hover:scale-110"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {feature.icon}
              </svg>
              <h4 className="text-xl font-semibold mb-3 text-teal-600">{feature.title}</h4>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-started" className="p-10 text-center mx-6">
        <h3 className="text-4xl font-bold mb-6 text-gray-800">Ready to Get Started?</h3>
        <p className="text-xl font-medium mb-8 text-gray-600">
          Join TaskForge today and take control of your productivity.
        </p>
        <Link
          href="/auth"
          className="inline-block px-8 py-4 rounded-full text-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          Sign Up Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="p-6 shadow-xl backdrop-blur-md bg-gray-800 bg-opacity-80 text-white text-center">
        <p className="text-lg">© 2025 TaskForge. All rights reserved.</p>
      </footer>
    </div>
  );
}