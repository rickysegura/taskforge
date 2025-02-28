"use client";

import { useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between sign-in and register
  const [error, setError] = useState(null);
  const router = useRouter();

  // Redirect authenticated users to tasks
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/tasks");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Handle email sign-in or registration
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Registration successful, redirecting to /tasks");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Sign-in successful, redirecting to /tasks");
      }
      router.push("/tasks");
    } catch (err) {
      setError(err.message);
      console.error(isRegistering ? "Registration error:" : "Sign-in error:", err.message);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log("Google sign-in successful, redirecting to /tasks");
      router.push("/tasks");
    } catch (err) {
      setError(err.message);
      console.error("Google sign-in error:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-blue-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white bg-opacity-80 text-gray-800">
        <h1 className="text-4xl font-extrabold text-teal-600 mb-6">
          {isRegistering ? "Register" : "Sign In"}
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-4 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-4 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />
          <button
            type="submit"
            className="w-full py-4 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition-all"
          >
            {isRegistering ? "Register" : "Sign In"}
          </button>
        </form>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full mt-4 py-4 rounded-full bg-gray-800 text-white hover:bg-gray-900 transition-all"
        >
          Sign In with Google
        </button>

        {/* Toggle between Sign In and Register */}
        <div className="text-center mt-4">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-teal-600 hover:underline transition-colors"
          >
            {isRegistering ? "Already have an account? Sign In" : "Need an account? Register"}
          </button>
        </div>

        {/* Back to Landing Page */}
        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-teal-600 hover:underline transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}