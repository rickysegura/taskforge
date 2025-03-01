export default function TaskInput({
    taskText,
    setTaskText,
    taskPriority,
    setTaskPriority,
    taskCategory,
    setTaskCategory,
    handleAddTask,
    priorityOptions,
    categoryOptions,
    isDarkMode,
  }) {
    return (
      <div className="relative mb-8 mt-6 flex flex-col md:flex-row items-center gap-4">
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
    );
}
