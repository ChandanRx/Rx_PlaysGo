import { Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import AppShell from "../components/AppShell";
import CategoryThemeSync from "../components/CategoryThemeSync";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata = {
  title: "Plays Go",
  description:
    "Post, discover, and connect with local opportunities, services, events, and people nearby.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <Suspense fallback={null}>
          <CategoryThemeSync />
          <AppShell>{children}</AppShell>
        </Suspense>
      </body>
    </html>
  );
}
