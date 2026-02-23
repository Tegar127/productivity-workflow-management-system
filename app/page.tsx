import Link from 'next/link'
import { CheckCircle, BarChart3, ShieldCheck, Zap, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Zap className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">ProWorkflow</span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#solutions" className="hover:text-indigo-600 transition-colors">Solutions</a>
          <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-semibold hover:text-indigo-600 transition-colors">
            Sign in
          </Link>
          <Link href="/login" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 pt-20 pb-32 max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 space-y-8">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">New: AI Smart Priority v2.0</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Manage Workflow <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              With Precision.
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
            The ultimate system for high-performance teams. Automate your tasks, handle multi-level approvals, and analyze productivity with data-driven insights.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/dashboard" className="flex items-center justify-center bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all group">
              Explore Dashboard
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="flex items-center justify-center border border-slate-200 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all">
              Watch Demo
            </button>
          </div>
          <div className="flex items-center space-x-6 pt-4 grayscale opacity-50">
            <span className="font-bold text-xl italic">TRUSTED BY TEAMS AT</span>
            <div className="flex space-x-4 font-mono text-sm tracking-tighter">
              <span>FORBES</span>
              <span>GHOST</span>
              <span>VERCEL</span>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 mt-16 md:mt-0 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-10"></div>
          <div className="relative border border-slate-200 rounded-3xl overflow-hidden shadow-2xl bg-white">
             {/* Mockup Dashboard UI */}
             <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="w-1/2 h-2 bg-slate-200 rounded-full"></div>
             </div>
             <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-indigo-50 rounded-xl animate-pulse"></div>
                  <div className="h-20 bg-slate-50 rounded-xl animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                </div>
                <div className="flex justify-between items-center border-t pt-6">
                   <div className="flex -space-x-2">
                      {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>)}
                   </div>
                   <div className="w-24 h-8 bg-indigo-600 rounded-lg"></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-slate-50 py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Everything you need to scale</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              One platform. Infinite possibilities. Built for speed and security.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: CheckCircle, title: 'Multi-Level Approvals', desc: 'Secure approval flow for Managers and Admins to ensure quality.' },
              { icon: Zap, title: 'Smart Priority Engine', desc: 'Dynamic priority scaling based on deadlines and task activity.' },
              { icon: BarChart3, title: 'Real-time Analytics', desc: 'Detailed productivity reports and team performance tracking.' },
              { icon: ShieldCheck, title: 'Enterprise Security', desc: 'Row Level Security (RLS) ensuring your data is always safe.' },
              { icon: BarChart3, title: 'Activity Logging', desc: 'Transparent audit logs for every action within the system.' },
              { icon: Zap, title: 'Seamless Workflow', desc: 'Optimized transitions from pending to completed status.' }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all group">
                <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                  <f.icon className="text-indigo-600 h-6 w-6 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-slate-100 text-center">
        <div className="max-w-7xl mx-auto space-y-8">
           <div className="flex items-center justify-center space-x-2">
            <Zap className="text-indigo-600 h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight">ProWorkflow</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 ProWorkflow Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
