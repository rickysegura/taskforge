"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
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
import Header from "./components/Header";
import UsernameInput from "./components/UsernameInput";
import ProgressBar from "./components/ProgressBar";
import TaskInput from "./components/TaskInput";
import TaskCategory from "./components/TaskCategory";
import CompletedTasks from "./components/CompletedTasks";

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
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [lastPasswordChange, setLastPasswordChange] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showReauth, setShowReauth] = useState(false);
  const router = useRouter();

  const priorityOptions = ["High", "Medium", "Low"];
  const categoryOptions = ["General", "Work", "Personal", "Urgent"];

  const priorityColors = {
    High: isDarkMode ? "text-red-400" : "text-red-500",
    Medium: isDarkMode ? "text-yellow-400" : "text-yellow-500",
    Low: isDarkMode ? "text-green-400" : "text-green-500",
  };
  const categoryColors = {
    General: isDarkMode ? "text-gray-300" : "text-gray-600",
    Work: isDarkMode ? "text-blue-400" : "text-blue-500",
    Personal: isDarkMode ? "text-purple-400" : "text-purple-500",
    Urgent: isDarkMode ? "text-orange-400" : "text-orange-500",
  };

  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  const groupedTasks = categoryOptions.reduce((acc, category) => {
    acc[category] = tasks
      .filter((task) => (task.category || "General") === category && !task.completed) // Filter out completed tasks
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
        setLastPasswordChange("");
        router.push("/auth");
        return;
      }

      const tasksQuery = query(collection(db, "tasks"), where("uid", "==", currentUser.uid));
      unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
      }, (error) => {
        console.error("Error fetching tasks:", error);
        if (error.code === "permission-denied") {
          setTasks([]);
          router.push("/auth");
        }
      });

      const prefDocRef = doc(db, "preferences", currentUser.uid);
      unsubscribePrefs = onSnapshot(prefDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setIsDarkMode(docSnapshot.data().darkMode || false);
        } else {
          setDoc(prefDocRef, { darkMode: false }, { merge: true });
          setIsDarkMode(false);
        }
      }, (error) => {
        console.error("Error fetching preferences:", error);
        setIsDarkMode(false);
      });

      const userDocRef = doc(db, "users", currentUser.uid);
      unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setUsername(data.username || "");
          setPendingUsername(data.username || "");
          setLastPasswordChange(data.lastPasswordChange || "Never");
          setShowUsernameInput(!data.username);
        } else {
          setUsername("");
          setPendingUsername("");
          setLastPasswordChange("Never");
          setShowUsernameInput(true);
        }
      }, (error) => {
        console.error("Error fetching user data:", error);
        setUsername("");
        setPendingUsername("");
        setLastPasswordChange("Never");
      });
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
          lastPasswordChange: "Never",
        });
      } else {
        await setDoc(userDocRef, { username: trimmedUsername, updatedAt: new Date().toISOString() }, { merge: true });
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
      await updateDoc(taskRef, { text: trimmedText, priority: editPriority, category: editCategory });
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
      setLastPasswordChange("");
      router.push("/login");
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

  const handlePasswordChange = async () => {
    if (!user || !newPassword) return;
    try {
      await updatePassword(user, newPassword);
      const userDocRef = doc(db, "users", user.uid);
      const timestamp = new Date().toISOString();
      await setDoc(
        userDocRef,
        { lastPasswordChange: timestamp, updatedAt: timestamp },
        { merge: true }
      );
      setLastPasswordChange(timestamp);
      setNewPassword("");
      setShowPasswordChange(false);
      alert("Password updated successfully!");
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        setShowReauth(true);
      } else if (error.code === "auth/weak-password") {
        alert("Password must be at least 6 characters long.");
      } else {
        console.error("Error updating password:", error);
        alert("Failed to update password.");
      }
    }
  };

  const handleReauthenticate = async () => {
    if (!user || !currentPassword) return;
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await handlePasswordChange();
      setCurrentPassword("");
      setShowReauth(false);
    } catch (error) {
      console.error("Re-authentication error:", error);
      if (error.code === "auth/wrong-password") {
        alert("Incorrect current password.");
      } else {
        alert("Failed to re-authenticate. Please try again.");
      }
    }
  };

  const cancelPasswordChange = () => {
    setNewPassword("");
    setShowPasswordChange(false);
    setCurrentPassword("");
    setShowReauth(false);
  };

  if (!user) return null;

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
        <Header
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          handleSignOut={handleSignOut}
        />
        {showUsernameInput ? (
          <UsernameInput
            pendingUsername={pendingUsername}
            setPendingUsername={setPendingUsername}
            handleSetUsername={handleSetUsername}
            cancelUsernameEdit={cancelUsernameEdit}
            isDarkMode={isDarkMode}
          />
        ) : (
          <>
            <p
              className={`mt-2 text-lg font-medium flex items-center gap-2 ${
                isDarkMode ? "text-gray-300" : "text-teal-600"
              }`}
            >
              {username || user.email}
              <button
                onClick={() => setShowUsernameInput(true)}
                className={`text-sm hover:underline transition-colors ${
                  isDarkMode ? "text-teal-400" : "text-teal-600"
                }`}
              >
                (Edit)
              </button>
              <button
                onClick={() => setShowPasswordChange(true)}
                className={`text-sm hover:underline transition-colors ${
                  isDarkMode ? "text-teal-400" : "text-teal-600"
                }`}
              >
                (Change Password)
              </button>
            </p>
            <p
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Email: {user.email}
            </p>
            <p
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Last password change: {lastPasswordChange === "Never" ? "Never" : new Date(lastPasswordChange).toLocaleString()}
            </p>
          </>
        )}
        {showPasswordChange && !showReauth && (
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePasswordChange()}
              className={`w-full sm:flex-1 p-2 sm:p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-opacity-50 ${
                isDarkMode ? "bg-gray-600 text-white placeholder-gray-400" : "bg-gray-200 text-gray-800 placeholder-gray-500"
              }`}
              placeholder="Enter new password..."
            />
            <div className="flex gap-2">
              <button
                onClick={handlePasswordChange}
                className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  isDarkMode ? "bg-teal-500 hover:bg-teal-600" : "bg-teal-600 hover:bg-teal-700"
                } text-white`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={cancelPasswordChange}
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
        )}
        {showReauth && (
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReauthenticate()}
              className={`w-full sm:flex-1 p-2 sm:p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-opacity-50 ${
                isDarkMode ? "bg-gray-600 text-white placeholder-gray-400" : "bg-gray-200 text-gray-800 placeholder-gray-500"
              }`}
              placeholder="Enter current password to verify..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleReauthenticate}
                className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  isDarkMode ? "bg-teal-500 hover:bg-teal-600" : "bg-teal-600 hover:bg-teal-700"
                } text-white`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={cancelPasswordChange}
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
        )}
        <div className="space-y-6">
          <ProgressBar
            completedTasks={completedTasksCount}
            totalTasks={totalTasks}
            progressPercentage={progressPercentage}
            isDarkMode={isDarkMode}
          />
          <TaskInput
            taskText={taskText}
            setTaskText={setTaskText}
            taskPriority={taskPriority}
            setTaskPriority={setTaskPriority}
            taskCategory={taskCategory}
            setTaskCategory={setTaskCategory}
            handleAddTask={handleAddTask}
            priorityOptions={priorityOptions}
            categoryOptions={categoryOptions}
            isDarkMode={isDarkMode}
          />
        </div>
        <div className="mt-6 space-y-6">
          {categoryOptions.map((category) => (
            <TaskCategory
              key={category}
              category={category}
              tasks={groupedTasks[category]}
              priorityColors={priorityColors}
              categoryColors={categoryColors}
              isDarkMode={isDarkMode}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
              startEditing={startEditing}
              editingTaskId={editingTaskId}
              editText={editText}
              setEditText={setEditText}
              editPriority={editPriority}
              setEditPriority={setEditPriority}
              editCategory={editCategory}
              setEditCategory={setEditCategory}
              saveEdit={saveEdit}
              cancelEdit={cancelEdit}
              priorityOptions={priorityOptions}
              categoryOptions={categoryOptions}
            />
          ))}
          {totalTasks === 0 && (
            <p className="text-center text-gray-500">No tasks yet</p>
          )}
        </div>
        <CompletedTasks
          tasks={tasks}
          priorityColors={priorityColors}
          isDarkMode={isDarkMode}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          startEditing={startEditing}
          editingTaskId={editingTaskId}
          editText={editText}
          setEditText={setEditText}
          editPriority={editPriority}
          setEditPriority={setEditPriority}
          editCategory={editCategory}
          setEditCategory={setEditCategory}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          priorityOptions={priorityOptions}
          categoryOptions={categoryOptions}
        />
      </div>
    </div>
  );
}
