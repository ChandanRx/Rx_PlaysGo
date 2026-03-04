import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./context/NextAuthProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Plays Go",
  description: "Hello Guys! Search, find, and post for your game players",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-l from-[#4B4B4B] to-[#4B4B4B] min-h-screen flex flex-col">
        <NextAuthProvider>
          <Header />
          <main className="flex-grow container mx-auto px-1 py-1">
            {/* Main Content */}
            <div className="flex flex-col space-y-6">
              {/* Example Children Section */}
              <div className="bg-[#4B4B4B] p-6 rounded-lg shadow-lg text-white">
                {children}
              </div>
            </div>
          </main>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}