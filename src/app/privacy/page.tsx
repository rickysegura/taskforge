import Link from "next/link";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-blue-200 to-purple-200 text-gray-800 flex flex-col">
      <header className="p-6 backdrop-blur-md bg-white bg-opacity-80">
        <div className="flex items-center gap-3 animate-fadeIn">
          <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 hover:scale-110">
            <path d="M10 10H30V30H10V10Z" stroke="#2dd4bf" strokeWidth="4" />
            <path d="M15 15H25" stroke="#2dd4bf" strokeWidth="2" />
            <path d="M15 20H25" stroke="#2dd4bf" strokeWidth="2" />
            <path d="M15 25H20" stroke="#2dd4bf" strokeWidth="2" />
          </svg>

          <Link href="/">
            <h1 className="text-3xl font-extrabold tracking-tight text-teal-600">TaskForge</h1>
          </Link>
        </div>
      </header>

      <main className="flex-grow p-10 mx-6">
        <div className="max-w-4xl mx-auto bg-white bg-opacity-80 p-8 rounded-2xl shadow-xl">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Privacy Policy</h1>
          <p className="text-gray-600 mb-4">Last Updated: March 02, 2025</p>

          <p className="text-gray-600 mb-4">TaskForge ("we", "us", or "our") respects your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use TaskForge, a free, open-source task management application.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">1. Information We Collect</h2>
          <p className="text-gray-600 mb-4">
            - <strong>Account Data:</strong> Email address (via Firebase Authentication).<br />
            - <strong>Task Data:</strong> Task text, categories, and priorities stored in Firestore.<br />
            - <strong>Usage Data:</strong> Optional analytics via Firebase (e.g., page views).
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">2. How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">
            - To provide and improve TaskForge’s task management features.<br />
            - To authenticate users securely via Firebase Authentication.<br />
            - To analyze usage patterns (if analytics are enabled).
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">3. Third-Party Services</h2>
          <p className="text-gray-600 mb-4">We use Firebase (a Google service) for authentication, data storage, and optional analytics. See Firebase’s <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Privacy Policy</a> for details. We do not share your data with other third parties unless required by law.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">4. Data Security</h2>
          <p className="text-gray-600 mb-4">Your data is encrypted in transit and at rest by Firebase. We take reasonable measures to protect it, but no system is 100% secure.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">5. Your Rights</h2>
          <p className="text-gray-600 mb-4">
            - Access or delete your tasks by signing into TaskForge.<br />
            - Delete your account by contacting us (see below).<br />
            - EU/CA residents: Additional rights may apply under GDPR/CCPA.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">6. Contact Us</h2>
          <p className="text-gray-600 mb-4">Questions? Reach us on X: <a href="https://x.com/TaskForgeApp_" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">@TaskForgeApp_</a> or open an issue on <a href="https://github.com/rickysegura/taskforge/issues" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">GitHub</a>.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
