'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome, {session?.user?.email}!</h1>
        <p className="text-gray-400 text-lg">
          Let's get your profile set up so you can start scheduling.
        </p>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}