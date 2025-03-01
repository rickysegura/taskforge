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
  getDoc,
} from "firebase/firestore";

export const dynamic = "force-dynamic";

export default function TaskList() {
  const [taskText, setTaskText] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskCategory, setTaskCategory] = useState("General");
  const [tasks, setTasks] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [pendingUsername, setPendingUsername] = useState("");
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editCategory, setEditCategory] = useState("General");
  const router = useRouter();

  const priorityOptions = ["High", "Medium", "Low"];
  const priorityColors = {
    High: isDarkMode ? "text-red-400" : "text-red-500",
    Medium: isDarkMode ? "text-yellow-400" : "text-yellow-500",
    Low: isDarkMode ? "text-green-400" : "text-green-500",
  };
  const categoryOptions = ["General", "Work", "Personal", "Urgent"];
  const categoryColors = {
    General: isDarkMode ? "text-gray-300" : "text-gray-600",
    Work: isDarkMode ? "text-blue-400" : "text-blue-500",
    Personal: isDarkMode ? "text-purple-400" : "text-purple-500",
    Urgent: isDarkMode ? "text-orange-400" : "text-orange-500",
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const groupedTasks = categoryOptions.reduce((acc, category) => {
    acc[category] = tasks
      .filter((task) => (task.category || "General") === category)
      .sort((a, b) => {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        const priorityDiff = priorityOrder[b.priority || "Medium"] - priorityOrder[a.priority || "Medium"];
        return priorityDiff !== 0 ? priorityDiff : b.createdAt.localeCompare(a.createdAt);
      });
    return acc;
  }, {});

  useEffect(() => {
    let unsubscribeTasks = null;
    let unsubscribePrefs = null;
    let unsubscribeUser = null;

    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        if (unsubscribeTasks) unsubscribeTasks();
        if (unsubscribePrefs) unsubscribePrefs();
        if (unsubscribeUser) unsubscribeUser();
        setTasks([]);
        setIsDarkMode(false);
        setUsername("");
        setPendingUsername("");
        router.push("/auth");
        return;
      }

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

      const prefDocRef = doc(db, "preferences", currentUser.uid);
      unsubscribePrefs = onSnapshot(
        prefDocRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            setIsDarkMode(docSnapshot.data().darkMode || false);
          } else {
            setDoc(prefDocRef, { darkMode: false }, { merge: true });
            setIsDarkMode(false);
          }
        },
        (error) => {
          console.error("Error fetching preferences:", error);
          setIsDarkMode(false);
        }
      );

      const userDocRef = doc(db, "users", currentUser.uid);
      unsubscribeUser = onSnapshot(
        userDocRef,
        (docSnapshot) => {
          if (docSnapshot.exists() && docSnapshot.data().username) {
            setUsername(docSnapshot.data().username);
            setPendingUsername(docSnapshot.data().username);
            setShowUsernameInput(false);
          } else {
            setUsername("");
            setPendingUsername("");
            setShowUsernameInput(true);
          }
        },
        (error) => {
          console.error("Error fetching username:", error);
          setUsername("");
          setPendingUsername("");
        }
      );
    });

    return () => {
      if (unsubscribeTasks) unsubscribeTasks();
      if (unsubscribePrefs) unsubscribePrefs();
      if (unsubscribeUser) unsubscribeUser();
      unsubscribeAuth();
    };
  }, [router]);

  const handleSetUsername = async () => {
    const trimmedUsername = pendingUsername.trim();
    if (!trimmedUsername || !user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        await setDoc(userDocRef, {
          username: trimmedUsername,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        await setDoc(
          userDocRef,
          {
            username: trimmedUsername,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
      setUsername(trimmedUsername);
      setShowUsernameInput(false);
    } catch (error) {
      console.error("Error setting username:", error);
      alert("Failed to set username.");
    }
  };

  const cancelUsernameEdit = () => {
    setPendingUsername(username);
    setShowUsernameInput(false);
  };

  const handleAddTask = async () => {
    const trimmedTask = taskText.trim();
    if (!trimmedTask || !user) return;
    try {
      await addDoc(collection(db, "tasks"), {
        text: trimmedTask,
        completed: false,
        priority: taskPriority,
        category: taskCategory,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      });
      setTaskText("");
      setTaskPriority("Medium");
      setTaskCategory("General");
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

  const startEditing = (id, text, priority, category) => {
    setEditingTaskId(id);
    setEditText(text);
    setEditPriority(priority || "Medium");
    setEditCategory(category || "General");
  };

  const saveEdit = async (id) => {
    const trimmedText = editText.trim();
    if (!trimmedText || !user) {
      setEditingTaskId(null);
      return;
    }
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { 
        text: trimmedText, 
        priority: editPriority, 
        category: editCategory 
      });
      setEditingTaskId(null);
      setEditText("");
      setEditPriority("Medium");
      setEditCategory("General");
    } catch (error) {
      console.error("Error editing task:", error);
      alert("Failed to edit task.");
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditText("");
    setEditPriority("Medium");
    setEditCategory("General");
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setTasks([]);
      setUser(null);
      setIsDarkMode(false);
      setUsername("");
      setPendingUsername("");
      router.push("/auth");
    } catch (error) {
      console.error("Sign-out error:", error);
      alert("Failed to sign out.");
    }
  };

  const toggleDarkMode = async () => {
    if (!user) return;
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    try {
      const prefDocRef = doc(db, "preferences", user.uid);
      await setDoc(prefDocRef, { darkMode: newMode }, { merge: true });
    } catch (error) {
      console.error("Error saving dark mode preference:", error);
      setIsDarkMode(false);
      alert("Failed to save dark mode preference.");
    }
  };

  if (!user) {
    return null;
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
        className={`w-full max-w-2xl p-4 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-300 ${
          isDarkMode ? "bg-gray-800 bg-opacity-70 text-white" : "bg-white bg-opacity-80 text-gray-800"
        }`}
      >
        <div className="mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
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
          {showUsernameInput ? (
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
              <input
                type="text"
                value={pendingUsername}
                onChange={(e) => setPendingUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSetUsername()}
                className={`w-full sm:flex-1 p-2 sm:p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-opacity-50 ${
                  isDarkMode ? "bg-gray-600 text-white placeholder-gray-400" : "bg-gray-200 text-gray-800 placeholder-gray-500"
                }`}
                placeholder="Set your username..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSetUsername}
                  className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                    isDarkMode ? "bg-teal-500 hover:bg-teal-600" : "bg-teal-600 hover:bg-teal-700"
                  } text-white`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={cancelUsernameEdit}
                  className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                    isDarkMode ? "text-gray-400 hover:bg-gray-400 hover:text-white" : "text-gray-500 hover:bg-gray-500 hover:text-white"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <p
              className={`mt-2 text-lg font-medium flex items-center gap-2 ${
                isDarkMode ? "text-gray-300" : "text-teal-600"
              }`}
            >
              Welcome, {username || user.email}
              <button
                onClick={() => setShowUsernameInput(true)}
                className={`text-sm hover:underline transition-colors ${
                  isDarkMode ? "text-teal-400" : "text-teal-600"
                }`}
              >
                (Edit)
              </button>
            </p>
          )}
          {totalTasks > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Progress: {completedTasks}/{totalTasks} ({progressPercentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                <div
                  className={`h-4 rounded-full transition-all duration-300 ${
                    isDarkMode ? "bg-teal-500" : "bg-teal-600"
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        {/* Task Input Section */}
        <div className="relative mb-8 flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            className={`w-full p-3 sm:p-4 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-opacity-50 ${
              isDarkMode
                ? "bg-gray-700 bg-opacity-70 text-white placeholder-gray-400"
                : "bg-gray-100 text-gray-800 placeholder-gray-500"
            }`}
            placeholder="Add a new task..."
          />
          <div className="flex w-full sm:w-auto gap-4">
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              className={`w-full sm:w-24 p-2 sm:p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
              }`}
            >
              {priorityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={taskCategory}
              onChange={(e) => setTaskCategory(e.target.value)}
              className={`w-full sm:w-24 p-2 sm:p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
              }`}
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddTask}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                isDarkMode ? "bg-teal-500 hover:bg-teal-600" : "bg-teal-600 hover:bg-teal-700"
              } text-white`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
        <div className="space-y-6">
          {categoryOptions.map((category) => (
            groupedTasks[category].length > 0 && (
              <div key={category}>
                <h2
                  className={`text-lg sm:text-xl font-semibold mb-2 ${categoryColors[category]}`}
                >
                  {category}
                </h2>
                <ul className="space-y-6">
                  {groupedTasks[category].map((task) => (
                    <li
                      key={task.id}
                      className={`relative flex items-center gap-4 p-4 sm:p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
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
                      <span className={`w-16 sm:w-20 ${priorityColors[task.priority || "Medium"]}`}>
                        {task.priority || "Medium"}
                      </span>
                      <span
                        className={`flex-1 text-base sm:text-lg font-medium transition-all duration-300 ${
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
                      {!task.completed && editingTaskId !== task.id && (
                        <button
                          onClick={() => startEditing(task.id, task.text, task.priority, task.category)}
                          className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                            isDarkMode ? "text-yellow-400 hover:bg-yellow-400 hover:text-white" : "text-yellow-500 hover:bg-yellow-500 hover:text-white"
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      {editingTaskId !== task.id && (
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
                      )}
                      {editingTaskId === task.id && (
                        <div className={`absolute inset-0 bg-opacity-90 flex items-center justify-center p-4 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && saveEdit(task.id)}
                              className={`w-full p-2 sm:p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                                isDarkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-800"
                              }`}
                            />
                            <div className="flex w-full sm:w-auto gap-2">
                              <select
                                value={editPriority}
                                onChange={(e) => setEditPriority(e.target.value)}
                                className={`w-full sm:w-24 p-2 sm:p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                                  isDarkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-800"
                                }`}
                              >
                                {priorityOptions.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              <select
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                                className={`w-full sm:w-24 p-2 sm:p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                                  isDarkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-800"
                                }`}
                              >
                                {categoryOptions.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => saveEdit(task.id)}
                                className={`p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                                  isDarkMode ? "text-green-400 hover:bg-green-400 hover:text-white" : "text-green-500 hover:bg-green-500 hover:text-white"
                                }`}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={cancelEdit}
                                className={`p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                                  isDarkMode ? "text-gray-400 hover:bg-gray-400 hover:text-white" : "text-gray-500 hover:bg-gray-500 hover:text-white"
                                }`}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))}
          {totalTasks === 0 && (
            <p className="text-center text-gray-500">No tasks yet</p>
          )}
        </div>
      </div>
    </div>
  );
}