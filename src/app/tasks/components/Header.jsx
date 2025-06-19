export default function Header({ isDarkMode, toggleDarkMode, handleSignOut }) {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 hover:scale-110">
            <path d="M10 10H30V30H10V10Z" stroke="#2dd4bf" strokeWidth="4" />
            <path d="M15 15H25" stroke="#2dd4bf" strokeWidth="2" />
            <path d="M15 20H25" stroke="#2dd4bf" strokeWidth="2" />
            <path d="M15 25H20" stroke="#2dd4bf" strokeWidth="2" />
          </svg>
          
          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${ isDarkMode ? "text-teal-400" : "text-teal-600" }`}>TaskForge</h1>
          
          <div className="flex gap-4 items-center">
            <button onClick={toggleDarkMode} className={`p-2 rounded-full hover:bg-opacity-20 transition-colors ${ isDarkMode ? "text-teal-400 hover:bg-teal-400" : "text-teal-600 hover:bg-teal-600" }`}>
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

            <button onClick={handleSignOut} className={`text-sm hover:underline transition-colors ${ isDarkMode ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-700" }`}>Sign Out</button>
          </div>
        </div>
      </div>
    );
}
