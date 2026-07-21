"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { UsersIcon } from "@heroicons/react/24/outline";
import { getUniqueUsers } from "../../shared/adminStore";
import { AdminEmpty, AdminLoading } from "./AdminTableState";

const AdminUsersTable = ({ onSelectUser }) => {
  const [users, setUsers] = useState(null);

  useEffect(() => { setUsers(getUniqueUsers()); }, []);

  if (users === null) return <AdminLoading rows={5} />;

  if (users.length === 0) {
    return (
      <AdminEmpty
        icon={UsersIcon}
        title="No users yet"
        message="Users appear here as soon as they publish their first post."
      />
    );
  }

  const maxPosts = Math.max(1, ...users.map((u) => u.postCount));

  return (
    <div>
      <p className="text-[11.5px] font-medium text-[var(--text-faint)]">
        {users.length} user{users.length === 1 ? "" : "s"} · click a name to see their posts
      </p>

      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-faint)]">
              <th className="py-2.5 pr-4">User</th>
              <th className="py-2.5 pr-4">City</th>
              <th className="py-2.5 pr-4">Posts</th>
              <th className="py-2.5 pr-4">Verified</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email} className="border-b border-[var(--border-subtle)] transition-colors last:border-0 hover:bg-[var(--bg-secondary)]/60">
                <td className="py-2.5 pr-4">
                  <button
                    type="button"
                    onClick={() => onSelectUser(user.email)}
                    className="flex items-center gap-2.5 text-left transition hover:text-[var(--brand)]"
                  >
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={28}
                      height={28}
                      unoptimized={user.image?.startsWith("data:")}
                      className="h-7 w-7 shrink-0 rounded-full object-cover"
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-[var(--text-heading)]">{user.name}</span>
                      <span className="block truncate text-[11px] text-[var(--text-faint)]">{user.email}</span>
                    </span>
                  </button>
                </td>
                <td className="max-w-[180px] truncate py-2.5 pr-4 text-[var(--text-muted)]">{user.city}</td>
                <td className="py-2.5 pr-4">
                  <span className="flex items-center gap-2">
                    <span className="w-4 shrink-0 font-semibold tabular-nums text-[var(--text-body)]">
                      {user.postCount}
                    </span>
                    {/* relative-volume meter: track is a lighter step of the same brand ramp */}
                    <span aria-hidden className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--brand-soft)]">
                      <span
                        className="block h-full rounded-full bg-[var(--brand)]"
                        style={{ width: `${(user.postCount / maxPosts) * 100}%` }}
                      />
                    </span>
                  </span>
                </td>
                <td className="py-2.5 pr-4">
                  {user.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[var(--success)]">
                      <CheckBadgeIcon className="h-[14px] w-[14px]" /> Verified
                    </span>
                  ) : (
                    <span className="text-[var(--text-faint)]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersTable;
