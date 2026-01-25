'use client';

import React, { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import EmailEntry from './email-entry';
import PasswordEntry from './password-entry';

type LoginFormProps = { className?: string };

export default function LoginForm({ className = '' }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string |  null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const clearNativeValidity = (el?: HTMLInputElement | null) => {
    try {
      el?.setCustomValidity('');
    } catch {
      // ignore
    }
  };

  const isValidEmailFormat = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

  const safeParseJson = async (res: Response) => {
    const text = await res.text().catch(() => '');
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return { text };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setPasswordError(null);
  setEmailError(null);

  const normalizedEmail = (email || '').toLowerCase().trim();

  if (!normalizedEmail) {
    setEmailError('Please enter your email.');
    clearNativeValidity(emailInputRef.current);
    return;
  }

  if (!isValidEmailFormat(normalizedEmail)) {
    setEmailError('Please enter a valid email address.');
    clearNativeValidity(emailInputRef.current);
    return;
  }

  if (!password) {
    setPasswordError('Please enter password');
    clearNativeValidity(passwordInputRef.current);
    return;
  }

  setLoading(true);

  try {
    const checkRes = await fetch('/api/auth/check-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ email: normalizedEmail }),
    });

    if (!checkRes.ok && checkRes.status !== 409) {
      const parsed = (await safeParseJson(checkRes)) || {};
      setError(parsed?.error || `Failed to check email (${checkRes.status})`);
      setLoading(false);
      return;
    }

    const checkBody = (await safeParseJson(checkRes)) || {};
    const exists = Boolean(checkBody.exists || checkBody.alreadyExists) || checkRes.status === 409;

    if (!exists) {
      // User does not exist, create account
      const createRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      if (!createRes.ok) {
        const parsed = (await safeParseJson(createRes)) || {};
        setError(parsed?.error || 'Failed to create a new account');
        setLoading(false);
        return;
      }

      // Account created successfully, redirect to onboarding
      router.push('/onboarding');
      setLoading(false);
      return;
    }

    // User exists, attempt sign in
    const signInResult = await signIn('credentials', {
      redirect: false,
      email: normalizedEmail,
      password,
    });

    if (signInResult?.ok) {
      router.push('/availability');
    } else if (signInResult?.error) {
      if (signInResult.error === 'CredentialsSignin') {
        setPasswordError('You entered an invalid password');
      } else {
        setError(signInResult.error);
      }
    } else {
      setError('Sign in failed. Please try again.');
    }
  } catch (err: any) {
    console.error('LoginForm submit error:', err);
    setError(err?.message || 'An unexpected error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};
  return (
    <div
      className={`relative w-full max-w-[420px] bg-[#16181d] border border-white/10 p-3 rounded-xl shadow-2xl flex flex-col ${className}`}
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      {/* Google Sign In (unchanged) */}
      <button
        onClick={() => signIn('google', { callbackUrl: '/availability' })}
        className="w-full flex items-center justify-center gap-2 bg-[#2f3b66] text-white h-8 rounded-full font-bold hover:bg-[#283253] transition-all active:scale-[0.98] px-3 shadow-lg"
        type="button"
      >
        <span className="truncate text-[11px]">Sign in or Sign up with Google</span>
      </button>

      <div className="relative py-1.5 w-full mt-3">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/5" />
        </div>
        <div className="relative flex justify-center text-[8px] uppercase">
          <span className="bg-[#16181d] px-2 text-gray-500 font-bold">OR</span>
        </div>
      </div>

      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-2 mt-3" autoComplete="off">
        <input
          type="text"
          name="fake-username"
          autoComplete="username"
          tabIndex={-1}
          aria-hidden
          style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
        />
        <input
          type="password"
          name="fake-password"
          autoComplete="new-password"
          tabIndex={-1}
          aria-hidden
          style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
        />

        <EmailEntry
          emailText={email}
          className=""
          onEmailChange={(val) => {
            setEmail(val);
            setEmailError(null);
            setError(null);
          }}
          error={emailError}
          ref={emailInputRef}
        />

        <PasswordEntry
          passwordText={password}
          className=""
          onPasswordChange={(val) => {
            setPassword(val);
            setPasswordError(null);
            setError(null);
          }}
          error={passwordError}
          ref={passwordInputRef}
        />

        {error && (
          <div className="text-sm text-red-400 bg-white/5 p-2 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-8 bg-brandPurpleButton hover:bg-purple-700 text-white rounded-lg font-bold text-[12px] transition-all active:scale-[0.98] border border-white/5 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Sign in or Sign up with Email'}
        </button>
      </form>
    </div>
  );
}