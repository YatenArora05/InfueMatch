import React from 'react';
import { MoreHorizontal, ArrowUpRight } from 'lucide-react';

const campaigns = [
  { id: 1, name: 'Summer Collection 24', influencer: 'Alex Rivera', budget: '$12,000', spent: '$8,400', status: 'Active' },
  { id: 2, name: 'Tech Unboxing Series', influencer: 'Sarah Chen', budget: '$5,500', spent: '$5,500', status: 'Completed' },
  { id: 3, name: 'Fitness Motivation', influencer: 'Mike Irons', budget: '$2,800', spent: '$1,200', status: 'Pending' },
  { id: 4, name: 'Eco-Friendly Campaign', influencer: 'Elena Rose', budget: '$15,000', spent: '$2,000', status: 'Active' },
];

export default function BudgetTable() {
  return (
    <div className="mt-8 bg-[#161922] rounded-3xl border border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <h3 className="font-bold text-lg">Active Campaign Budgets</h3>
        <button className="text-sm text-purple-400 hover:underline flex items-center gap-1">
          View all <ArrowUpRight size={14} />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Campaign Name</th>
              <th className="px-6 py-4 font-semibold">Influencer</th>
              <th className="px-6 py-4 font-semibold">Budget</th>
              <th className="px-6 py-4 font-semibold">Spending Progress</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {campaigns.map((camp) => (
              <tr key={camp.id} className="hover:bg-gray-800/30 transition-colors group">
                <td className="px-6 py-4 text-sm font-medium">{camp.name}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{camp.influencer}</td>
                <td className="px-6 py-4 text-sm font-bold">{camp.budget}</td>
                <td className="px-6 py-4 min-w-[200px]">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-500" 
                        style={{ width: `${(parseInt(camp.spent.replace(/\$|,/g, '')) / parseInt(camp.budget.replace(/\$|,/g, ''))) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{camp.spent}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    camp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                    camp.status === 'Completed' ? 'bg-blue-500/10 text-blue-500' : 
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    {camp.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-500 hover:text-white transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}