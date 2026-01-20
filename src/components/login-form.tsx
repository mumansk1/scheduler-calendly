'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

type LoginFormProps = {
  className?: string;
};

export default function LoginForm({ className = '' }: LoginFormProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn('email', { email, callbackUrl: '/dashboard' });
  };

  return (
    <div 
      className={`relative w-full max-w-[450px] bg-[#16181d] border border-white/10 p-2.5 rounded-xl shadow-2xl flex flex-col ${className}`} 
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      {/* Google Sign In - Compact height */}
      <button
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        className="w-full flex items-center justify-center gap-2 bg-[#2f3b66] text-white h-9 rounded-full font-bold hover:bg-[#283253] transition-all active:scale-[0.98] px-3 shadow-lg"
        type="button"
      >
        <div className="bg-white p-0.5 rounded-full flex-shrink-0">
          <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.6 12.227c0-.682-.062-1.337-.178-1.964H12v3.724h5.44c-.234 1.264-.945 2.337-2.013 3.055v2.542h3.25c1.903-1.75 3-4.329 3-7.357z" fill="#4285F4" />
            <path d="M12 22c2.7 0 4.976-.892 6.64-2.42l-3.25-2.54c-.9.604-2.046.962-3.39.962-2.602 0-4.81-1.76-5.6-4.12H3.04v2.586C4.7 19.88 8.02 22 12 22z" fill="#34A853" />
            <path d="M6.4 14.403c-.198-.597-.316-1.223-.316-1.883s.118-1.286.316-1.883V8.05H3.04C2.37 9.243 2 10.64 2 12c0 1.36.37 2.757 1.04 3.95l3.36-1.547z" fill="#FBBC05" />
            <path d="M12 6.5c1.47 0 2.8.51 3.86 1.5l2.88-2.88C16.97 3.02 14.78 2 12 2 8.02 2 4.7 4.12 3.04 7.09l3.36 1.547C9.19 7.01 10.4 6.5 12 6.5z" fill="#EA4335" />
          </svg>
        </div>
        <span className="truncate text-[11px]">Sign in or Sign up with Google</span>
      </button>

      {/* Divider - Minimal vertical margin */}
      <div className="relative py-1.5 w-full">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
        <div className="relative flex justify-center text-[8px] uppercase">
          <span className="bg-[#16181d] px-2 text-gray-500 font-bold">OR</span>
        </div>
      </div>

      {/* Email Form - Inline and compact */}
      <form onSubmit={handleSubmit} className="flex gap-1.5 items-center">
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 h-9 bg-[#1e2128] border border-white/5 rounded-lg px-3 text-[11px] placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all text-white"
        />
        <button
          type="submit"
          className="h-9 px-4 bg-[#1e2128] text-white rounded-lg font-bold text-[11px] hover:bg-[#252932] transition-all active:scale-[0.98] border border-white/5"
        >
          Enter
        </button>
      </form>
    </div>
  );
}