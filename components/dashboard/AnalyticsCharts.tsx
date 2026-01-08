"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
}

export default function AnalyticsCharts({ socialMediaData = [] }: AnalyticsChartsProps) {
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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Website Traffic Line Chart */}
      <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-purple-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-gray-900">Website Traffic (Last 6 Months)</h3>
          <select className="bg-white border border-purple-100 rounded-lg px-3 py-1.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
            <option>Monthly</option>
          </select>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9D5FF" vertical={false} />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E9D5FF', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#9333EA' }}
              />
              <Line 
                type="monotone" 
                dataKey="traffic" 
                stroke="#9333EA" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#9333EA' }} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Social Media Followers Pie Chart */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-purple-100 shadow-sm">
        <h3 className="font-bold text-lg mb-6 text-gray-900">Social Media Followers</h3>
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
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E9D5FF', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                formatter={(value: number | undefined) => value ? value.toLocaleString() : '0'}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-gray-700 font-medium w-full max-w-xs">
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