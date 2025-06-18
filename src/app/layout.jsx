import "./globals.css";

export const metadata = {
  title: "TaskForge",
  description: "A web app built by Ricky Segura",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}