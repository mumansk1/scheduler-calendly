'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type LoginFormProps = {
  className?: string;
};

export default function LoginForm({ className = '' }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        // Handle error response
        const errorData = await res.json();
        alert(errorData.error || 'Failed to check email');
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.exists) {
        // User exists, sign in with magic link
        await signIn('email', { email, callbackUrl: '/availability' });
      } else {
        // User does not exist, redirect to signup page with email prefilled
        router.push(`/auth/signup?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      console.error('Error checking email:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative w-full max-w-[450px] bg-[#16181d] border border-white/10 p-2.5 rounded-xl shadow-2xl flex flex-col ${className}`}
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      {/* Google Sign In - Compact height */}
      <button
        onClick={() => signIn('google', { callbackUrl: '/availability' })}
        className="w-full flex items-center justify-center gap-2 bg-[#2f3b66] text-white h-9 rounded-full font-bold hover:bg-[#283253] transition-all active:scale-[0.98] px-3 shadow-lg"
        type="button"
      >
        <div className="bg-white p-0.5 rounded-full flex-shrink-0">
          {/* Google SVG icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {/* ... paths ... */}
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

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="flex gap-1.5 items-center">
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 h-9 bg-[#1e2128] border border-white/5 rounded-lg px-3 text-[11px] placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all text-white"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="h-9 px-4 bg-[#1e2128] text-white rounded-lg font-bold text-[11px] hover:bg-[#252932] transition-all active:scale-[0.98] border border-white/5 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Enter'}
        </button>
      </form>
    </div>
  );
}