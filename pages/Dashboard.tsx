import React, { useEffect, useState } from 'react';
import { useStore } from '../context/Store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, Clock, CheckCircle, TrendingUp, Sparkles } from 'lucide-react';
import { analyzeProductivity } from '../services/geminiService';

const StatCard = ({ label, value, icon: Icon, colorClass, bgClass }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3.5 rounded-xl ${bgClass} ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-50 text-slate-400 group-hover:bg-slate-100 transition-colors">Today</span>
    </div>
    <div>
      <h3 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">{value}</h3>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const { timeEntries, projects } = useStore();
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const totalHours = timeEntries.reduce((acc, curr) => {
    if (!curr.endTime) return acc;
    const duration = (new Date(curr.endTime).getTime() - new Date(curr.startTime).getTime()) / (1000 * 60 * 60);
    return acc + duration;
  }, 0);

  const totalEarnings = timeEntries.reduce((acc, curr) => {
    if (!curr.endTime || !curr.billable) return acc;
    const project = projects.find(p => p.id === curr.projectId);
    if (!project) return acc;
    const duration = (new Date(curr.endTime).getTime() - new Date(curr.startTime).getTime()) / (1000 * 60 * 60);
    return acc + (duration * project.hourlyRate);
  }, 0);

  const billableHours = timeEntries.reduce((acc, curr) => {
    if (!curr.endTime || !curr.billable) return acc;
    const duration = (new Date(curr.endTime).getTime() - new Date(curr.startTime).getTime()) / (1000 * 60 * 60);
    return acc + duration;
  }, 0);

  // Prepare chart data (Last 7 days)
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toLocaleDateString();
    
    const dayHours = timeEntries.reduce((acc, curr) => {
      const entryDate = new Date(curr.startTime).toLocaleDateString();
      if (entryDate === dateStr && curr.endTime) {
        const duration = (new Date(curr.endTime).getTime() - new Date(curr.startTime).getTime()) / (1000 * 60 * 60);
        return acc + duration;
      }
      return acc;
    }, 0);

    return { name: d.toLocaleDateString('en-US', { weekday: 'short' }), hours: dayHours };
  });

  const generateInsight = async () => {
    setLoadingInsight(true);
    const result = await analyzeProductivity(timeEntries.slice(0, 20)); // Analyze last 20 entries
    setInsight(result);
    setLoadingInsight(false);
  };

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard</h2>
          <p className="text-slate-500 mt-1 font-medium">Overview of your productivity and earnings.</p>
        </div>
        <button 
          onClick={generateInsight}
          disabled={loadingInsight}
          className="flex items-center gap-2 bg-white text-indigo-600 border border-indigo-100 px-5 py-2.5 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm font-semibold text-sm disabled:opacity-50"
        >
          <Sparkles size={18} className={loadingInsight ? 'animate-pulse' : ''} />
          {loadingInsight ? 'Analyzing...' : 'Get AI Insights'}
        </button>
      </div>

      {insight && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-0.5 rounded-2xl shadow-xl shadow-indigo-500/20 animate-fadeIn">
           <div className="bg-slate-900/10 backdrop-blur-sm p-6 rounded-[14px] flex items-start gap-4">
             <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles className="text-white" size={20} />
             </div>
             <div>
                <h4 className="font-bold text-white text-lg mb-1">Productivity Insight</h4>
                <p className="text-indigo-50 leading-relaxed font-medium opacity-90">{insight}</p>
             </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Earnings" 
          value={`$${totalEarnings.toFixed(2)}`} 
          icon={DollarSign} 
          bgClass="bg-emerald-500/10"
          colorClass="text-emerald-600" 
        />
        <StatCard 
          label="Total Hours" 
          value={`${totalHours.toFixed(1)}h`} 
          icon={Clock} 
          bgClass="bg-blue-500/10"
          colorClass="text-blue-600" 
        />
        <StatCard 
          label="Billable Hours" 
          value={`${billableHours.toFixed(1)}h`} 
          icon={CheckCircle} 
          bgClass="bg-indigo-500/10"
          colorClass="text-indigo-600" 
        />
        <StatCard 
          label="Active Projects" 
          value={projects.length} 
          icon={TrendingUp} 
          bgClass="bg-orange-500/10"
          colorClass="text-orange-600" 
        />
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Weekly Activity</h3>
            <select className="bg-slate-50 border-none text-sm font-semibold text-slate-500 rounded-lg px-3 py-1 outline-none">
                <option>This Week</option>
            </select>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    padding: '8px 12px'
                }}
                itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}
                labelStyle={{ display: 'none' }}
              />
              <Bar dataKey="hours" radius={[6, 6, 6, 6]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.hours > 5 ? '#6366f1' : '#e2e8f0'} 
                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}