'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Building2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length > 7) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = getPasswordStrength();
  
  const getStrengthColor = () => {
    if (strength === 0) return 'bg-slate-700/50';
    if (strength <= 1) return 'bg-red-500';
    if (strength === 2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength === 0) return '';
    if (strength <= 1) return 'Weak';
    if (strength === 2) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const supabase = createClient();

      // Sign up with Supabase Auth
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
          data: {
            full_name: fullName,
            organization_name: orgName,
          },
        },
      });

      if (signUpError) {
        // Fallback: try signing in directly if user was already registered
        const { data: fallbackSignIn } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (fallbackSignIn?.session) {
          router.push('/dashboard');
          router.refresh();
          return;
        }

        if (signUpError.message.toLowerCase().includes('rate limit')) {
          setError('Supabase email limit reached. Try logging in directly with your password, or turn off Email Confirmation in Supabase.');
        } else {
          setError(signUpError.message);
        }
        setIsLoading(false);
        return;
      }

      // If user was created, create profile
      if (data.user) {
        await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            organization_name: orgName || null,
            credits: 5,
            role: 'poll_creator',
          }, { onConflict: 'id' });
      }

      // If session exists, redirect
      if (data.session) {
        router.push('/dashboard');
        router.refresh();
        return;
      }

      // Try automatic sign in (works when email confirmation is disabled or user already exists)
      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInData?.session) {
        router.push('/dashboard');
        router.refresh();
      } else {
        // If email confirmation is strictly enforced in Supabase
        setSuccess('Account registered! You can now log in directly with your email and password.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
        <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 text-xs font-medium px-3 py-1 rounded-full border border-indigo-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Start with 5 free credits
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300 ml-1">Full name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-500"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300 ml-1">Organization <span className="text-slate-500 text-xs font-normal">(Optional)</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Building2 className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-500"
                placeholder="Acme Inc."
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-500"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-9 pr-9 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-500"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {/* Password strength indicator */}
          {password && (
            <div className="flex items-center gap-2 mt-1 px-1">
              <div className="flex-1 flex gap-1 h-1.5">
                {[1, 2, 3, 4].map((level) => (
                  <div 
                    key={level} 
                    className={`h-full flex-1 rounded-full transition-colors ${
                      level <= strength ? getStrengthColor() : 'bg-slate-700/50'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-[10px] font-medium uppercase tracking-wider w-12 text-right ${
                strength <= 1 ? 'text-red-400' : strength === 2 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {getStrengthText()}
              </span>
            </div>
          )}
        </div>

        <label className="flex items-start gap-2 mt-2 cursor-pointer group">
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-white/5 checked:bg-indigo-500 checked:border-indigo-500 transition-all cursor-pointer"
            />
            <svg
              className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
            I agree to the <Link href="#" className="text-indigo-400 hover:text-indigo-300 hover:underline">Terms of Service</Link> and <Link href="#" className="text-indigo-400 hover:text-indigo-300 hover:underline">Privacy Policy</Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading || !agreeTerms}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg py-2.5 text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-400 hover:to-purple-500 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
        </button>
      </form>

      <div className="relative flex items-center justify-center mt-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative px-3 bg-transparent backdrop-blur-xl">
          <span className="text-xs text-slate-500">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        className="w-full bg-white/5 border border-white/10 text-white rounded-lg py-2 text-sm font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google
      </button>

      <p className="text-center text-sm text-slate-400 mt-1">
        Already have an account?{' '}
        <Link href="/login" className="text-white hover:text-indigo-400 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
