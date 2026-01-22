'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import WelcomeBanner from '@/components/welcome-banner';

function SignupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailFromUrl = searchParams.get('email') || '';

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
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
    setError('Please provide an email and password.');
    return;
  }

  setLoading(true);
  try {
    // Use the full email if name is empty
    const finalName = name.trim() || email;

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        name: finalName, 
        password 
      }),
    });

    // ... rest of your fetch logic
    if (res.ok) {
      router.push('/availability');
    }
  } catch (err) {
    // ... error handling
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-black text-white relative p-6">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% -20%, rgba(107, 70, 193, 0.3), transparent)',
        }}
      />

      <div className="fixed top-6 left-6 z-20">
        <WelcomeBanner className="flex-col justify-center text-left text-gray-300" showTagline={false} />
      </div>

      {/* Increased top padding to move form lower */}
      <div className="flex justify-center items-start min-h-screen pt-32 md:pt-40">
        <div className="w-full max-w-md space-y-6 bg-[#16181d] p-6 md:p-8 rounded-2xl border border-white/10 z-10 relative">
          <h1 className="text-2xl font-bold text-center">Create your account</h1>

          {error && (
            <div className="text-sm text-red-400 bg-white/5 p-3 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Full Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 bg-[#1e2128] border border-white/10 rounded-lg px-3 text-sm focus:border-purple-500 outline-none"
            />

            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 bg-[#1e2128] border border-white/10 rounded-lg px-3 text-sm focus:border-purple-500 outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 bg-[#1e2128] border border-white/10 rounded-lg px-3 text-sm focus:border-purple-500 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-brandPurpleButton hover:bg-purple-700 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <a
              className="text-purple-300 hover:text-purple-200 font-medium"
              href={`/auth/signin?email=${encodeURIComponent(email)}`}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}