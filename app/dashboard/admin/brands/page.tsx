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
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-4 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1 md:mb-2">Brand Accounts</h1>
        <p className="text-sm md:text-base text-gray-500">Manage all brand accounts on the platform</p>
      </div>

      {message && (
        <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-xl ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <p className="text-xs md:text-sm font-semibold">{message.text}</p>
        </div>
      )}

      {brands.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 md:p-12 text-center">
          <p className="text-base md:text-lg text-gray-500">No brand accounts found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Company Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Industry</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Created</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {brands.map((brand) => (
                    <tr key={brand._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-semibold text-gray-900">{brand.companyName || 'N/A'}</div>
                          {brand.hasProfile === false && (
                            <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-semibold">
                              Incomplete
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{brand.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{brand.industry || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          brand.isBlocked
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {brand.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {new Date(brand.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(brand.userId)}
                            disabled={actionLoading === `delete-${brand.userId}`}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
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
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
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
              <div key={brand._id} className="bg-white rounded-2xl shadow-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-gray-900">{brand.companyName || 'N/A'}</h3>
                      {brand.hasProfile === false && (
                        <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-semibold">
                          Incomplete
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{brand.email}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    brand.isBlocked
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {brand.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Industry:</span>
                    <span className="ml-2 text-gray-900">{brand.industry || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-2 text-gray-900">{new Date(brand.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleDelete(brand.userId)}
                    disabled={actionLoading === `delete-${brand.userId}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
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
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
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
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors disabled:opacity-50"
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

