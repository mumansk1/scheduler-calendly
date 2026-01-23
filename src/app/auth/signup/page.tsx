'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeBanner from '@/components/welcome-banner';
import { signIn } from 'next-auth/react';

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // mode: 'signup' or 'signin'
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');

  const isValidEmailFormat = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const safeParseJson = async (res: Response) => {
    const text = await res.text().catch(() => '');
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return { text };
    }
  };

  const attemptSignIn = async (normalizedEmail: string) => {
    // attempt credentials sign-in
    const result = await signIn('credentials', {
      redirect: false,
      email: normalizedEmail,
      password,
    });

    if (result?.ok) {
      router.push('/availability');
      return true;
    }

    // not successful
    setError(result?.error || 'Sign in failed. Please check your credentials.');
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const normalized = String(email || '').toLowerCase().trim();

      if (!normalized || !isValidEmailFormat(normalized)) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      if (!password) {
        setError('Please enter a password.');
        setLoading(false);
        return;
      }

      // 1) Check if email exists (tolerant handling)
      const checkRes = await fetch('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
        body: JSON.stringify({ email: normalized }),
      });

      let exists = false;
      if (checkRes.ok) {
        const body = (await safeParseJson(checkRes)) || {};
        exists = Boolean(body.exists || body.alreadyExists);
      } else if (checkRes.status === 409) {
        // treat 409 as "exists"
        exists = true;
      } else {
        // other non-ok -> surface server message
        const parsed = (await safeParseJson(checkRes)) || {};
        setError(parsed?.error || `Failed to check email (${checkRes.status})`);
        setLoading(false);
        return;
      }

      if (exists) {
        // Email exists -> switch to sign-in flow (no "email registered" error)
        setMode('signin');
        const signed = await attemptSignIn(normalized);
        setLoading(false);
        return;
      }

      // 2) Email not found -> try signup
      setMode('signup');

      const signupRes = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalized,
          name: name?.trim() || normalized,
          password,
        }),
      });

      if (signupRes.ok) {
        // server may return 201 or 200 with alreadyExists flag
        const body = (await safeParseJson(signupRes)) || {};
        if (body.alreadyExists || signupRes.status === 200 && body.alreadyExists === true) {
          // server says user exists — switch to sign-in and attempt sign-in
          setMode('signin');
          const signed = await attemptSignIn(normalized);
          setLoading(false);
          return;
        }

        // If created (201) -> success
        if (signupRes.status === 201 || signupRes.status === 200) {
          router.push('/availability');
          return;
        }

        // Otherwise surface any message
        setError(body?.error || `Unexpected signup response (${signupRes.status})`);
        setLoading(false);
        return;
      } else {
        // Non-ok response: if server uses 409 for conflict treat as exists and attempt sign-in
        if (signupRes.status === 409) {
          setMode('signin');
          const signed = await attemptSignIn(normalized);
          setLoading(false);
          return;
        }

        const body = (await safeParseJson(signupRes)) || {};
        setError(body?.error || `Failed to create account (${signupRes.status})`);
        setLoading(false);
        return;
      }
    } catch (err: any) {
      console.error('Signup page error:', err);
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative p-6" style={{ fontFamily: '"Inter", sans-serif' }}>
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

      <div className="flex justify-center items-start min-h-screen pt-24 md:pt-32">
        <div className="w-full max-w-md space-y-6 bg-[#16181d] p-6 md:p-8 rounded-2xl border border-white/10 z-10 relative">
          <h1 className="text-2xl font-bold text-center">
            {mode === 'signup' ? 'Create your account' : 'Sign in to your account'}
          </h1>

          <p className="text-center text-sm text-gray-400">
            Enter your email and password to {mode === 'signup' ? 'create an account' : 'sign in'}.
          </p>

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="text-sm text-red-400 bg-white/5 p-3 rounded-md"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <input
                type="text"
                placeholder="Full name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 bg-[#1e2128] border border-white/10 rounded-lg px-3 text-sm focus:border-purple-500 outline-none"
                disabled={loading}
              />
            )}

            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 bg-[#1e2128] border border-white/10 rounded-lg px-3 text-sm focus:border-purple-500 outline-none"
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 bg-[#1e2128] border border-white/10 rounded-lg px-3 text-sm focus:border-purple-500 outline-none"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-brandPurpleButton hover:bg-purple-700 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : mode === 'signup' ? 'Create Account' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}