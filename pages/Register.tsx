import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../constants';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute bottom-[20%] left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-300/20 blur-[100px]"></div>
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-purple-300/20 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] border border-white/50 p-8 md:p-10 space-y-8 relative z-10">
        <div className="text-center">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
            <Clock className="text-white" size={28} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Create Account</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Start tracking your time professionally</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl flex gap-3 text-sm border border-rose-100">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}