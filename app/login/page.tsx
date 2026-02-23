'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Zap, ArrowRight, ShieldCheck, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('Member')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })
      if (error) setError(error.message)
      else alert('Check your email for confirmation!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) setError(error.message)
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-white font-sans text-slate-900">
      {/* Left Column: Branding/Marketing */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-600 p-12 flex-col justify-between overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
        
        <Link href="/" className="relative flex items-center space-x-2 text-white z-10">
          <Zap className="h-8 w-8 text-indigo-300 fill-indigo-300" />
          <span className="text-2xl font-bold tracking-tight">ProWorkflow</span>
        </Link>

        <div className="relative z-10 space-y-8">
          <h2 className="text-5xl font-extrabold text-white leading-tight">
            Elevate your team's <br />
            <span className="text-indigo-200">Productivity.</span>
          </h2>
          <p className="text-indigo-100 text-lg max-w-md">
            The all-in-one platform for professional task management, multilevel approvals, and smart workflow automation.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-white/80">
              <ShieldCheck className="h-5 w-5 text-indigo-300" />
              <span className="text-sm font-medium">Enterprise-grade security (RLS)</span>
            </div>
            <div className="flex items-center space-x-3 text-white/80">
              <ShieldCheck className="h-5 w-5 text-indigo-300" />
              <span className="text-sm font-medium">Real-time collaboration & logs</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-12 border-t border-white/10">
          <p className="text-white/60 text-sm">© 2026 ProWorkflow Management System</p>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-10">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="h-10 w-10 text-indigo-600" />
              <span className="text-2xl font-bold">ProWorkflow</span>
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              {isSignUp ? 'Create account' : 'Welcome back'}
            </h1>
            <p className="text-slate-500">
              {isSignUp ? 'Start managing your workflow today.' : 'Please enter your details to sign in.'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleAuth}>
            {error && (
              <div className="rounded-xl bg-rose-50 border border-rose-100 p-4 text-sm text-rose-700 animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Assign Role</label>
                    <select
                      className="w-full rounded-xl border border-slate-200 py-3 px-4 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all appearance-none"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="Member">Member (General User)</option>
                      <option value="Manager">Manager (Approver)</option>
                      <option value="Admin">Admin (Full Access)</option>
                    </select>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-slate-700">Password</label>
                  {!isSignUp && <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot?</button>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all disabled:opacity-70 shadow-lg shadow-indigo-100"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Create account' : 'Sign in'}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-6">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              {isSignUp ? (
                <>Already have an account? <span className="text-indigo-600">Sign in</span></>
              ) : (
                <>Don't have an account? <span className="text-indigo-600">Get started</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
