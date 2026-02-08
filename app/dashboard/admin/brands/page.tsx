"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Ban, CheckCircle, Loader2 } from 'lucide-react';

interface BrandAccount {
  _id: string;
  userId: string;
  email: string;
  companyName: string;
  industry: string;
  isBlocked: boolean;
  createdAt: string;
  hasProfile?: boolean;
}

export default function BrandAccountsPage() {
  const [brands, setBrands] = useState<BrandAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/admin/brands');
      setBrands(response.data.brands);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to fetch brand accounts'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this brand account? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(`delete-${userId}`);
      await axios.delete(`/api/admin/accounts/${userId}`);
      setMessage({ type: 'success', text: 'Brand account deleted successfully' });
      fetchBrands();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete account'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlock = async (userId: string) => {
    try {
      setActionLoading(`block-${userId}`);
      await axios.post(`/api/admin/accounts/${userId}/block`);
      setMessage({ type: 'success', text: 'Brand account blocked successfully' });
      fetchBrands();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to block account'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (userId: string) => {
    try {
      setActionLoading(`unblock-${userId}`);
      await axios.post(`/api/admin/accounts/${userId}/unblock`);
      setMessage({ type: 'success', text: 'Brand account unblocked successfully' });
      fetchBrands();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to unblock account'
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-4 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-[#E5E7EB] mb-1 md:mb-2">Brand Accounts</h1>
        <p className="text-sm md:text-base text-[#9CA3AF]">Manage all brand accounts on the platform</p>
      </div>

      {message && (
        <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-xl ${
          message.type === 'success'
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          <p className="text-xs md:text-sm font-semibold">{message.text}</p>
        </div>
      )}

      {brands.length === 0 ? (
        <div className="bg-[#020617]/90 backdrop-blur-xl rounded-2xl border border-[#1F2937] p-8 md:p-12 text-center shadow-xl shadow-blue-900/10">
          <p className="text-base md:text-lg text-[#9CA3AF]">No brand accounts found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-[#020617]/90 backdrop-blur-xl rounded-2xl border border-[#1F2937] shadow-xl shadow-blue-900/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0B1120] border-b border-[#1F2937]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase">Company Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase">Industry</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase">Created</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2937]">
                  {brands.map((brand) => (
                    <tr key={brand._id} className="hover:bg-[#0B1120]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-semibold text-[#E5E7EB]">{brand.companyName || 'N/A'}</div>
                          {brand.hasProfile === false && (
                            <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full font-semibold border border-amber-500/30">
                              Incomplete
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#9CA3AF]">{brand.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#9CA3AF]">{brand.industry || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          brand.isBlocked
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {brand.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#9CA3AF]">
                          {new Date(brand.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(brand.userId)}
                            disabled={actionLoading === `delete-${brand.userId}`}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {actionLoading === `delete-${brand.userId}` ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                          {brand.isBlocked ? (
                            <button
                              onClick={() => handleUnblock(brand.userId)}
                              disabled={actionLoading === `unblock-${brand.userId}`}
                              className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors disabled:opacity-50"
                              title="Unblock"
                            >
                              {actionLoading === `unblock-${brand.userId}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlock(brand.userId)}
                              disabled={actionLoading === `block-${brand.userId}`}
                              className="p-2 text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors disabled:opacity-50"
                              title="Block"
                            >
                              {actionLoading === `block-${brand.userId}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Ban className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {brands.map((brand) => (
              <div key={brand._id} className="bg-[#020617]/90 backdrop-blur-xl rounded-2xl border border-[#1F2937] shadow-xl shadow-blue-900/10 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-[#E5E7EB]">{brand.companyName || 'N/A'}</h3>
                      {brand.hasProfile === false && (
                        <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full font-semibold border border-amber-500/30">
                          Incomplete
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#9CA3AF]">{brand.email}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    brand.isBlocked
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}>
                    {brand.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-[#6B7280]">Industry:</span>
                    <span className="ml-2 text-[#E5E7EB]">{brand.industry || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280]">Created:</span>
                    <span className="ml-2 text-[#E5E7EB]">{new Date(brand.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#1F2937]">
                  <button
                    onClick={() => handleDelete(brand.userId)}
                    disabled={actionLoading === `delete-${brand.userId}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === `delete-${brand.userId}` ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                  {brand.isBlocked ? (
                    <button
                      onClick={() => handleUnblock(brand.userId)}
                      disabled={actionLoading === `unblock-${brand.userId}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === `unblock-${brand.userId}` ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Unblock</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlock(brand.userId)}
                      disabled={actionLoading === `block-${brand.userId}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === `block-${brand.userId}` ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Ban className="w-4 h-4" />
                          <span>Block</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

