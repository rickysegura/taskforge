import Link from "next/link";

export default function Footer() {
 const xHandle:string = "@TaskForgeApp_";

 return (
 <footer className="p-6 shadow-xl backdrop-blur-md bg-gray-800 bg-opacity-80 text-white text-center">
    <div className="flex justify-center items-center gap-4 mb-2">

        <a
        href={`https://x.com/${xHandle.slice(1)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-teal-400 hover:text-teal-300 transition-colors duration-300"
        >
            <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="hover:scale-110 transition-transform duration-300"
            >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        </a>

        <Link href="/privacy" className="text-teal-400 hover:text-teal-300 transition-colors duration-300">Privacy Policy</Link>
        <Link href="/terms" className="text-teal-400 hover:text-teal-300 transition-colors duration-300">Terms of Service</Link>

        <p className="text-lg">© 2025 TaskForge. All rights reserved.</p>
    </div>
 </footer>
 );
}