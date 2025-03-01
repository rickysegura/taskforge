export default function TaskItem({
    task,
    priorityColors,
    isDarkMode,
    toggleTask,
    deleteTask,
    startEditing,
    editingTaskId,
    editText,
    setEditText,
    editPriority,
    setEditPriority,
    editCategory,
    setEditCategory,
    saveEdit,
    cancelEdit,
    priorityOptions,
    categoryOptions,
  }) {
    return (
      <li
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
    );
}
