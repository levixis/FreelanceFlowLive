import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { Plus, Trash2, Briefcase, User, Mail, DollarSign, Palette } from 'lucide-react';
import { COLORS } from '../constants';

export default function ClientsProjects() {
  const { clients, projects, addClient, deleteClient, addProject, deleteProject } = useStore();
  const [activeTab, setActiveTab] = useState<'clients' | 'projects'>('clients');

  // Client Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  // Project Form State
  const [projectName, setProjectName] = useState('');
  const [projectRate, setProjectRate] = useState('');
  const [projectClient, setProjectClient] = useState('');
  const [projectColor, setProjectColor] = useState(COLORS[0]);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) return;
    await addClient({
      name: clientName,
      email: clientEmail
    });
    setClientName('');
    setClientEmail('');
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !projectClient) return;
    await addProject({
      clientId: projectClient,
      name: projectName,
      hourlyRate: parseFloat(projectRate) || 0,
      color: projectColor,
      currency: 'USD'
    });
    setProjectName('');
    setProjectRate('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Manage</h2>
            <p className="text-slate-500 mt-1 font-medium">Organize your clients and projects.</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm ${activeTab === 'clients' ? 'bg-white text-indigo-600 shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-700 shadow-none'}`}
            >
              Clients
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm ${activeTab === 'projects' ? 'bg-white text-indigo-600 shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-700 shadow-none'}`}
            >
              Projects
            </button>
          </div>
      </div>

      {activeTab === 'clients' ? (
        <div className="space-y-8 animate-fadeIn">
           <form onSubmit={handleAddClient} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-5 items-end">
              <div className="flex-1 w-full space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Client Name</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      value={clientName} 
                      onChange={e => setClientName(e.target.value)} 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                      placeholder="e.g. Acme Corp"
                    />
                </div>
              </div>
              <div className="flex-1 w-full space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Email (Optional)</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      value={clientEmail} 
                      onChange={e => setClientEmail(e.target.value)} 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                      placeholder="billing@acme.com"
                    />
                </div>
              </div>
              <button type="submit" className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5">
                <Plus size={20} /> Add Client
              </button>
           </form>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
             {clients.map(client => (
               <div key={client.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all group flex flex-col h-full">
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl">
                        {client.name.charAt(0)}
                    </div>
                    <button onClick={() => deleteClient(client.id)} className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors">
                       <Trash2 size={18} />
                    </button>
                 </div>
                 <h4 className="font-bold text-slate-800 text-lg mb-1">{client.name}</h4>
                 <p className="text-sm text-slate-500 flex items-center gap-2 mb-4">
                    <Mail size={14} /> {client.email || 'No email provided'}
                 </p>
                 <div className="mt-auto pt-4 border-t border-slate-50 flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    <Briefcase size={14} />
                    {projects.filter(p => p.clientId === client.id).length} Projects
                 </div>
               </div>
             ))}
           </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fadeIn">
           <form onSubmit={handleAddProject} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Project Name</label>
                  <input 
                    value={projectName} 
                    onChange={e => setProjectName(e.target.value)} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                    placeholder="e.g. Website Redesign"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Hourly Rate</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="number"
                        value={projectRate} 
                        onChange={e => setProjectRate(e.target.value)} 
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                        placeholder="150"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Client</label>
                  <select 
                    value={projectClient} 
                    onChange={e => setProjectClient(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="">Select Client</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 flex items-center gap-2">
                    <Palette size={14}/> Color Label
                  </label>
                  <div className="flex gap-2 flex-wrap bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    {COLORS.map(c => (
                      <button 
                        key={c}
                        type="button"
                        onClick={() => setProjectColor(c)}
                        className={`w-6 h-6 rounded-full transition-transform hover:scale-110 shadow-sm ${projectColor === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5">
                  <Plus size={20} /> Create Project
                </button>
              </div>
           </form>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
             {projects.map(project => {
               const client = clients.find(c => c.id === project.clientId);
               return (
                <div key={project.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all group relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: project.color }}></div>
                  
                  <div className="flex justify-between items-start mt-2 mb-2">
                     <h4 className="font-bold text-slate-800 text-lg">{project.name}</h4>
                     <button onClick={() => deleteProject(project.id)} className="text-slate-300 hover:text-rose-500 p-1.5 rounded-md transition-colors">
                        <Trash2 size={16} />
                     </button>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-slate-500 text-sm">
                      <User size={14} className="text-slate-400"/> {client?.name || 'Unknown Client'}
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rate</div>
                      <div className="font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                        ${project.hourlyRate}<span className="text-xs text-slate-400 font-normal">/hr</span>
                      </div>
                  </div>
                </div>
               );
             })}
           </div>
        </div>
      )}
    </div>
  );
}