'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type LoginFormProps = {
  className?: string;
};

export default function LoginForm({ className = '' }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const normalizedEmail = email.toLowerCase().trim();

      if (!normalizedEmail || !password) {
        setError('Please enter both email and password.');
        setLoading(false);
        return;
      }

      // Check if email exists
      const checkRes = await fetch('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      if (!checkRes.ok) {
        const errBody = await checkRes.json().catch(() => ({}));
        setError(errBody.error || `Failed to check email (${checkRes.status})`);
        setLoading(false);
        return;
      }

      const checkData = await checkRes.json();

      if (!checkData.exists) {
        // Email not registered, redirect to signup with email prefilled
        router.push(`/auth/signup?email=${encodeURIComponent(normalizedEmail)}`);
        setLoading(false);
        return;
      }

      // Email exists, attempt sign-in
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: normalizedEmail,
        password,
      });

      if (signInResult?.error) {
        setError(signInResult.error || 'Sign in failed. Please check your credentials.');
      } else if (signInResult?.ok) {
        router.push('/availability');
      } else {
        setError('Sign in failed. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative w-full max-w-[348px] bg-[#16181d] border border-white/10 p-3 rounded-xl shadow-2xl flex flex-col ${className}`}
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      {/* Google Sign In */}
      <button
        onClick={() => signIn('google', { callbackUrl: '/availability' })}
        className="w-full flex items-center justify-center gap-2 bg-[#2f3b66] text-white h-7 rounded-full font-bold hover:bg-[#283253] transition-all active:scale-[0.98] px-3 shadow-lg"
        type="button"
      >
        <div className="bg-white p-0.5 rounded-full flex-shrink-0">
          {/* Google SVG icon */}
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path fill="#4285F4" d="M23.64 12.204c0-.828-.074-1.62-.213-2.376H12v4.5h6.36a5.43 5.43 0 01-2.34 3.57v2.97h3.78c2.22-2.04 3.5-5.04 3.5-8.664z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.964-1.08 7.952-2.928l-3.78-2.97c-1.05.7-2.4 1.11-4.172 1.11-3.21 0-5.928-2.16-6.9-5.07H1.26v3.18A11.997 11.997 0 0012 24z" />
            <path fill="#FBBC05" d="M5.1 14.142a7.2 7.2 0 010-4.284V6.678H1.26a11.997 11.997 0 000 10.644l3.84-3.18z" />
            <path fill="#EA4335" d="M12 4.77c1.764 0 3.348.606 4.59 1.8l3.44-3.44C17.964 1.29 15.24 0 12 0 7.26 0 3.18 2.7 1.26 6.678l3.84 3.18c.972-2.91 3.69-5.07 6.9-5.07z" />
          </svg>
        </div>
        <span className="truncate text-[11px]">Sign in or Sign up with Google</span>
      </button>

      {/* Divider */}
      <div className="relative py-1.5 w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/5" />
        </div>
        <div className="relative flex justify-center text-[8px] uppercase">
          <span className="bg-[#16181d] px-2 text-gray-500 font-bold">OR</span>
        </div>
      </div>

      {/* Email + Password Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-7 bg-[#1e2128] border border-white/10 rounded-lg px-2 text-sm focus:border-purple-500 outline-none text-white placeholder:text-gray-500"
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-7 bg-[#1e2128] border border-white/10 rounded-lg px-2 text-sm focus:border-purple-500 outline-none text-white placeholder:text-gray-500"
          disabled={loading}
        />

        {error && (
          <div className="text-sm text-red-400 bg-white/5 p-2 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-7 bg-brandPurpleButton hover:bg-purple-700 text-white rounded-lg font-bold text-[12px] hover:bg-[#252932] transition-all active:scale-[0.98] border border-white/5 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Sign in or Sign up with Email'}
        </button>
      </form>
    </div>
  );
}