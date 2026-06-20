import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Plays Go",
  description: "Hello Guys! Search, find, and post for your game players",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-1 py-1 text-zinc-950">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
