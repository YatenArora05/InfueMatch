"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  Search, 
  Filter,
  Trash2,
  ChevronDown,
  Check
} from 'lucide-react';

interface Booking {
  _id: string;
  campaignName: string;
  eventName: string;
  postingDate: string;
  agreedRate: number;
}

type FilterType = 'all' | 'BrandName' | 'campaignName' | 'date';

export default function EventManagerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; bookingId: string | null; bookingName: string }>({
    show: false,
    bookingId: null,
    bookingName: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const influencerId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
        
        if (!influencerId) {
          setError('User ID not found. Please log in again.');
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`/api/bookings?influencerId=${influencerId}`);
        
        if (response.data?.bookings) {
          setBookings(response.data.bookings);
        }
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const getSearchPlaceholder = () => {
    switch (filterType) {
      case 'BrandName':
        return 'Search by brand name...';
      case 'campaignName':
        return 'Search by campaign name...';
      case 'date':
        return 'Search by date (e.g., Jan 15, 2026)...';
      default:
        return 'Search by campaign name or brand name...';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();

    switch (filterType) {
      case 'BrandName':
        return booking.eventName.toLowerCase().includes(searchLower);
      case 'campaignName':
        return booking.campaignName.toLowerCase().includes(searchLower);
      case 'date':
        const formattedDate = formatDate(booking.postingDate).toLowerCase();
        return formattedDate.includes(searchLower);
      default:
        return (
          booking.campaignName.toLowerCase().includes(searchLower) ||
          booking.eventName.toLowerCase().includes(searchLower)
        );
    }
  });

  const filterOptions = [
    { value: 'all' as FilterType, label: 'All Attributes' },
    { value: 'BrandName' as FilterType, label: 'Filter by Brand Name' },
    { value: 'campaignName' as FilterType, label: 'Filter by Campaign Name' },
    { value: 'date' as FilterType, label: 'Filter by Date' },
  ];

  const handleDeleteClick = (bookingId: string, campaignName: string) => {
    setDeleteConfirm({
      show: true,
      bookingId,
      bookingName: campaignName,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.bookingId) return;

    try {
      setIsDeleting(true);
      const influencerId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      
      if (!influencerId) {
        setError('User ID not found. Please log in again.');
        setIsDeleting(false);
        return;
      }

      await axios.delete(`/api/bookings?id=${deleteConfirm.bookingId}&influencerId=${influencerId}`);
      
      // Remove the booking from the local state
      setBookings(bookings.filter(booking => booking._id !== deleteConfirm.bookingId));
      
      // Close the confirmation dialog
      setDeleteConfirm({ show: false, bookingId: null, bookingName: '' });
    } catch (err: any) {
      console.error('Error deleting booking:', err);
      setError(err.response?.data?.message || 'Failed to delete booking');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, bookingId: null, bookingName: '' });
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col space-y-4 md:space-y-6 animate-in fade-in duration-500 px-4 md:px-0">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#E5E7EB] tracking-tight mb-1 md:mb-2">Event Manager</h1>
          <p className="text-sm md:text-base text-[#9CA3AF] font-medium">
            {isLoading 
              ? 'Loading your bookings...' 
              : `Tracking ${bookings.length} total ${bookings.length === 1 ? 'collaboration' : 'collaborations'} across your schedule.`
            }
          </p>
        </div>
        {/* <div className="flex gap-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
            <Download size={18} /> Export PDF
          </button>
          <Button variant="primary" className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3 shadow-purple-200">
            <Plus size={20} /> Create New Event
          </Button>
        </div> */}
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 bg-[#0B1220]/90 backdrop-blur-sm p-3 md:p-4 rounded-2xl md:rounded-3xl border border-[#1F2937] shadow-xl shadow-blue-900/10 shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
          <input 
            type="text" 
            placeholder={getSearchPlaceholder()}
            value={searchTerm}
            className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 bg-[#0F0F0F] border border-[#1F2937] rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]/50 transition-all outline-none text-sm md:text-base text-[#E5E7EB] placeholder:text-[#6B7280]"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative" ref={filterDropdownRef}>
          <button 
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold transition-all text-sm md:text-base ${
              filterType !== 'all' 
                ? 'bg-[#1E3A8A]/40 text-[#3B82F6] border border-[#3B82F6]/30' 
                : 'bg-[#0F0F0F] text-[#9CA3AF] border border-[#1F2937] hover:bg-[#1F2937] hover:text-[#E5E7EB]'
            }`}
          >
            <Filter size={16} /> <span className="hidden sm:inline">Filters</span>
            <ChevronDown 
              size={14} 
              className={`transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          
          {isFilterDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 md:w-64 bg-[#0B1220] border border-[#1F2937] rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="py-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilterType(option.value);
                      setIsFilterDropdownOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full px-4 py-2.5 md:py-3 text-left flex items-center justify-between transition-colors ${
                      filterType === option.value ? 'bg-[#1E3A8A]/40 text-[#3B82F6]' : 'text-[#E5E7EB] hover:bg-[#1F2937]'
                    }`}
                  >
                    <span className="font-semibold text-xs md:text-sm">{option.label}</span>
                    {filterType === option.value && (
                      <Check size={14} className="text-[#3B82F6]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MAIN EVENTS LIST */}
      <div className="bg-[#0B1220]/90 backdrop-blur-sm rounded-2xl md:rounded-[2.5rem] border border-[#1F2937] shadow-xl shadow-blue-900/10 overflow-hidden flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm md:text-base text-[#9CA3AF] font-medium">Loading your bookings...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <p className="text-sm md:text-base text-red-400 font-medium">{error}</p>
            </div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-[#1F2937] rounded-full flex items-center justify-center text-[#6B7280] mx-auto mb-4">
                <Calendar size={24} className="md:w-8 md:h-8" />
              </div>
              <h3 className="text-lg md:text-xl font-black text-[#E5E7EB] mb-2">No Future Post Bookings</h3>
              <p className="text-sm md:text-base text-[#9CA3AF] font-medium">There is no future post bookings right now by you.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1F2937]/50 text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.15em] border-b border-[#1F2937]">
                    <th className="px-6 lg:px-8 py-4 lg:py-6">Campaign Name</th>
                    <th className="px-6 lg:px-8 py-4 lg:py-6">Brand Name</th>
                    <th className="px-6 lg:px-8 py-4 lg:py-6">Date</th>
                    <th className="px-6 lg:px-8 py-4 lg:py-6">Agreed Price</th>
                    <th className="px-6 lg:px-8 py-4 lg:py-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2937]">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="group hover:bg-[#1F2937]/50 transition-all duration-300">
                      <td className="px-6 lg:px-8 py-5 lg:py-7">
                        <p className="font-black text-[#E5E7EB] text-base lg:text-lg leading-none">{booking.campaignName}</p>
                      </td>
                      <td className="px-6 lg:px-8 py-5 lg:py-7">
                        <p className="text-xs lg:text-sm text-[#3B82F6] font-bold uppercase tracking-widest">{booking.eventName}</p>
                      </td>
                      <td className="px-6 lg:px-8 py-5 lg:py-7">
                        <div className="flex items-center gap-2 text-xs lg:text-sm font-black text-[#E5E7EB]">
                          <Calendar size={14} className="text-[#3B82F6]" /> 
                          {formatDate(booking.postingDate)}
                        </div>
                      </td>
                      <td className="px-6 lg:px-8 py-5 lg:py-7">
                        <p className="text-xs lg:text-sm font-bold text-[#E5E7EB]">{formatPrice(booking.agreedRate)}</p>
                      </td>
                      <td className="px-6 lg:px-8 py-5 lg:py-7 text-right">
                        <button
                          onClick={() => handleDeleteClick(booking._id, booking.campaignName)}
                          className="p-2 text-[#9CA3AF] hover:text-red-400 hover:bg-red-900/20 border border-transparent hover:border-red-500/30 rounded-lg transition-all group"
                          title="Delete booking"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking._id} className="bg-[#1F2937]/50 rounded-xl p-4 border border-[#374151]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-[#E5E7EB] text-sm leading-tight mb-1 truncate">{booking.campaignName}</h3>
                      <p className="text-xs text-[#3B82F6] font-bold uppercase tracking-wide">{booking.eventName}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(booking._id, booking.campaignName)}
                      className="p-2 text-[#9CA3AF] hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all ml-2 shrink-0"
                      title="Delete booking"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-[#374151]">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#9CA3AF]">
                      <Calendar size={14} className="text-[#3B82F6] shrink-0" /> 
                      <span>{formatDate(booking.postingDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#E5E7EB]">
                      <span className="text-[#9CA3AF] font-medium">Price:</span>
                      <span>{formatPrice(booking.agreedRate)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B1220] border border-[#1F2937] rounded-xl md:rounded-2xl shadow-2xl max-w-md w-full p-5 md:p-6 animate-in zoom-in duration-200">
            <h3 className="text-lg md:text-xl font-black text-[#E5E7EB] mb-2">Confirm Delete</h3>
            <p className="text-sm md:text-base text-[#9CA3AF] mb-5 md:mb-6">
              Are you sure you want to delete the booking for <span className="font-bold text-[#E5E7EB]">&quot;{deleteConfirm.bookingName}&quot;</span>? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                className="px-5 md:px-6 py-2 md:py-2.5 bg-[#1F2937] text-[#E5E7EB] rounded-lg md:rounded-xl font-semibold hover:bg-[#374151] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 md:px-6 py-2 md:py-2.5 bg-red-600 text-white rounded-lg md:rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INFORMATION BANNER */}
      {/* <div className="relative overflow-hidden p-10 bg-gray-900 rounded-[3rem] text-white"> */}
        {/* Abstract Background Design */}
        {/* <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/20 blur-[80px] rounded-full" /> */}
        
        {/* <div className="relative z-10 flex flex-col md:row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="text-2xl font-black mb-3 italic">Pro Creator Tip</h3>
            <p className="text-gray-400 font-medium leading-relaxed">
              Influencers who update their "Event Manager" twice a week see a <span className="text-purple-400 font-bold">35% increase</span> in brand invitation rates. Keeping your schedule transparent helps brands find the perfect window for your next big campaign.
            </p>
          </div>
          <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-purple-900/20">
            View Analytics
          </button>
        </div> */}
      {/* </div> */}
    </div>
  );
}