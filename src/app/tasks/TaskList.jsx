"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  doc,
  setDoc,
} from "firebase/firestore";

export const dynamic = "force-dynamic";

export default function TaskList() {
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false); // Local dark mode state
  const [user, setUser] = useState(null); // Track user state
  const router = useRouter();

  useEffect(() => {
    let unsubscribeTasks = null;
    let unsubscribePrefs = null;

    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        if (unsubscribeTasks) unsubscribeTasks();
        if (unsubscribePrefs) unsubscribePrefs();
        setTasks([]);
        setIsDarkMode(false); // Reset to light mode on sign-out
        router.push("/auth");
        return;
      }

      // Fetch tasks
      const tasksQuery = query(collection(db, "tasks"), where("uid", "==", currentUser.uid));
      unsubscribeTasks = onSnapshot(
        tasksQuery,
        (snapshot) => {
          const tasksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(tasksData);
        },
        (error) => {
          console.error("Error fetching tasks:", error);
          if (error.code === "permission-denied") {
            setTasks([]);
            router.push("/auth");
          }
        }
      );

      // Fetch and sync dark mode preference
      const prefDocRef = doc(db, "preferences", currentUser.uid);
      unsubscribePrefs = onSnapshot(
        prefDocRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            setIsDarkMode(docSnapshot.data().darkMode || false);
          } else {
            // Initialize with default if document doesn’t exist
            setDoc(prefDocRef, { darkMode: false }, { merge: true });
            setIsDarkMode(false);
          }
        },
        (error) => {
          console.error("Error fetching preferences:", error);
          setIsDarkMode(false); // Fallback to light mode on error
        }
      );
    });

    return () => {
      if (unsubscribeTasks) unsubscribeTasks();
      if (unsubscribePrefs) unsubscribePrefs();
      unsubscribeAuth();
    };
  }, [router]);

  const handleAddTask = async () => {
    const trimmedTask = taskText.trim();
    if (!trimmedTask || !user) return;
    try {
      await addDoc(collection(db, "tasks"), {
        text: trimmedTask,
        completed: false,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      });
      setTaskText("");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task.");
    }
  };

  const toggleTask = async (id, currentCompleted) => {
    if (!user) return;
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { completed: !currentCompleted });
    } catch (error) {
      console.error("Error toggling task:", error);
      alert("Failed to toggle task.");
    }
  };

  const deleteTask = async (id) => {
    if (!user) return;
    try {
      const taskRef = doc(db, "tasks", id);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setTasks([]);
      setUser(null);
      setIsDarkMode(false); // Reset dark mode on sign-out
      router.push("/"); // Redirect to landing page
    } catch (error) {
      console.error("Sign-out error:", error);
      alert("Failed to sign out.");
    }
  };

  const toggleDarkMode = async () => {
    if (!user) return;
    const newMode = !isDarkMode;
    setIsDarkMode(newMode); // Optimistic update
    try {
      const prefDocRef = doc(db, "preferences", user.uid);
      await setDoc(prefDocRef, { darkMode: newMode }, { merge: true });
    } catch (error) {
      console.error("Error saving dark mode preference:", error);
      setIsDarkMode(false); // Revert on error
      alert("Failed to save dark mode preference.");
    }
  };

  if (!user) {
    return null; // Prevent rendering during redirect
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-teal-100 via-blue-200 to-purple-200 text-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-2xl p-8 rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-300 ${
          isDarkMode ? "bg-gray-800 bg-opacity-70 text-white" : "bg-white bg-opacity-80 text-gray-800"
        }`}
      >
        <div className="mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1
              className={`text-4xl font-extrabold tracking-tight ${
                isDarkMode ? "text-teal-400" : "text-teal-600"
              }`}
            >
              TaskForge
            </h1>
            <div className="flex gap-4 items-center">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full hover:bg-opacity-20 transition-colors ${
                  isDarkMode ? "text-teal-400 hover:bg-teal-400" : "text-teal-600 hover:bg-teal-600"
                }`}
              >
                {isDarkMode ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleSignOut}
                className={`text-sm hover:underline transition-colors ${
                  isDarkMode ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-700"
                }`}
              >
                Sign Out
              </button>
            </div>
          </div>
          <p
            className={`mt-2 text-lg font-medium ${
              isDarkMode ? "text-gray-300" : "text-teal-600"
            }`}
          >
            Welcome, {user?.email || "User"}
          </p>
        </div>
        <div className="relative mb-8">
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            className={`w-full p-4 pr-12 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-opacity-50 ${
              isDarkMode
                ? "bg-gray-700 bg-opacity-70 text-white placeholder-gray-400"
                : "bg-gray-100 text-gray-800 placeholder-gray-500"
            }`}
            placeholder="Add a new task..."
          />
          <button
            onClick={handleAddTask}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 hover:scale-110 ${
              isDarkMode ? "bg-teal-500 hover:bg-teal-600" : "bg-teal-600 hover:bg-teal-700"
            } text-white`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                isDarkMode ? "bg-gray-700 bg-opacity-70 text-white" : "bg-gray-50 bg-opacity-70 text-gray-800"
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id, task.completed)}
                className={`h-6 w-6 rounded-full text-teal-500 focus:ring-teal-400 transition-all duration-200 ${
                  isDarkMode ? "bg-gray-600" : "bg-white"
                }`}
              />
              <span
                className={`flex-1 text-lg font-medium transition-all duration-300 ${
                  task.completed
                    ? isDarkMode
                      ? "line-through text-gray-500 opacity-70"
                      : "line-through text-gray-400 opacity-70"
                    : isDarkMode
                    ? "text-white"
                    : "text-gray-800"
                }`}
              >
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  isDarkMode
                    ? "text-red-400 hover:bg-red-400 hover:text-white"
                    : "text-red-500 hover:bg-red-500 hover:text-white"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}