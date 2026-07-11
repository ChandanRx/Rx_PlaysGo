"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowRightOnRectangleIcon,
  LockClosedIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PlaysGoLogo from "../../components/PlaysGoLogo";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { useAuthSession } from "../../hooks/useClientData";
import { signOut } from "../../shared/authSession";

const GateCard = ({ icon: Icon, title, message, children }) => (
  <Card className="mx-auto mt-16 max-w-md p-8 text-center" hover={false} padding={false}>
    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-secondary)]">
      <Icon className="h-6 w-6 text-[var(--text-muted)]" strokeWidth={2} />
    </span>
    <h1 className="mt-4 text-[19px] font-black text-[var(--text-heading)]">{title}</h1>
    <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-muted)]">{message}</p>
    <div className="mt-5 flex justify-center gap-2">{children}</div>
  </Card>
);

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const { session, isReady, isAdmin } = useAuthSession();

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen">
      {/* Admin console top bar — replaces the member app chrome */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link href="/" aria-label="PlaysGo home">
            <PlaysGoLogo iconOnly />
          </Link>
          <span className="inline-flex items-center gap-1 rounded-md bg-[var(--text-heading)] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[var(--selected-fg)]">
            <ShieldCheckIcon className="h-3 w-3" strokeWidth={2.5} />
            Admin console
          </span>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button variant="secondary" size="sm" onClick={() => router.push("/")}>
              <ArrowLeftIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
              Back to app
            </Button>
            {isReady && session && (
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <ArrowRightOnRectangleIcon className="h-4 w-4" strokeWidth={2} />
                Sign out
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {!isReady ? null : !session ? (
          <GateCard
            icon={LockClosedIcon}
            title="Sign in required"
            message="The admin dashboard is only available to signed-in admins."
          >
            <Button variant="yellow" onClick={() => router.push("/signin?next=/dashboard")}>
              Sign in
            </Button>
            <Button variant="secondary" onClick={() => router.push("/")}>
              Go home
            </Button>
          </GateCard>
        ) : !isAdmin ? (
          <GateCard
            icon={ShieldCheckIcon}
            title="Admins only"
            message={`You're signed in as ${session.name}, but this area needs an admin account. Sign in again with the admin option enabled.`}
          >
            <Button variant="yellow" onClick={() => router.push("/signin?next=/dashboard")}>
              Switch account
            </Button>
            <Button variant="secondary" onClick={() => router.push("/")}>
              Go home
            </Button>
          </GateCard>
        ) : (
          children
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;
