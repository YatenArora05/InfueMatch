"use client";
import { LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Mon', traffic: 10 }, { name: 'Tue', traffic: 25 },
  { name: 'Wed', traffic: 40 }, { name: 'Thu', traffic: 35 },
  { name: 'Fri', traffic: 60 }, { name: 'Sat', traffic: 80 },
];

interface AnalyticsChartsProps {
  socialMediaData?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  theme?: 'light' | 'dark';
}

export default function AnalyticsCharts({ socialMediaData = [], theme = 'light' }: AnalyticsChartsProps) {
  const isDark = theme === 'dark';
  // Default colors if no data
  const defaultData = [
    { name: 'Instagram', value: 0, color: '#E1306C' },
    { name: 'YouTube', value: 0, color: '#FF0000' },
    { name: 'Facebook', value: 0, color: '#1877F2' },
    { name: 'Twitter', value: 0, color: '#1DA1F2' },
  ];

  const pieData = socialMediaData.length > 0 && socialMediaData.some(item => item.value > 0)
    ? socialMediaData
    : defaultData;

  const chartCardClass = isDark
    ? 'bg-[#020617]/90 backdrop-blur-xl p-6 rounded-3xl border border-[#1F2937] shadow-xl shadow-blue-900/10'
    : 'bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-purple-100 shadow-sm';
  const titleClass = isDark ? 'font-bold text-lg text-[#E5E7EB]' : 'font-bold text-lg text-gray-900';
  const selectClass = isDark
    ? 'bg-[#0B1120] border border-[#1F2937] rounded-lg px-3 py-1.5 text-sm text-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]'
    : 'bg-white border border-purple-100 rounded-lg px-3 py-1.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500';
  const gridStroke = isDark ? '#1F2937' : '#E9D5FF';
  const axisStroke = isDark ? '#9CA3AF' : '#6B7280';
  const lineStroke = isDark ? '#3B82F6' : '#9333EA';
  const tooltipBg = isDark ? '#0B1120' : '#ffffff';
  const tooltipBorder = isDark ? '#1F2937' : '#E9D5FF';
  const legendTextClass = isDark ? 'text-[#9CA3AF]' : 'text-gray-700';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Website Traffic Line Chart */}
      <div className={`lg:col-span-2 ${chartCardClass}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={titleClass}>{isDark ? 'Website Traffic (Live)' : 'Website Traffic (Last 6 Months)'}</h3>
          {isDark ? (
            <span className="text-xs font-semibold text-[#3B82F6] bg-[#1E3A8A]/40 px-2 py-1 rounded-lg border border-[#3B82F6]/30">Updating</span>
          ) : (
            <select className={selectClass}>
              <option>Monthly</option>
            </select>
          )}
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              {isDark && (
                <defs>
                  <linearGradient id="trafficAreaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
                    <stop offset="60%" stopColor="#2563EB" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#020617" stopOpacity={0} />
                  </linearGradient>
                </defs>
              )}
              <CartesianGrid
                strokeDasharray={isDark ? "2 6" : "3 3"}
                stroke={gridStroke}
                vertical={false}
                opacity={isDark ? 0.4 : 1}
              />
              <XAxis dataKey="name" stroke={axisStroke} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={axisStroke} fontSize={12} tickLine={false} axisLine={false} domain={isDark ? ['dataMin - 10', 'dataMax + 10'] : undefined} />
              <Tooltip 
                contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '12px', boxShadow: isDark ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)', color: isDark ? '#E5E7EB' : undefined }}
                itemStyle={{ color: lineStroke }}
                formatter={isDark ? (value: number | undefined) => [value != null ? String(value) : '—', 'Traffic'] : undefined}
              />
              {isDark && (
                <Area
                  type="linear"
                  dataKey="traffic"
                  stroke="none"
                  fill="url(#trafficAreaFill)"
                  fillOpacity={1}
                />
              )}
              <Line 
                type="linear"
                dataKey="traffic" 
                stroke={lineStroke} 
                strokeWidth={isDark ? 3 : 4}
                strokeLinecap={isDark ? 'round' : undefined}
                strokeLinejoin={isDark ? 'round' : undefined}
                dot={isDark ? (props) => {
                  const { cx, cy } = props;
                  if (cx == null || cy == null) return null;
                  return (
                    <>
                      <circle cx={cx} cy={cy} r={6} fill="rgba(59, 130, 246, 0.18)" />
                      <circle cx={cx} cy={cy} r={3.5} fill="#DBEAFE" stroke="#3B82F6" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.85))' }} />
                    </>
                  );
                } : { r: 4, fill: lineStroke }}
                activeDot={isDark ? (props) => {
                  const { cx, cy } = props;
                  if (cx == null || cy == null) return null;
                  return (
                    <>
                      <circle cx={cx} cy={cy} r={8} fill="rgba(59, 130, 246, 0.25)" />
                      <circle cx={cx} cy={cy} r={4} fill="#DBEAFE" stroke="#3B82F6" strokeWidth={2} style={{ filter: 'drop-shadow(0 0 14px rgba(59, 130, 246, 0.95))' }} />
                    </>
                  );
                } : { r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Social Media Followers Pie Chart */}
      <div className={chartCardClass}>
        <h3 className={`font-bold text-lg mb-6 ${isDark ? 'text-[#E5E7EB]' : 'text-gray-900'}`}>Social Media Followers</h3>
        <div className="h-64 flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                formatter={(value: number | undefined) => value ? value.toLocaleString() : '0'}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className={`grid grid-cols-2 gap-3 mt-4 text-xs font-medium w-full max-w-xs ${legendTextClass}`}>
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}