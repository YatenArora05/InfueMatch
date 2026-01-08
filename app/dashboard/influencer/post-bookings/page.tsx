import React from 'react';
import BookingForm from '@/components/dashboard/BookingForm';
import { CalendarDays } from 'lucide-react';

export default function PostBookingsPage() {
  return (
    <div className="max-w-5xl mx-auto w-full h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-100">
          <CalendarDays size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Post Future Bookings</h1>
          <p className="text-base text-gray-500 font-medium">Keep track of your upcoming collaborations and deadlines.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xl shadow-purple-50 flex-1 flex flex-col">
        <BookingForm />
      </div>
      
      {/* Quick Summary Tip */}
      {/* <div className="mt-4 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white flex justify-between items-center">
        <div>
          <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-0.5">Upcoming Milestone</p>
          <h4 className="text-base font-bold">You have 3 bookings scheduled for January!</h4>
        </div>
        <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-bold text-sm transition-all">
          View Calendar
        </button>
      </div> */}
    </div>
  );
}