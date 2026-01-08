import React from 'react';

// Define the allowed status types for type safety
export type EventStatus = 'Confirmed' | 'Pending' | 'In Progress' | 'Cancelled' | 'Completed';

interface EventStatusBadgeProps {
  status: EventStatus;
}

export default function EventStatusBadge({ status }: EventStatusBadgeProps) {
  // Mapping statuses to specific professional color palettes
  const statusStyles: Record<EventStatus, string> = {
    'Confirmed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
    'In Progress': 'bg-blue-50 text-blue-600 border-blue-100',
    'Cancelled': 'bg-rose-50 text-rose-600 border-rose-100',
    'Completed': 'bg-purple-50 text-purple-600 border-purple-100',
  };

  return (
    <span className={`
      px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
      ${statusStyles[status] || 'bg-gray-50 text-gray-500 border-gray-100'}
    `}>
      {status}
    </span>
  );
}