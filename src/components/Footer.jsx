"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import PlaysGoLogo from "./PlaysGoLogo";

const navItems = [
  { label: "Home",    href: "/" },
  { label: "About",   href: "/about" },
  { label: "Posts",   href: "/posts" },
  { label: "Profile", href: "/profile" },
];

const socialItems = [
  { label: "GitHub",   href: "https://github.com/chandanrx",                        icon: FaGithub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/chandan-pargi-459272187", icon: FaLinkedin },
  { label: "Twitter",  href: "https://twitter.com/rxn_13",                          icon: FaTwitter },
];

const Footer = () => {
  const pathname = usePathname();

  return (
    <footer className="mt-8 border-t border-[var(--border-subtle)] pt-5">
      <div className="flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">

        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-3">
          <PlaysGoLogo variant="dark" />
          <p className="text-[12px] text-[var(--text-muted)]">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Plays Go
          </p>
        </div>

        <div className="flex flex-col gap-2 md:items-end">
          <div className="flex flex-wrap items-center justify-center gap-1 md:justify-end">
            {navItems.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition ${
                    active
                      ? "bg-[var(--text-heading)] text-[var(--selected-fg)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-heading)]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-1.5 md:justify-end">
            {socialItems.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-muted)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
              >
                <Icon className="text-[13px]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
