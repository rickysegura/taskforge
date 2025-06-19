import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-teal-100 via-blue-200 to-purple-200 text-gray-800">
      <div className="w-full max-w-lg p-8 rounded-2xl shadow-2xl backdrop-blur-md bg-white bg-opacity-80 text-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold tracking-tight text-teal-600">404 - Not found</h1>
          <p className="mt-4 text-xl font-medium text-gray-600">Oops! The page you're looking for doesn't exist.</p>
        </div>

        <div className="flex justify-center mb-8">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 hover:scale-105">
            <circle cx="100" cy="100" r="80" fill="#e6fffa" stroke="#2dd4bf" strokeWidth="5" />
            <path d="M70 70L130 130M130 70L70 130" stroke="#2dd4bf" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
        
        <div className="text-center">
          <Link href="/" className="inline-block px-8 py-4 rounded-full text-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg bg-teal-600 text-white hover:bg-teal-700">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}