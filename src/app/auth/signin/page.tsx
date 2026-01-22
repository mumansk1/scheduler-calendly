// src/app/auth/signin/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import WelcomeBanner from '@/components/welcome-banner';

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailFromUrl = searchParams.get('email') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (emailFromUrl) setEmail(emailFromUrl);
  }, [emailFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      // We use redirect: false so we can catch the error and show it on this page
      const result = await signIn('credentials', {
        redirect: false,
        email: email.toLowerCase().trim(),
        password: password,
      });

      if (result?.error) {
        // NextAuth returns specific error strings (e.g., "CredentialsSignin")
        // You can map them to user-friendly messages if desired
        setError('Invalid email or password. Please try again.');
      } else if (result?.ok) {
        // Success! Send them to the availability page
        router.push('/availability');
        router.refresh(); // Ensure the session state updates
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative p-6">
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% -20%, rgba(107, 70, 193, 0.3), transparent)',
        }}
      />

      {/* WelcomeBanner fixed top-left */}
      <div className="fixed top-6 left-6 z-20">
        <WelcomeBanner 
          className="flex-col justify-center text-left text-gray-300" 
          showTagline={false} 
        />
      </div>

      {/* Centered sign-in form moved lower with pt-32/40 */}
      <div className="flex justify-center items-start min-h-screen pt-32 md:pt-40">
        <div className="w-full max-w-md space-y-6 bg-[#16181d] p-6 md:p-8 rounded-2xl border border-white/10 z-10 relative">
          <h1 className="text-2xl font-bold text-center">Sign in to your account</h1>

          {error && (
            <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 bg-[#1e2128] border border-white/10 rounded-lg px-3 text-sm focus:border-purple-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 bg-[#1e2128] border border-white/10 rounded-lg px-3 text-sm focus:border-purple-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-brandPurpleButton hover:bg-purple-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="pt-2 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <a
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                href={`/auth/signup?email=${encodeURIComponent(email)}`}
              >
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
          <div className="animate-pulse">Loading...</div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}