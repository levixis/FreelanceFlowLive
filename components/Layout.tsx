import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Clock, Briefcase, Users, FileText, Menu, X, StopCircle, LogOut, ChevronRight } from 'lucide-react';
import { useStore } from '../context/Store';
import { useAuth } from '../context/AuthContext';

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-indigo-500/10 text-indigo-400 font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'
            : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={20} className={`transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
          <span className="font-medium tracking-wide text-sm">{label}</span>
          {isActive && <ChevronRight size={16} className="ml-auto text-indigo-500/50" />}
        </>
      )}
    </NavLink>
  );
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const { activeTimerId, timeEntries, stopActiveTimer } = useStore();
  const { user, logout } = useAuth();

  const activeEntry = activeTimerId ? timeEntries.find(t => t.id === activeTimerId) : null;

  // Close sidebar on route change on mobile
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] text-white transform transition-transform duration-300 ease-out md:relative md:translate-x-0 flex flex-col shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-8 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Clock className="text-white" size={22} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight leading-none">Freelance<span className="text-indigo-400">Flow</span></h1>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-1">Workspace</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-6 overflow-y-auto custom-scrollbar">
          <div className="px-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Menu</div>
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/time" icon={Clock} label="Time Log" />
          <NavItem to="/projects" icon={Briefcase} label="Projects" />
          <NavItem to="/clients" icon={Users} label="Clients" />
          <NavItem to="/invoices" icon={FileText} label="Invoices" />
        </nav>

        {/* Active Timer Widget in Sidebar */}
        {activeEntry && (
          <div className="mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity">
               <div className="w-16 h-16 rounded-full bg-indigo-500 blur-2xl"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Timer Running</p>
              </div>
              <p className="text-sm text-white font-medium truncate mb-3 pl-1">{activeEntry.description || 'No description'}</p>
              <button 
                onClick={stopActiveTimer}
                className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/30 py-2 rounded-lg text-xs font-bold transition-all"
              >
                <StopCircle size={14} /> STOP
              </button>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-slate-800/50 mt-2">
          <button 
            onClick={logout}
            className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 transition-all w-full px-4 py-3 rounded-xl group"
          >
            <LogOut size={20} className="group-hover:text-rose-400 transition-colors" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc]">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-white transition-colors"
            >
              <Menu size={24} />
            </button>
            
            <h1 className="text-2xl font-bold text-slate-800 hidden md:block tracking-tight">
              {location.pathname === '/' ? 'Dashboard' : 
               location.pathname === '/time' ? 'Time Log' :
               location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2)}
            </h1>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-800 leading-none mb-1">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center font-bold text-indigo-600 text-lg">
                   {user?.name?.charAt(0) || 'U'}
                </div>
             </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 pt-0">
          <div className="max-w-7xl mx-auto animate-fadeIn">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}