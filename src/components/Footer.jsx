import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-black/40 px-6 py-8 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center text-slate-300 md:flex-row md:text-left">
        
        {/* Branding */}
        <div>
          <h1 className="text-2xl font-semibold tracking-[0.2em] text-slate-100">
            PLAYS<span className="text-amber-300">GO</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Find your game. Find your people.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-6 text-sm font-medium text-slate-400">
          <a href="/" className="transition-colors duration-200 hover:text-amber-300">
            Home
          </a>
          <a href="/about" className="transition-colors duration-200 hover:text-amber-300">
            About
          </a>
          <a href="/createpost" className="transition-colors duration-200 hover:text-amber-300">
            Post
          </a>
          <a href="/profile" className="transition-colors duration-200 hover:text-amber-300">
            Profile
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 text-xl text-slate-400">
          <a
            href="https://github.com/chandanrx"
            className="transition-all duration-200 hover:text-amber-300"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/yourusername/chandan-pargi-459272187"
            className="transition-all duration-200 hover:text-amber-300"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://twitter.com/rxn_13"
            className="transition-all duration-200 hover:text-amber-300"
          >
            <FaTwitter />
          </a>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-6 border-t border-white/5 pt-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} PlaysGo. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
