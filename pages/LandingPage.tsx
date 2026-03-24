import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, BarChart3, Users, Zap, Shield, ArrowRight, CheckCircle, Sparkles, ChevronDown } from 'lucide-react';

const FEATURES = [
  {
    icon: Clock,
    title: 'Smart Time Tracking',
    description: 'Track every minute with our intuitive time logger. Start, stop, and categorize entries effortlessly.',
    color: 'from-blue-500 to-cyan-400',
    bg: 'bg-blue-500/10',
    text: 'text-blue-600',
  },
  {
    icon: DollarSign,
    title: 'Instant Invoicing',
    description: 'Generate professional invoices from tracked hours in seconds. Get paid faster, stress less.',
    color: 'from-emerald-500 to-teal-400',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600',
  },
  {
    icon: Users,
    title: 'Client Management',
    description: 'Organize clients and projects seamlessly. Keep all your business relationships in one place.',
    color: 'from-violet-500 to-purple-400',
    bg: 'bg-violet-500/10',
    text: 'text-violet-600',
  },
  {
    icon: BarChart3,
    title: 'AI-Powered Insights',
    description: 'Get intelligent productivity analysis and actionable recommendations powered by Google Gemini.',
    color: 'from-orange-500 to-amber-400',
    bg: 'bg-orange-500/10',
    text: 'text-orange-600',
  },
];

const STATS = [
  { value: '10x', label: 'Faster Invoicing' },
  { value: '99%', label: 'Uptime' },
  { value: '24/7', label: 'Access Anywhere' },
  { value: '0$', label: 'Free Forever' },
];

const AnimatedCounter = ({ target, suffix = '' }: { target: string; suffix?: string }) => {
  const [display, setDisplay] = useState(target);
  return <span>{display}{suffix}</span>;
};

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  return (
    <div className="min-h-screen bg-[#fafbff] overflow-hidden">
      {/* ============ NAVBAR ============ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50
            ? 'bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-b border-slate-100/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Clock className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              Freelance<span className="text-indigo-600">Flow</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="#stats" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
              Why Us
            </a>
            <a href="#cta" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
              Get Started
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ============ HERO SECTION ============ */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-32 px-6 lg:px-8">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-[30%] -left-[15%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-30"
            style={{
              background: 'radial-gradient(circle, #818cf8, transparent 70%)',
              transform: `translateY(${scrollY * 0.1}px)`,
            }}
          />
          <div
            className="absolute top-[20%] -right-[15%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20"
            style={{
              background: 'radial-gradient(circle, #a78bfa, transparent 70%)',
              transform: `translateY(${scrollY * 0.05}px)`,
            }}
          />
          <div
            className="absolute bottom-[10%] left-[30%] w-[30%] h-[30%] rounded-full blur-[100px] opacity-15"
            style={{
              background: 'radial-gradient(circle, #6ee7b7, transparent 70%)',
              transform: `translateY(${scrollY * -0.08}px)`,
            }}
          />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8 animate-fadeIn">
              <Sparkles size={14} />
              AI-Powered Freelance Management
            </div>

            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 tracking-tight leading-[0.95] mb-8 animate-fadeIn"
              style={{ animationDelay: '0.1s' }}
            >
              Your freelance
              <br />
              business,{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_ease-in-out_infinite]">
                simplified
              </span>
            </h1>

            <p
              className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium mb-12 animate-fadeIn"
              style={{ animationDelay: '0.2s' }}
            >
              Track time, manage clients, generate invoices, and get AI-powered productivity insights — all in one
              beautiful workspace.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn"
              style={{ animationDelay: '0.3s' }}
            >
              <Link
                to="/register"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                Start Free Today
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-bold px-8 py-4 rounded-2xl text-lg border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-lg transition-all duration-300"
              >
                See How It Works
                <ChevronDown size={20} />
              </a>
            </div>
          </div>

          {/* Hero visual — floating dashboard mockup */}
          <div
            className="mt-20 md:mt-28 relative animate-fadeIn"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#fafbff] via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-[0_40px_100px_-20px_rgba(99,102,241,0.15)] p-6 md:p-8 mx-auto max-w-5xl">
              {/* Mock Dashboard Header */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className="ml-4 h-6 w-48 bg-slate-100 rounded-lg" />
              </div>
              {/* Mock Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Earnings', value: '$4,280', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Hours', value: '162.5h', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Billable', value: '148.2h', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: 'Projects', value: '7', color: 'text-orange-600', bg: 'bg-orange-50' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`${stat.bg} rounded-2xl p-4 border border-slate-100/50`}
                  >
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
              {/* Mock Chart */}
              <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100/50">
                <div className="flex items-end justify-between h-32 gap-3">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className={`w-full rounded-lg transition-all duration-1000 ${
                          h > 60
                            ? 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                            : 'bg-slate-200'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-[10px] font-medium text-slate-400">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SOCIAL PROOF STATS ============ */}
      <section
        id="stats"
        data-animate
        className={`py-16 md:py-24 px-6 lg:px-8 transition-all duration-1000 ${
          isVisible('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-8 md:p-12 shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
              {STATS.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">{stat.value}</div>
                  <div className="text-indigo-200 text-sm font-semibold uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section id="features" className="py-16 md:py-28 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            id="features-header"
            data-animate
            className={`text-center max-w-2xl mx-auto mb-16 md:mb-20 transition-all duration-1000 ${
              isVisible('features-header') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Zap size={14} />
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                thrive
              </span>
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Stop juggling between apps. FreelanceFlow combines all your essential tools into one elegant platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                id={`feature-${i}`}
                data-animate
                className={`group bg-white rounded-3xl border border-slate-100 p-8 md:p-10 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-500 cursor-default ${
                  isVisible(`feature-${i}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={feature.text} size={26} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-16 md:py-28 px-6 lg:px-8 bg-slate-50/80">
        <div className="max-w-5xl mx-auto">
          <div
            id="how-header"
            data-animate
            className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${
              isVisible('how-header') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
              Up and running in{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                3 steps
              </span>
            </h2>
            <p className="text-lg text-slate-500 font-medium">No credit card. No complex setup. Just start tracking.</p>
          </div>

          <div
            id="steps"
            data-animate
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 ${
              isVisible('steps') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {[
              {
                step: '01',
                title: 'Create an Account',
                desc: 'Sign up in seconds — completely free, no strings attached.',
                icon: Shield,
              },
              {
                step: '02',
                title: 'Add Your Projects',
                desc: 'Set up clients and projects with hourly rates.',
                icon: Users,
              },
              {
                step: '03',
                title: 'Start Tracking',
                desc: 'Log time, generate invoices, and watch your insights grow.',
                icon: Zap,
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                <div className="text-7xl font-extrabold text-indigo-100 group-hover:text-indigo-200 transition-colors mb-4">
                  {item.step}
                </div>
                <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 shadow-lg flex items-center justify-center mx-auto mb-5 group-hover:-translate-y-1 transition-transform">
                  <item.icon className="text-indigo-600" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section id="cta" className="py-20 md:py-32 px-6 lg:px-8">
        <div
          id="cta-content"
          data-animate
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            isVisible('cta-content') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="relative">
            {/* Background glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[60%] h-40 bg-indigo-400/20 blur-[80px] rounded-full" />

            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 relative">
              Ready to take control
              <br />
              of your{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                freelance life?
              </span>
            </h2>
            <p className="text-lg text-slate-500 font-medium mb-10 max-w-xl mx-auto relative">
              Join thousands of freelancers who streamlined their workflow with FreelanceFlow.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
              <Link
                to="/register"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-10 py-4 rounded-2xl text-lg hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                Create Free Account
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" />
                Free forever
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" />
                Setup in 30 seconds
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-slate-100 py-10 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Clock className="text-white" size={16} />
            </div>
            <span className="text-sm font-bold text-slate-800">
              Freelance<span className="text-indigo-600">Flow</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} FreelanceFlow. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ============ CUSTOM ANIMATIONS ============ */}
      <style>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
      `}</style>
    </div>
  );
}
