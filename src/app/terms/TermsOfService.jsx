"use client";

import Link from "next/link";
import Footer from "../Footer";

export default function TermsOfService() {
 return (
 <div className="min-h-screen bg-gradient-to-br from-teal-100 via-blue-200 to-purple-200 text-gray-800 flex flex-col">
 <header className="p-6 backdrop-blur-md bg-white bg-opacity-80">
 <div className="flex items-center gap-3 animate-fadeIn">
 <svg
 width="48"
 height="48"
 viewBox="0 0 40 40"
 fill="none"
 xmlns="http://www.w3.org/2000/svg"
 className="transition-transform duration-300 hover:scale-110"
 >
 <path d="M10 10H30V30H10V10Z" stroke="#2dd4bf" strokeWidth="4" />
 <path d="M15 15H25" stroke="#2dd4bf" strokeWidth="2" />
 <path d="M15 20H25" stroke="#2dd4bf" strokeWidth="2" />
 <path d="M15 25H20" stroke="#2dd4bf" strokeWidth="2" />
 </svg>
 <Link href="/"><h1 className="text-3xl font-extrabold tracking-tight text-teal-600">TaskForge</h1></Link>
 </div>
 </header>
 <main className="flex-grow p-10 mx-6">
 <div className="max-w-4xl mx-auto bg-white bg-opacity-80 p-8 rounded-2xl shadow-xl">
 <h1 className="text-4xl font-bold mb-6 text-gray-800">Terms of Service</h1>
 <p className="text-gray-600 mb-4">Last Updated: March 02, 2025</p>
 <p className="text-gray-600 mb-4">
 Welcome to TaskForge ("we", "us", or "our"). By using TaskForge, a free task management service, you agree to these Terms of Service ("Terms"). If you don’t agree, please don’t use the service.
 </p>
 
 <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">1. Use of Service</h2>
 <p className="text-gray-600 mb-4">
 - You must be 13 or older to use TaskForge.<br />
 - Use TaskForge for lawful purposes only. No abuse, harassment, or illegal activities.<br />
 - We may suspend or terminate your account for violations.
 </p>
 
 <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">2. Account Responsibilities</h2>
 <p className="text-gray-600 mb-4">
 - Keep your login credentials secure.<br />
 - You’re responsible for all activity under your account.
 </p>
 
 <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">3. Intellectual Property</h2>
 <p className="text-gray-600 mb-4">
 - TaskForge’s code is open source under the MIT License (see <a href="https://github.com/rickysegura/taskforge/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">GitHub</a>).<br />
 - Your task data remains yours; we claim no ownership.
 </p>
 
 <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">4. Disclaimer of Warranties</h2>
 <p className="text-gray-600 mb-4">
 TaskForge is provided "as is" with no warranties, express or implied, including fitness for a particular purpose or uninterrupted service.
 </p>
 
 <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">5. Limitation of Liability</h2>
 <p className="text-gray-600 mb-4">
 We’re not liable for damages from your use of TaskForge, including data loss or service interruptions, to the extent permitted by law.
 </p>
 
 <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">6. Changes to Terms</h2>
 <p className="text-gray-600 mb-4">
 We may update these Terms. Check back here for changes. Continued use means acceptance.
 </p>
 
 <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">7. Contact Us</h2>
 <p className="text-gray-600 mb-4">
 Questions? Reach us on X: <a href="https://x.com/TaskForgeApp_" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">@TaskForgeApp_</a> or open an issue on <a href="https://github.com/rickysegura/taskforge/issues" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">GitHub</a>.
 </p>
 </div>
 </main>
 <Footer />
 </div>
 );
}
