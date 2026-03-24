import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { PlayCircle, StopCircle, Trash2, Calendar, Clock, Tag, Plus } from 'lucide-react';

export default function TimeLog() {
  const { 
    projects, 
    timeEntries, 
    addTimeEntry, 
    activeTimerId, 
    stopActiveTimer, 
    deleteTimeEntry 
  } = useStore();

  const [description, setDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState(projects[0]?.id || '');
  const [manualMode, setManualMode] = useState(false);
  const [manualDuration, setManualDuration] = useState(''); // in hours

  const handleStartTimer = async () => {
    if (!selectedProject) return alert('Please select a project first');
    await addTimeEntry({
      projectId: selectedProject,
      startTime: new Date().toISOString(),
      endTime: null,
      description: description || 'No description',
      billable: true
    });
    setDescription('');
  };

  const handleManualAdd = async () => {
    if (!selectedProject || !manualDuration) return;
    const hours = parseFloat(manualDuration);
    if (isNaN(hours)) return;

    const end = new Date();
    const start = new Date(end.getTime() - hours * 60 * 60 * 1000);

    await addTimeEntry({
      projectId: selectedProject,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      description: description || 'Manual Entry',
      billable: true
    });
    setDescription('');
    setManualDuration('');
  };

  // Sort entries by date descending
  const sortedEntries = [...timeEntries].sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Time Log</h2>
          <p className="text-slate-500 mt-1 font-medium">Track your work sessions efficiently.</p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>

        <div className="relative z-10 flex flex-col md:flex-row gap-5 items-stretch md:items-end">
           <div className="flex-grow space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">What are you working on?</label>
             <input
               type="text"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               placeholder="e.g. Designing homepage mockup"
               className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-slate-800 placeholder:text-slate-400"
             />
           </div>
           
           <div className="w-full md:w-72 space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Project</label>
             <div className="relative">
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-slate-800 cursor-pointer"
                >
                  <option value="" disabled>Select Project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Tag size={18} />
                </div>
             </div>
           </div>

           {manualMode && (
              <div className="w-32 space-y-2 animate-fadeIn">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Duration (h)</label>
                <input
                  type="number"
                  placeholder="0.0"
                  value={manualDuration}
                  onChange={(e) => setManualDuration(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-center text-slate-800"
                />
              </div>
           )}

           <div className="flex-shrink-0">
             {activeTimerId && !manualMode ? (
               <button
                 onClick={stopActiveTimer}
                 className="h-[58px] px-8 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/40 transition-all flex items-center gap-3 hover:-translate-y-0.5"
               >
                 <StopCircle size={24} /> Stop
               </button>
             ) : (
               <button
                 onClick={manualMode ? handleManualAdd : handleStartTimer}
                 className="h-[58px] px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all flex items-center gap-3 hover:-translate-y-0.5"
               >
                 {manualMode ? <Plus size={24} /> : <PlayCircle size={24} />}
                 {manualMode ? 'Add' : 'Start'}
               </button>
             )}
           </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
            <button 
                onClick={() => setManualMode(!manualMode)}
                className={`text-sm font-semibold transition-colors flex items-center gap-2 ${manualMode ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${manualMode ? 'bg-indigo-600 border-indigo-600' : 'border-slate-400'}`}>
                    {manualMode && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                Manual Entry Mode
            </button>
        </div>
      </div>

      {/* Log List */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
            Recent Activity
            <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{sortedEntries.length}</span>
        </h3>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {sortedEntries.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <Clock size={32} />
              </div>
              <p className="text-slate-500 font-medium">No time entries yet. Start tracking your work!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {sortedEntries.map(entry => {
                const project = projects.find(p => p.id === entry.projectId);
                const isActive = entry.id === activeTimerId;
                const duration = entry.endTime 
                  ? ((new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime()) / (1000 * 60 * 60)).toFixed(2)
                  : 'Running';
                
                return (
                  <div key={entry.id} className={`group p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50/80 transition-all duration-200 border-l-4 ${isActive ? 'border-indigo-500 bg-indigo-50/30' : 'border-transparent'}`}>
                    <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                       <div className="flex items-center gap-3 mb-1.5">
                          <span className="font-bold text-slate-800 truncate text-base">{entry.description}</span>
                          {isActive && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-700 animate-pulse">ACTIVE</span>}
                       </div>
                       <div className="flex items-center gap-2 text-sm text-slate-500">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full`} style={{backgroundColor: project?.color || '#ccc'}}></span>
                          <span className="font-medium text-slate-600">{project?.name || 'Unknown Project'}</span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1"><Calendar size={13} className="text-slate-400"/> {new Date(entry.startTime).toLocaleDateString()}</span>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-6 sm:gap-8">
                       <div className="text-right">
                          <div className={`font-mono font-bold text-lg ${isActive ? 'text-indigo-600' : 'text-slate-700'}`}>
                            {duration}<span className="text-sm text-slate-400 ml-1 font-sans font-normal">h</span>
                          </div>
                          <div className="text-xs text-slate-400 font-medium flex items-center justify-end gap-1">
                             {new Date(entry.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             <span>-</span>
                             {entry.endTime ? new Date(entry.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                          </div>
                       </div>
                       <button 
                         onClick={() => deleteTimeEntry(entry.id)}
                         className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                         title="Delete Entry"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}