import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { FileText, Download, Sparkles, AlertCircle, Printer } from 'lucide-react';
import { generateInvoiceSummary } from '../services/geminiService';

export default function Invoicing() {
  const { clients, projects, timeEntries } = useStore();
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Filter entries based on selection
  const relevantEntries = timeEntries.filter(entry => {
    if (!entry.endTime || !entry.billable) return false;
    if (selectedProjectId && entry.projectId !== selectedProjectId) return false;
    if (selectedClientId) {
       // If only client selected, find all projects for that client
       const project = projects.find(p => p.id === entry.projectId);
       if (project?.clientId !== selectedClientId) return false;
    }
    return true;
  });

  const totalHours = relevantEntries.reduce((acc, curr) => {
    const duration = (new Date(curr.endTime!).getTime() - new Date(curr.startTime).getTime()) / (1000 * 60 * 60);
    return acc + duration;
  }, 0);

  const totalAmount = relevantEntries.reduce((acc, curr) => {
    const project = projects.find(p => p.id === curr.projectId);
    if (!project) return acc;
    const duration = (new Date(curr.endTime!).getTime() - new Date(curr.startTime).getTime()) / (1000 * 60 * 60);
    return acc + (duration * project.hourlyRate);
  }, 0);

  const handleGenerateSummary = async () => {
    if (!selectedClient || !selectedProject) return;
    setIsGenerating(true);
    const summary = await generateInvoiceSummary(selectedClient, selectedProject, relevantEntries);
    setGeneratedSummary(summary);
    setIsGenerating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-[calc(100vh-140px)]">
      {/* Controls */}
      <div className="w-full xl:w-96 space-y-6 print:hidden flex-shrink-0">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
               <FileText size={20} />
            </div>
            <div>
               <h2 className="font-bold text-lg text-slate-800">Invoice Setup</h2>
               <p className="text-xs text-slate-500">Configure your invoice details</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Client</label>
            <select
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value);
                setSelectedProjectId(''); // Reset project
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white outline-none transition-all cursor-pointer"
            >
              <option value="">Select Client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Project (Optional)</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              disabled={!selectedClientId}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white outline-none transition-all disabled:opacity-50 cursor-pointer"
            >
              <option value="">All Projects</option>
              {projects
                .filter(p => p.clientId === selectedClientId)
                .map(p => <option key={p.id} value={p.id}>{p.name}</option>)
              }
            </select>
          </div>

          <hr className="border-slate-100" />

          {selectedClient && selectedProject && relevantEntries.length > 0 && (
            <button
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-all hover:-translate-y-0.5"
            >
              <Sparkles size={18} className={isGenerating ? "animate-spin" : ""} />
              {isGenerating ? 'Generating...' : 'AI Summary'}
            </button>
          )}

          <button
             onClick={handlePrint}
             disabled={!selectedClientId || relevantEntries.length === 0}
             className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-3.5 rounded-xl font-bold hover:bg-slate-700 transition-colors disabled:opacity-50 shadow-lg shadow-slate-900/10"
          >
             <Printer size={18} /> Print / PDF
          </button>
        </div>

        {!selectedClientId && (
           <div className="p-4 bg-blue-50 text-blue-800 rounded-xl text-sm flex gap-3 border border-blue-100">
             <AlertCircle size={20} className="mt-0.5 flex-shrink-0 text-blue-600" />
             <p className="font-medium">Select a client above to generate an invoice preview.</p>
           </div>
        )}
      </div>

      {/* Invoice Preview */}
      <div className="flex-1 bg-slate-200/50 rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex flex-col p-4 md:p-8 print:p-0 print:bg-white print:border-none print:shadow-none print:overflow-visible">
         {selectedClient ? (
           <div className="bg-white shadow-[0_4px_30px_rgba(0,0,0,0.08)] mx-auto w-full max-w-3xl min-h-[800px] p-10 md:p-14 flex flex-col print:shadow-none print:p-0">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-12 border-b border-slate-100 pb-8">
                 <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">INVOICE</h1>
                    <p className="text-slate-400 font-medium">#{Math.floor(Math.random() * 10000).toString().padStart(5, '0')}</p>
                 </div>
                 <div className="text-right">
                    <h3 className="font-bold text-lg text-slate-800">Freelancer Name</h3>
                    <p className="text-slate-500 text-sm mt-1">123 Creative Street<br/>Design City, DC 10012</p>
                 </div>
              </div>

              {/* Bill To & Details */}
              <div className="grid grid-cols-2 gap-12 mb-12">
                 <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Bill To</h4>
                    <p className="font-bold text-slate-800 text-lg mb-1">{selectedClient.name}</p>
                    <p className="text-slate-600">{selectedClient.email}</p>
                    {selectedClient.company && <p className="text-slate-600 font-medium">{selectedClient.company}</p>}
                 </div>
                 <div className="text-right space-y-4">
                    <div>
                       <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date</h4>
                       <p className="font-semibold text-slate-800">{new Date().toLocaleDateString()}</p>
                    </div>
                    <div>
                       <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Amount Due</h4>
                       <p className="font-extrabold text-3xl text-indigo-600">${totalAmount.toFixed(2)}</p>
                    </div>
                 </div>
              </div>

              {generatedSummary && (
                <div className="mb-10 bg-slate-50 p-6 rounded-xl border border-slate-100">
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Service Summary</h4>
                   <p className="text-slate-700 leading-relaxed italic font-medium">"{generatedSummary}"</p>
                </div>
              )}

              {/* Line Items */}
              <table className="w-full mb-12">
                 <thead>
                    <tr className="border-b border-slate-200">
                       <th className="text-left py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                       <th className="text-right py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hours</th>
                       <th className="text-right py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rate</th>
                       <th className="text-right py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {relevantEntries.map(entry => {
                       const project = projects.find(p => p.id === entry.projectId);
                       const hours = (new Date(entry.endTime!).getTime() - new Date(entry.startTime).getTime()) / (1000 * 60 * 60);
                       const amount = hours * (project?.hourlyRate || 0);
                       
                       return (
                          <tr key={entry.id}>
                             <td className="py-5 text-slate-700">
                                <p className="font-bold text-slate-800">{entry.description}</p>
                                <p className="text-xs text-slate-400 mt-1">{new Date(entry.startTime).toLocaleDateString()} • {project?.name}</p>
                             </td>
                             <td className="py-5 text-right text-slate-600 font-medium">{hours.toFixed(2)}</td>
                             <td className="py-5 text-right text-slate-600 font-medium">${project?.hourlyRate}</td>
                             <td className="py-5 text-right font-bold text-slate-800">${amount.toFixed(2)}</td>
                          </tr>
                       );
                    })}
                 </tbody>
                 <tfoot>
                    <tr className="border-t-2 border-slate-900">
                       <td colSpan={3} className="pt-6 text-right font-bold text-slate-800">Total</td>
                       <td className="pt-6 text-right font-extrabold text-2xl text-slate-900">${totalAmount.toFixed(2)}</td>
                    </tr>
                 </tfoot>
              </table>

              <div className="mt-auto pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
                 <p className="font-medium">Thank you for your business!</p>
              </div>
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                 <FileText size={32} className="opacity-50"/>
              </div>
              <p className="font-medium text-lg">Invoice Preview</p>
              <p className="text-sm opacity-70">Select a client to view details</p>
           </div>
         )}
      </div>
    </div>
  );
}