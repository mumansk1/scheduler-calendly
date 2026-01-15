'use client';

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
    
    // For Option B, we sign in using 'credentials'
    // This will trigger the authorize function in your NextAuth config
    await signIn('credentials', { 
      email, 
      password, 
      callbackUrl: '/onboarding' 
    });
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col px-6 selection:bg-purple-500/30 relative">
      {/* Top bar with logo */}
      <header className="flex justify-between items-center py-4 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">whenRUfree</span>
        </Link>
        <Link
          href="/auth/signin"
          className="px-4 py-2 bg-white text-black rounded-md font-semibold hover:bg-gray-200 transition"
        >
          Log In
        </Link>
      </header>

      {/* Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_40%,#1a1a1a,transparent)] pointer-events-none" />

      {/* Main content */}
      <main className="relative z-10 flex-grow flex flex-col justify-center items-center max-w-md mx-auto w-full text-center">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Create your account
        </h1>
        <p className="text-gray-500 mb-6">
          Start scheduling smarter today
        </p>

        <button
          onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
          className="w-full flex items-center justify-center gap-3 bg-white text-black h-12 rounded-md font-medium hover:bg-gray-200 transition-all active:scale-[0.98] mb-6"
          aria-label="Sign up with Google"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </button>

        <div className="relative py-4 w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-gray-500">or</span>
          </div>
        </div>

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
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-white/10 border border-white/20 text-white rounded-md font-medium hover:bg-white/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-white hover:underline">
            Log In
          </Link>
        </p>
      </main>
    </div>
  );
}