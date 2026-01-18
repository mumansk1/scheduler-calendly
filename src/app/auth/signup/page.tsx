'use client';

import Head from 'next/head';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/onboarding',
    });

    setIsLoading(false);
  };

  return (
    <>
      <Head>
        {/* Roboto (same as Landing) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-black text-white flex flex-col px-6 selection:bg-purple-500/30 relative font-['Roboto',sans-serif]">
        {/* Top bar with logo */}
        <header className="flex justify-between items-center py-4 max-w-7xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">whenRUfree</span>
          </Link>

          {/* Header Log In: subtle purple, not bold */}
          <Link
            href="/auth/signin"
            className="px-4 py-2 bg-purple-600/60 text-white rounded-md font-normal hover:bg-purple-700/80 transition"
          >
            Log In
          </Link>
        </header>

        {/* Background Glow (matched to Landing) */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3b0764,transparent)] pointer-events-none" />

        {/* Main content: moved up to match Landing hero level */}
        <main className="relative z-10 flex-grow flex flex-col justify-start items-center px-6 text-center max-w-md mx-auto w-full">
          <div className="flex flex-col items-center mt-12 md:mt-20 w-full">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">
              Create your account
            </h1>

            {/* Subtitle */}
            <p className="text-md text-purple-100/80 mb-6 max-w-sm mx-auto">
              Make plans reality—effortlessly.
            </p>

            {/* Sign up with Google - white background with multicolor logo */}
            <button
              onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
              className="w-full flex items-center justify-center gap-3 bg-white text-black h-12 rounded-md font-medium hover:bg-gray-100 transition-all active:scale-[0.98] mb-4 shadow-sm"
              aria-label="Sign up with Google"
            >
              {/* Multicolor Google icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.6 12.227c0-.682-.062-1.337-.178-1.964H12v3.724h5.44c-.234 1.264-.945 2.337-2.013 3.055v2.542h3.25c1.903-1.75 3-4.329 3-7.357z" fill="#4285F4"/>
                <path d="M12 22c2.7 0 4.976-.892 6.64-2.42l-3.25-2.54c-.9.604-2.046.962-3.39.962-2.602 0-4.81-1.76-5.6-4.12H3.04v2.586C4.7 19.88 8.02 22 12 22z" fill="#34A853"/>
                <path d="M6.4 14.403c-.198-.597-.316-1.223-.316-1.883s.118-1.286.316-1.883V8.05H3.04C2.37 9.243 2 10.64 2 12c0 1.36.37 2.757 1.04 3.95l3.36-1.547z" fill="#FBBC05"/>
                <path d="M12 6.5c1.47 0 2.8.51 3.86 1.5l2.88-2.88C16.97 3.02 14.78 2 12 2 8.02 2 4.7 4.12 3.04 7.09l3.36 1.547C9.19 7.01 10.4 6.5 12 6.5z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>

            {/* "or" divider directly under Google button */}
            <div className="relative py-3 w-full mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-gray-500">or</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-black border border-white/20 rounded-md px-4 text-sm placeholder:text-gray-600 focus:outline-none focus:border-white/50 transition-colors"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-black border border-white/20 rounded-md px-4 text-sm placeholder:text-gray-600 focus:outline-none focus:border-white/50 transition-colors"
              />

              {/* Create Account button: more prominent, subtler purple */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-purple-600/80 text-white rounded-md font-extrabold text-lg hover:bg-purple-700/90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Full-width divider after Create Account */}
            <div className="relative py-4 w-full mt-6 mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
            </div>

            {/* Already have an account? - Log In uses subtle purple, normal weight */}
            <p className="mt-2 text-base text-gray-400">
              Already have an account?{' '}
              <Link
                href="/auth/signin"
                className="inline-block ml-2 px-3 py-1.5 bg-purple-600/60 text-white rounded-md font-normal hover:bg-purple-700/80 transition"
              >
                Log In
              </Link>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}