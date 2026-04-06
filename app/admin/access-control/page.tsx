"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";

type UserRow = {
  _id: string;
  name: string;
  email: string;
  role: "influencer" | "brand";
};

type PendingToggle = {
  user: UserRow;
  newRole: "influencer" | "brand";
};

function adminHeaders() {
  if (typeof window === "undefined") return {};
  const adminId = localStorage.getItem("adminId");
  return { "x-admin-id": adminId || "" };
}

function roleLabel(role: string) {
  return role === "brand" ? "Brand" : "Influencer";
}

export default function AccessControlPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<PendingToggle | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await axios.get(`/api/admin/users?${params.toString()}`, {
        headers: adminHeaders(),
      });

      setUsers(res.data.users);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages || 1);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string }; status?: number } };
      setMessage({
        type: "error",
        text:
          err.response?.status === 401
            ? "Unauthorized. Sign in again as admin."
            : err.response?.data?.message || "Failed to load users",
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(searchInput);
  };

  const openToggleConfirm = (user: UserRow) => {
    const newRole = user.role === "influencer" ? "brand" : "influencer";
    setConfirmToggle({ user, newRole });
  };

  const applyRoleChange = async () => {
    if (!confirmToggle) return;
    const { user, newRole } = confirmToggle;
    setConfirmToggle(null);
    try {
      setActionUserId(user._id);
      await axios.patch(
        "/api/admin/update-role",
        { userId: user._id, newRole },
        { headers: adminHeaders() }
      );
      setMessage({
        type: "success",
        text: `${user.name} is now a ${roleLabel(newRole).toLowerCase()}.`,
      });
      await fetchUsers();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Could not update role",
      });
    } finally {
      setActionUserId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-[#E5E7EB] mb-1 md:mb-2">Access Control</h1>
        <p className="text-sm md:text-base text-[#9CA3AF]">
          View accounts and switch roles between influencer and brand. New signups start as influencers.
        </p>
      </div>

      {message && (
        <div
          className={`mb-4 md:mb-6 p-3 md:p-4 rounded-xl ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/30 text-green-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          <p className="text-xs md:text-sm font-semibold">{message.text}</p>
        </div>
      )}

      <form
        onSubmit={handleSearchSubmit}
        className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center"
      >
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="search"
            placeholder="Search by name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B1120] border border-[#1F2937] text-sm text-[#E5E7EB] placeholder:text-[#6B7280] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/50 outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#3B82F6] text-white text-sm font-semibold hover:bg-[#2563EB] transition-colors"
        >
          Search
        </button>
      </form>

      <p className="text-xs text-[#6B7280] mb-3">
        {isLoading ? "Loading…" : `${total} user${total !== 1 ? "s" : ""} total`}
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
        </div>
      ) : users.length === 0 ? (
        <div className="bg-[#020617]/90 backdrop-blur-xl rounded-2xl border border-[#1F2937] p-8 text-center">
          <p className="text-[#9CA3AF]">No users match your search.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-[#020617]/90 backdrop-blur-xl rounded-2xl border border-[#1F2937] shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-[#0B1120] border-b border-[#1F2937]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2937]">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-[#0B1120]/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-[#E5E7EB]">{u.name}</td>
                      <td className="px-6 py-4 text-sm text-[#9CA3AF]">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#1E3A8A]/40 text-[#93C5FD] border border-[#3B82F6]/30">
                          {roleLabel(u.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          disabled={actionUserId === u._id}
                          onClick={() => openToggleConfirm(u)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#0B1120] border border-[#1F2937] text-[#E5E7EB] hover:border-[#3B82F6]/50 hover:bg-[#111827] disabled:opacity-50 transition-colors"
                        >
                          {actionUserId === u._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>Switch to {u.role === "influencer" ? "Brand" : "Influencer"}</>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:hidden space-y-3">
            {users.map((u) => (
              <div
                key={u._id}
                className="rounded-2xl border border-[#1F2937] bg-[#020617]/90 p-4 space-y-3"
              >
                <div>
                  <p className="font-semibold text-[#E5E7EB]">{u.name}</p>
                  <p className="text-sm text-[#9CA3AF]">{u.email}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#1E3A8A]/40 text-[#93C5FD] border border-[#3B82F6]/30">
                    {roleLabel(u.role)}
                  </span>
                  <button
                    type="button"
                    disabled={actionUserId === u._id}
                    onClick={() => openToggleConfirm(u)}
                    className="text-sm font-semibold text-[#3B82F6] disabled:opacity-50"
                  >
                    {actionUserId === u._id ? "…" : `→ ${u.role === "influencer" ? "Brand" : "Influencer"}`}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#9CA3AF]">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#1F2937] text-sm text-[#E5E7EB] hover:bg-[#0B1120] disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages || isLoading}
                  onClick={() => setPage((p) => p + 1)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#1F2937] text-sm text-[#E5E7EB] hover:bg-[#0B1120] disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {confirmToggle && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-role-title"
            className="w-full max-w-md rounded-2xl border border-[#1F2937] bg-[#020617] p-6 shadow-2xl"
          >
            <h2 id="confirm-role-title" className="text-lg font-bold text-[#E5E7EB] mb-2">
              Change role?
            </h2>
            <p className="text-sm text-[#9CA3AF] mb-6">
              Set <span className="text-[#E5E7EB] font-medium">{confirmToggle.user.name}</span> (
              {confirmToggle.user.email}) from {roleLabel(confirmToggle.user.role)} to{" "}
              {roleLabel(confirmToggle.newRole)}.
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmToggle(null)}
                className="px-4 py-2.5 rounded-xl border border-[#1F2937] text-sm font-semibold text-[#E5E7EB] hover:bg-[#0B1120]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyRoleChange}
                className="px-4 py-2.5 rounded-xl bg-[#3B82F6] text-sm font-semibold text-white hover:bg-[#2563EB]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
