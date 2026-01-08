export default function StatCard({ title, value, trend, color }: any) {
    const colors: any = {
      purple: "text-purple-600 bg-purple-100",
      cyan: "text-purple-600 bg-purple-100",
      emerald: "text-purple-600 bg-purple-100",
      indigo: "text-purple-600 bg-purple-100"
    };
  
    return (
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-purple-100 hover:border-purple-200 hover:shadow-lg transition-all group shadow-sm">
        <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-black text-gray-900">{value}</h2>
          <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${colors[color]}`}>
            {trend}
          </span>
        </div>
        <div className="mt-4 w-full bg-purple-50 h-1.5 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all group-hover:scale-x-110 origin-left bg-gradient-to-r from-purple-500 to-purple-600" 
            style={{ width: '65%' }} 
          />
        </div>
      </div>
    );
  }