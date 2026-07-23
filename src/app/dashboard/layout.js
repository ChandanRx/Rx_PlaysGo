"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LockClosedIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useAuthSession } from "../../hooks/useClientData";

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

/* The dashboard renders its own reference-style chrome (sidebar + top bar) in
 * page.js. This layout only handles the admin auth gate. */
const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const { session, isReady, isAdmin } = useAuthSession();

  if (!isReady) return <div className="min-h-screen" />;

  if (!session) {
    return (
      <div className="min-h-screen px-4">
        <GateCard icon={LockClosedIcon} title="Sign in required" message="The admin dashboard is only available to signed-in admins.">
          <Button variant="yellow" onClick={() => router.push("/signin?next=/dashboard")}>Sign in</Button>
          <Button variant="secondary" onClick={() => router.push("/")}>Go home</Button>
        </GateCard>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen px-4">
        <GateCard icon={ShieldCheckIcon} title="Admins only" message={`You're signed in as ${session.name}, but this area needs an admin account.`}>
          <Button variant="yellow" onClick={() => router.push("/signin?next=/dashboard")}>Switch account</Button>
          <Button variant="secondary" onClick={() => router.push("/")}>Go home</Button>
        </GateCard>
      </div>
    );
  }

  return children;
};

export default DashboardLayout;
