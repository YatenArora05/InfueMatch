interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  color?: string;
  theme?: 'light' | 'dark';
}

export default function StatCard({ title, value, trend, color, theme = 'light' }: StatCardProps) {
  const isDark = theme === 'dark';
  const trendStyles = isDark
    ? 'text-[#3B82F6] bg-[#1E3A8A]/40 border border-[#3B82F6]/30'
    : 'text-purple-600 bg-purple-100';

  return (
    <div
      className={
        isDark
          ? 'bg-[#0B1220]/90 backdrop-blur-sm p-6 rounded-3xl border border-[#1F2937] hover:border-[#374151] hover:shadow-xl hover:shadow-blue-900/10 transition-all group shadow-xl shadow-blue-900/5'
          : 'bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-purple-100 hover:border-purple-200 hover:shadow-lg transition-all group shadow-sm'
      }
    >
      <p className={`text-sm font-medium mb-2 ${isDark ? 'text-[#9CA3AF]' : 'text-gray-600'}`}>{title}</p>
      <div className="flex items-end justify-between">
        <h2 className={`text-3xl font-black ${isDark ? 'text-[#E5E7EB]' : 'text-gray-900'}`}>{value}</h2>
        <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${trendStyles}`}>{trend}</span>
      </div>
      <div
        className={`mt-4 w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#1F2937]' : 'bg-purple-50'}`}
      >
        <div
          className={`h-full rounded-full transition-all group-hover:scale-x-110 origin-left ${isDark ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB]' : 'bg-gradient-to-r from-purple-500 to-purple-600'}`}
          style={{ width: '65%' }}
        />
      </div>
    </div>
  );
}