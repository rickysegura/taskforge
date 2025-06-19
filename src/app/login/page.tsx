"use client";

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import { FormEvent } from 'react';
import Link from "next/link";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/tasks");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleEmailAuth = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Registration successful, redirecting to /tasks");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Sign-in successful, redirecting to /tasks");
      }
      router.push("/tasks");
    } catch (err:any) {
      setError(err.message);
      console.error(isRegistering ? "Registration error:" : "Sign-in error:", err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log("Google sign-in successful, redirecting to /tasks");
      router.push("/tasks");
    } catch (err:any) {
      setError(err.message);
      console.error("Google sign-in error:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-blue-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white bg-opacity-80 text-gray-800">
        {/* Taskforge Logo and Title */}
        <div className="flex items-center justify-center mb-6">
          <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 hover:scale-110">
            <path d="M10 10H30V30H10V10Z" stroke="#2dd4bf" strokeWidth="4" />
            <path d="M15 15H25" stroke="#2dd4bf" strokeWidth="2" />
            <path d="M20 20H25" stroke="#2dd4bf" strokeWidth="2" />
            <path d="M15 25H20" stroke="#2dd4bf" strokeWidth="2" />
          </svg>
          
          <h1 className="text-4xl font-extrabold text-teal-600 ml-3">Taskforge</h1>
        </div>

        {/* Subtitle */}
        <p className="text-center text-gray-600 mb-6">
          {isRegistering ? "Create an account" : "Sign in to your dashboard"}
        </p>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-4 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400" required/>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-4 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400" required/>
          
          <button type="submit" className="w-full py-4 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition-all">
            {isRegistering ? "Create Account" : "Sign In"}
          </button>
        </form>

        {/* Google Sign-In Button */}
        <button onClick={handleGoogleSignIn} className="w-full mt-4 py-3 px-4 rounded flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-roboto transition-all">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.04.7-2.38 1.11-3.71 1.11-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.07 7.77 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.77 1 4.01 3.93 2.18 7.07L5.84 9.91c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          
          <span className="text-base">{isRegistering ? "Sign up with Google" : "Sign in with Google"}</span>
        </button>

        {/* Toggle between Sign In and Register */}
        <div className="text-center mt-4">
          <button onClick={() => setIsRegistering(!isRegistering)} className="text-teal-600 hover:underline transition-colors">
            {isRegistering ? "Already have an account? Sign In" : "Need an account? Create one"}
          </button>
        </div>

        {/* Back to Landing Page */}
        <div className="text-center mt-4">
          <Link href="/" className="text-teal-600 hover:underline transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
