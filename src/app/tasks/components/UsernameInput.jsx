export default function UsernameInput({
    pendingUsername,
    setPendingUsername,
    handleSetUsername,
    cancelUsernameEdit,
    isDarkMode,
  }) {
    return (
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
    );
}
