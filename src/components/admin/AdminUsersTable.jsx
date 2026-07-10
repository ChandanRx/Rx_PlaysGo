"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { getUniqueUsers } from "../../shared/adminStore";

const AdminUsersTable = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => { setUsers(getUniqueUsers()); }, []);

  if (users.length === 0) {
    return <p className="py-8 text-center text-[13px] text-[var(--text-muted)]">No users yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
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
            <tr key={user.email} className="border-b border-[var(--border-subtle)] last:border-0">
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
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                  />
                  <span className="font-semibold text-[var(--text-heading)]">{user.name}</span>
                </button>
              </td>
              <td className="max-w-[180px] truncate py-2.5 pr-4 text-[var(--text-muted)]">{user.city}</td>
              <td className="py-2.5 pr-4 text-[var(--text-body)]">{user.postCount}</td>
              <td className="py-2.5 pr-4">
                {user.isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[#22C55E]">
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
  );
};

export default AdminUsersTable;
