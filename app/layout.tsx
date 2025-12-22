import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HILDA - Human In the Loop Deployment Agent",
  description: "Intelligent deployment workflows with human oversight",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
