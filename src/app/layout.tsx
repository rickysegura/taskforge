import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "TaskForge",
  description: "A web app built by Ricky Segura",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
